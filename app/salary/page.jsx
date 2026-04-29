"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, DollarSign, CheckCircle } from "lucide-react";

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
  const initFetched = useRef(false);
  const isMounted = useRef(false);

  const stateRef = useRef({ activeTab, salaryFilters, currentPage });
  useEffect(() => {
    stateRef.current = { activeTab, salaryFilters, currentPage };
  });

  const { structures, salaries } = useSelector(state => state.salary || {
    structures: { items: [], loading: false, pagination: {} },
    salaries: { items: [], totals: {}, loading: false, pagination: {} }
  });

  const employeesState = useSelector(state => state.employees);
  const employees = employeesState?.items || [];
  const employeesLoading = employeesState?.loading || false;

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchShops({ limit: 100 }));
      initFetched.current = true;
    }
  }, [dispatch]);

  const runFetch = useCallback((tab, page, filters) => {
    if (tab === "structures") {
      dispatch(fetchSalaryStructures({ page, limit: ITEMS_PER_PAGE }));
    } else if (tab === "paySalary") {
      const employeeParams = { limit: 100, isActive: true };
      if (filters.search) employeeParams.search = filters.search;
      if (filters.shopId) employeeParams.shopId = filters.shopId;
      dispatch(fetchEmployees(employeeParams));
      dispatch(fetchSalariesByMonth({
        month: currentMonth,
        year: currentYear,
        params: {
          shopId: filters.shopId || undefined,
          paymentStatus: filters.paymentStatus?.length > 0 ? filters.paymentStatus.join(",") : undefined,
        }
      }));
    }
  }, [dispatch, currentMonth, currentYear]);

  const scheduleFetch = useCallback((tab, page, filters, delay = 300) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runFetch(tab, page, filters);
    }, delay);
  }, [runFetch]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      runFetch("structures", 1, initialSalaryFilters);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleFetch(activeTab, currentPage, stateRef.current.salaryFilters, 0);
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (stateRef.current.activeTab !== "paySalary") return;
    scheduleFetch("paySalary", 1, salaryFilters, 300);
    setCurrentPage(1);
  }, [
    salaryFilters.search,
    salaryFilters.shopId,
    salaryFilters.paymentStatus,
  ]);

  const refreshCurrent = useCallback(() => {
    const { activeTab: tab, currentPage: page, salaryFilters: filters } = stateRef.current;
    runFetch(tab, page, filters);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === stateRef.current.activeTab) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

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
        }
      })).unwrap();
      toast.success(t("paymentSuccess") || "Payment processed successfully");
      setPayModalOpen(false);
      setSelectedEmployee(null);
      refreshCurrent();
    } catch {
      toast.error(t("paymentError") || "Payment failed");
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
      toast.error("Invalid employee data");
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
      const isUnpaid = !salaryRecord || salaryRecord?.paymentStatus !== "PAID";
      if (salaryFilters.paymentStatus.includes("PAID") && !isPaid) return false;
      if (salaryFilters.paymentStatus.includes("UNPAID") && !isUnpaid) return false;
    }

    return true;
  });

  const structureCols = [
    { header: t("code") || "Code", accessor: "code" },
    { header: t("name") || "Name", accessor: "name" },
    { header: t("basic") || "Basic", render: r => <span className="font-bold">{r.basicSalary?.toLocaleString()}</span> },
    { header: t("gross") || "Gross", render: r => <span className="font-black text-[#E9B10C]">{r.grossSalary?.toLocaleString()}</span> },
    {
      header: t("status") || "Status",
      render: r => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${r.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {r.isActive ? (t("active") || "Active") : (t("inactive") || "Inactive")}
        </span>
      )
    },
    {
      header: t("actions") || "Actions",
      render: r => (
        <div className="flex gap-3 items-center">
          <button onClick={() => setViewStructure({ isOpen: true, data: r })} className="text-neutral-500 hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button onClick={() => { setSelectedItem(r); setStructureModalOpen(true); }} className="text-neutral-500 hover:text-[#E9B10C] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3l4 4-7 7H10v-4l7-7z"></path><path d="M14 8l-6 6"></path><path d="M4 20h16"></path></svg>
          </button>
        </div>
      )
    }
  ];

  const employeeCols = [
    {
      header: t("employee") || "Employee",
      render: row => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black">{row.firstName} {row.lastName}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{row.employeeId}</span>
        </div>
      )
    },
    { header: t("designation") || "Designation", accessor: "designation" },
    { header: t("department") || "Department", render: row => <span className="text-[9px] uppercase tracking-wider">{row.department || "-"}</span> },
    { header: t("shop") || "Shop", render: row => <span className="text-[9px] uppercase tracking-wider">{row.primaryShop?.name || "-"}</span> },
    { header: t("salaryStructure") || "Salary Structure", render: row => <span className="text-[9px] font-medium">{row.salaryStructure?.name || t("notAssigned") || "Not Assigned"}</span> },
    {
      header: t("status") || "Status",
      render: row => {
        const isPaid = isEmployeePaid(row._id);
        return isPaid ? (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 rounded-sm w-fit text-[8px] uppercase font-bold">
            <CheckCircle size={10} /> {t("paid") || "Paid"}
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-sm w-fit text-[8px] uppercase font-bold">
            {t("unpaid") || "Unpaid"}
          </span>
        );
      }
    },
    {
      header: t("actions") || "Actions",
      render: row => {
        const isPaid = isEmployeePaid(row._id);
        return isPaid ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-sm w-fit text-[9px] uppercase font-bold">
            <CheckCircle size={12} /> {t("paid") || "Paid"}
          </span>
        ) : (
          <button onClick={() => openPayModal(row)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9B10C] text-black hover:bg-[#d6a00b] transition-colors rounded-sm text-[9px] uppercase font-bold">
            <DollarSign size={12} /> {t("pay") || "Pay"}
          </button>
        );
      }
    }
  ];

  if (!isMounted.current && structures.loading && !structures.items.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full">
        <div key={language} className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full xl:w-auto">
          {[
            { id: "structures", label: t("salaryStructures") || "Salary Structures" },
            { id: "paySalary", label: t("paySalary") || "Pay Salary" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${activeTab === tab.id ? "bg-[#E9B10C] text-black shadow-sm" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
          {activeTab === "structures" && (
            <button
              onClick={() => { setSelectedItem(null); setStructureModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">{t("addStructure") || "Add Structure"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "structures" && (
          <>
            <BaseTable columns={structureCols} data={structures.items || []} loading={structures.loading} />
            <BasePagination currentPage={currentPage} totalPages={structures.pagination?.totalPages || 1} onPageChange={handlePageChange} />
          </>
        )}

        {activeTab === "paySalary" && (
          <>
            <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[11px] font-medium text-neutral-500">
                  {t("currentMonthYear") || "Current Month & Year"}: {new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} {currentYear}
                </p>
                <div className="flex gap-3 text-[9px] font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={10} className="text-green-500" />
                    <span className="text-green-500">{t("paid") || "Paid"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-red-500">{t("unpaid") || "Unpaid"}</span>
                  </span>
                </div>
              </div>
              <SalaryFilter
                filters={salaryFilters}
                setFilters={setSalaryFilters}
                onApply={() => {}}
                onClear={handleClearFilters}
              />
            </div>
            <BaseTable columns={employeeCols} data={filteredEmployees} loading={employeesLoading || salaries.loading} />
          </>
        )}
      </div>

      <SalaryStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => { setStructureModalOpen(false); refreshCurrent(); }}
        initialData={selectedItem}
      />
      <PaySalaryModal
        isOpen={isPayModalOpen}
        onClose={(isSuccess) => {
          setPayModalOpen(false);
          setSelectedEmployee(null);
          refreshCurrent();
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