"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, CheckCircle, Eye, Edit2 } from "lucide-react";

import {
  fetchSalaryStructures,
  processSalaryPayment,
  fetchSalariesByMonth,
} from "@/redux/actions/salaryActions";
import { fetchShops } from "@/redux/actions/shopActions";
import { fetchEmployees } from "@/redux/actions/employeeActions";

import { BaseTable } from "@/components/tables/BaseTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { SalaryFilter } from "@/components/filters/SalaryFilter";

import { SalaryStructureModal } from "@/components/modals/addUpdate/SalaryStructureModal";
import { PaySalaryModal } from "@/components/modals/addUpdate/PaySalaryModal";
import { StructureViewModal } from "@/components/modals/view/StructureViewModal";

const ITEMS_PER_PAGE = 15;

const initialSalaryFilters = { search: "", shopId: "", paymentStatus: [] };

export default function SalariesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [activeTab, setActiveTab] = useState("structures");
  const [salaryFilters, setSalaryFilters] = useState(initialSalaryFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isStructureModalOpen, setStructureModalOpen] = useState(false);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [viewStructure, setViewStructure] = useState({ isOpen: false, data: null });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const debounceTimer = useRef(null);
  const initialFetchDone = useRef(false);
  const skipNextPageEffect = useRef(true);
  const shopsFetched = useRef(false);
  const employeesFetched = useRef(false);
  const activeTabRef = useRef("structures");
  const salaryFiltersRef = useRef(initialSalaryFilters);
  const pageRef = useRef(1);

  const { structures, salaries } = useSelector(state => state.salary || {
    structures: { items: [], loading: false, pagination: {} },
    salaries: { items: [], totals: {}, loading: false, pagination: {} },
  });

  const employeesState = useSelector(state => state.employees);
  const employees = employeesState?.items || [];
  const employeesLoading = employeesState?.loading || false;

  const runFetch = useCallback((tab, page, filters) => {
    if (tab === "structures") {
      dispatch(fetchSalaryStructures({ page, limit: ITEMS_PER_PAGE }));
    } else if (tab === "paySalary") {
      if (!employeesFetched.current) {
        employeesFetched.current = true;
        const employeeParams = { limit: 100, isActive: true };
        if (filters.shopId) employeeParams.shopId = filters.shopId;
        dispatch(fetchEmployees(employeeParams));
      }
      dispatch(fetchSalariesByMonth({
        month: currentMonth,
        year: currentYear,
        params: {
          shopId: filters.shopId || undefined,
          paymentStatus: filters.paymentStatus?.length > 0 ? filters.paymentStatus.join(",") : undefined,
        },
      }));
    }
  }, [dispatch, currentMonth, currentYear]);

  useEffect(() => { salaryFiltersRef.current = salaryFilters; }, [salaryFilters]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    skipNextPageEffect.current = true;
    runFetch("structures", 1, initialSalaryFilters);
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(activeTabRef.current, currentPage, salaryFiltersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!initialFetchDone.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;

    if (activeTab === "paySalary" && !shopsFetched.current) {
      shopsFetched.current = true;
      dispatch(fetchShops({ limit: 100 }));
    }

    runFetch(activeTab, 1, salaryFiltersRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (!initialFetchDone.current) return;
    if (activeTabRef.current !== "paySalary") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;

      if (salaryFilters.shopId) {
        employeesFetched.current = false;
      }

      runFetch("paySalary", 1, salaryFilters);
    }, 300);
  }, [salaryFilters.search, salaryFilters.shopId, salaryFilters.paymentStatus]);

  const refreshCurrent = useCallback(() => {
    runFetch(activeTabRef.current, pageRef.current, salaryFiltersRef.current);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSalaryFilters(initialSalaryFilters);
    setCurrentPage(1);
  };

  const handlePaySalary = async (paymentData) => {
    try {
      await dispatch(processSalaryPayment({
        id: paymentData.salaryId,
        data: {
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          transactionReference: paymentData.transactionReference,
        },
      })).unwrap();
      toast.success(t("paymentSuccess"));
      setPayModalOpen(false);
      setSelectedEmployee(null);
      refreshCurrent();
    } catch {
      toast.error(t("paymentError"));
    }
  };

  const getEmployeeSalary = (employeeId) => {
    return salaries?.items?.find(s => {
      const sEmpId = s.employee?._id || s.employee;
      return sEmpId === employeeId;
    });
  };

  const isEmployeePaid = (employeeId) => {
    const salaryRecord = getEmployeeSalary(employeeId);
    return salaryRecord?.paymentStatus === "PAID";
  };

  const openPayModal = (employee) => {
    if (!employee || !employee._id) {
      toast.error(t("invalidEmployeeData"));
      return;
    }
    setSelectedEmployee(employee);
    setPayModalOpen(true);
  };

  const filteredEmployees = employees.filter(employee => {
    const salaryRecord = getEmployeeSalary(employee._id);

    if (salaryFilters.search) {
      const searchLower = salaryFilters.search.toLowerCase();
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const employeeId = (employee.employeeId || "").toLowerCase();
      if (!fullName.includes(searchLower) && !employeeId.includes(searchLower)) return false;
    }

    if (salaryFilters.paymentStatus.length > 0) {
      const isPaid = salaryRecord?.paymentStatus === "PAID";
      if (salaryFilters.paymentStatus.includes("PAID") && !isPaid) return false;
      if (salaryFilters.paymentStatus.includes("UNPAID") && isPaid) return false;
    }

    return true;
  });

  const structureCols = [
    { header: t("code"), accessor: "code" },
    { header: t("name"), accessor: "name" },
    {
      header: t("basicSalary"),
      render: (r) => (
        <span className="font-bold flex items-center gap-1">
          ⃁ {r.basicSalary?.toLocaleString()}
        </span>
      ),
    },
    {
      header: t("grossSalary"),
      render: (r) => (
        <span className="font-black text-[#E9B10C] flex items-center gap-1">
          ⃁ {r.grossSalary?.toLocaleString()}
        </span>
      ),
    },
    {
      header: t("status"),
      render: (r) => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${r.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {r.isActive ? t("active") : t("inactive")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (r) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setViewStructure({ isOpen: true, data: r })}
            className="text-neutral-500 hover:text-blue-500 transition-colors"
            title={t("view")}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => { setSelectedItem(r); setStructureModalOpen(true); }}
            className="text-neutral-500 hover:text-[#E9B10C] transition-colors"
            title={t("edit")}
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const employeeCols = [
    {
      header: t("employee"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-black dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase">{row.employeeId}</span>
        </div>
      ),
    },
    { header: t("designation"), accessor: "designation" },
    {
      header: t("department"),
      render: (row) => (
        <span className="text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          {row.department || "-"}
        </span>
      ),
    },
    {
      header: t("shop"),
      render: (row) => (
        <span className="text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          {row.primaryShop?.name || "-"}
        </span>
      ),
    },
    {
      header: t("salaryStructure"),
      render: (row) => (
        <span className="text-[9px] font-medium text-neutral-600 dark:text-neutral-400">
          {row.salaryStructure?.name || t("notAssigned")}
        </span>
      ),
    },
    {
      header: t("salaryStatus"),
      render: (row) => {
        const isPaid = isEmployeePaid(row._id);
        return isPaid ? (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 rounded-sm w-fit text-[8px] uppercase font-bold">
            <CheckCircle size={10} /> {t("paid")}
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-sm w-fit text-[8px] uppercase font-bold">
            {t("unpaid")}
          </span>
        );
      },
    },
    {
      header: t("actions"),
      render: (row) => {
        const isPaid = isEmployeePaid(row._id);
        return isPaid ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-sm w-fit text-[9px] uppercase font-bold">
            <CheckCircle size={12} /> {t("paid")}
          </span>
        ) : (
          <button
            onClick={() => openPayModal(row)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9B10C] text-black hover:bg-[#d6a00b] transition-colors rounded-sm text-[9px] uppercase font-bold"
          >
            ⃁ {t("pay")}
          </button>
        );
      },
    },
  ];

  if (!initialFetchDone.current && structures.loading && !structures.items.length) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide w-full xl:w-auto">
          {[
            { id: "structures", labelKey: "salaryStructures" },
            { id: "paySalary", labelKey: "paySalary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === "structures" && (
            <button
              onClick={() => { setSelectedItem(null); setStructureModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">{t("addStructure")}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "structures" && (
          <>
            <BaseTable columns={structureCols} data={structures.items || []} loading={structures.loading} />
            <BasePagination
              currentPage={currentPage}
              totalPages={structures.pagination?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "paySalary" && (
          <>
            <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <p className="text-[11px] font-medium text-neutral-500">
                  {t("currentMonthYear")}: {new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} {currentYear}
                </p>
                <div className="flex gap-4 text-[9px] font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-green-500" />
                    <span className="text-green-500">{t("paid")}</span>
                    <span className="text-neutral-400 font-bold ml-1">
                      ({filteredEmployees.filter(e => isEmployeePaid(e._id)).length})
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-red-500">{t("unpaid")}</span>
                    <span className="text-neutral-400 font-bold ml-1">
                      ({filteredEmployees.filter(e => !isEmployeePaid(e._id)).length})
                    </span>
                  </span>
                </div>
              </div>
              <SalaryFilter
                filters={salaryFilters}
                setFilters={setSalaryFilters}
                onClear={handleClearFilters}
              />
            </div>
            <BaseTable
              columns={employeeCols}
              data={filteredEmployees}
              loading={employeesLoading || salaries.loading}
            />
          </>
        )}
      </div>

      <SalaryStructureModal
        isOpen={isStructureModalOpen}
        onClose={(didSave) => {
          setStructureModalOpen(false);
          setSelectedItem(null);
          if (didSave) refreshCurrent();
        }}
        initialData={selectedItem}
      />
      <PaySalaryModal
        isOpen={isPayModalOpen}
        onClose={(didSave) => {
          setPayModalOpen(false);
          setSelectedEmployee(null);
          if (didSave) refreshCurrent();
        }}
        employee={selectedEmployee}
        month={currentMonth}
        year={currentYear}
        existingSalary={selectedEmployee ? getEmployeeSalary(selectedEmployee._id) : null}
        onPay={handlePaySalary}
      />
      <StructureViewModal
        isOpen={viewStructure.isOpen}
        onClose={() => setViewStructure({ isOpen: false, data: null })}
        structure={viewStructure.data}
      />
    </div>
  );
}