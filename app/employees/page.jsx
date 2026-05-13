"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, Clock } from "lucide-react";

import {
  fetchEmployees, updateEmployeeStatus, deleteEmployee,
  fetchShifts, toggleShiftStatus, deleteShift,
} from "@/redux/actions/employeeActions";
import { fetchShops } from "@/redux/actions/shopActions";

import { EmployeeFilter } from "@/components/filters/EmployeeFilter";
import { ShiftFilter } from "@/components/filters/ShiftFilter";
import { EmployeeTable } from "@/components/tables/EmployeeTable";
import { ShiftTable } from "@/components/tables/ShiftTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { EmployeeStats } from "@/components/cards/statCards/EmployeeStats";

import { EmployeeModal } from "@/components/modals/addUpdate/EmployeeModal";
import { EmployeeViewModal } from "@/components/modals/view/EmployeeViewModal";
import { ShiftModal } from "@/components/modals/addUpdate/ShiftModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";

const ITEMS_PER_PAGE = 15;
const initialEmpFilters = { search: "", status: [], department: [], primaryShop: "" };
const initialShiftFilters = { search: "", shop: "", isActive: [] };

export default function EmployeesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("employees");
  const [empFilters, setEmpFilters] = useState(initialEmpFilters);
  const [shiftFilters, setShiftFilters] = useState(initialShiftFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setAddOpen] = useState(false);
  const [isShiftModalOpen, setShiftModalOpen] = useState(false);
  const [viewData, setViewData] = useState({ isOpen: false, data: null });
  const [selectedItem, setSelectedItem] = useState(null);

  const [statusModal, setStatusModal] = useState({ isOpen: false, employee: null, newStatus: "", loading: false });
  const [deleteEmpModal, setDeleteEmpModal] = useState({ isOpen: false, employee: null, loading: false });
  const [shiftActionModal, setShiftActionModal] = useState({ isOpen: false, shift: null, actionType: "", loading: false });

  const searchDebounceTimer = useRef(null);
  const isMounted = useRef(false);
  const initialFetchDone = useRef(false);
  const skipNextPageEffect = useRef(true);
  const activeTabRef = useRef("employees");
  const empFiltersRef = useRef(initialEmpFilters);
  const shiftFiltersRef = useRef(initialShiftFilters);
  const pageRef = useRef(1);

  const { items, loading, pagination, shifts } = useSelector(state => state.employees);
  const { initialized: shopsInitialized, loading: shopsLoading } = useSelector(
    state => state.shops?.shops || { initialized: false, loading: false }
  );

  const runFetch = useCallback((tab, page, empF, shiftF) => {
    if (tab === "employees") {
      const params = { page, limit: ITEMS_PER_PAGE };
      if (empF.search) params.search = empF.search;
      if (empF.status?.length) params.status = empF.status.join(",");
      if (empF.department?.length) params.department = empF.department.join(",");
      if (empF.primaryShop) params.primaryShop = empF.primaryShop;
      dispatch(fetchEmployees(params));
    } else if (tab === "shifts") {
      const params = { page, limit: ITEMS_PER_PAGE };
      if (shiftF.search) params.search = shiftF.search;
      if (shiftF.shop) params.shop = shiftF.shop;
      if (shiftF.isActive?.length) params.isActive = shiftF.isActive[0];
      dispatch(fetchShifts(params));
    }
  }, [dispatch]);

  useEffect(() => { empFiltersRef.current = empFilters; }, [empFilters]);
  useEffect(() => { shiftFiltersRef.current = shiftFilters; }, [shiftFilters]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    skipNextPageEffect.current = true;
    if (!shopsInitialized && !shopsLoading) {
      dispatch(fetchShops({ limit: 100 }));
    }
    runFetch("employees", 1, initialEmpFilters, initialShiftFilters);
    const timer = setTimeout(() => {
      isMounted.current = true;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(activeTabRef.current, currentPage, empFiltersRef.current, shiftFiltersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(activeTab, 1, empFiltersRef.current, shiftFiltersRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "employees") return;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (empFilters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch("employees", 1, empFilters, shiftFiltersRef.current);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch("employees", 1, empFilters, shiftFiltersRef.current);
    }, 500);
  }, [empFilters.search]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "employees") return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch("employees", 1, empFilters, shiftFiltersRef.current);
  }, [empFilters.status, empFilters.department, empFilters.primaryShop]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "shifts") return;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (shiftFilters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch("shifts", 1, empFiltersRef.current, shiftFilters);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch("shifts", 1, empFiltersRef.current, shiftFilters);
    }, 500);
  }, [shiftFilters.search]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "shifts") return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch("shifts", 1, empFiltersRef.current, shiftFilters);
  }, [shiftFilters.shop, shiftFilters.isActive]);

  const refreshCurrent = useCallback(() => {
    runFetch(activeTabRef.current, pageRef.current, empFiltersRef.current, shiftFiltersRef.current);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleClearEmpFilters = () => {
    setEmpFilters(initialEmpFilters);
    empFiltersRef.current = initialEmpFilters;
    setCurrentPage(1);
    pageRef.current = 1;
    skipNextPageEffect.current = true;
    runFetch("employees", 1, initialEmpFilters, shiftFiltersRef.current);
  };

  const handleClearShiftFilters = () => {
    setShiftFilters(initialShiftFilters);
    shiftFiltersRef.current = initialShiftFilters;
    setCurrentPage(1);
    pageRef.current = 1;
    skipNextPageEffect.current = true;
    runFetch("shifts", 1, empFiltersRef.current, initialShiftFilters);
  };

  const handleModalClose = (setter) => (didSave) => {
    setter(false);
    setSelectedItem(null);
    if (didSave) refreshCurrent();
  };

  const confirmToggleStatus = async () => {
    setStatusModal(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(updateEmployeeStatus({
        id: statusModal.employee._id,
        status: statusModal.newStatus,
      })).unwrap();
      toast.success(t("employeeStatusUpdated"));
      setStatusModal({ isOpen: false, employee: null, newStatus: "", loading: false });
      refreshCurrent();
    } catch {
      toast.error(t("statusUpdateFailed"));
      setStatusModal(prev => ({ ...prev, loading: false }));
    }
  };

  const confirmDeleteEmployee = async () => {
    setDeleteEmpModal(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(deleteEmployee(deleteEmpModal.employee._id)).unwrap();
      toast.success(t("employeeDeleted"));
      setDeleteEmpModal({ isOpen: false, employee: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setDeleteEmpModal(prev => ({ ...prev, loading: false }));
    }
  };

  const confirmShiftAction = async () => {
    setShiftActionModal(prev => ({ ...prev, loading: true }));
    try {
      if (shiftActionModal.actionType === "TOGGLE_STATUS") {
        await dispatch(toggleShiftStatus(shiftActionModal.shift._id)).unwrap();
        toast.success(t("shiftStatusToggled"));
      } else if (shiftActionModal.actionType === "DELETE") {
        await dispatch(deleteShift(shiftActionModal.shift._id)).unwrap();
        toast.success(t("shiftDeleted"));
      }
      setShiftActionModal({ isOpen: false, shift: null, actionType: "", loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setShiftActionModal(prev => ({ ...prev, loading: false }));
    }
  };

  const shiftItems = Array.isArray(shifts?.items) ? shifts.items : [];

  if (!initialFetchDone.current && loading && !items.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <EmployeeStats employees={items} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide w-full sm:w-auto">
          {[
            { id: "employees", labelKey: "employees" },
            { id: "shifts", labelKey: "shiftManagement" },
          ].map(tab => (
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

        <div className="flex items-center gap-2">
          {activeTab === "employees" && (
            <button
              onClick={() => { setSelectedItem(null); setAddOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">{t("addEmployee")}</span>
            </button>
          )}
          {activeTab === "shifts" && (
            <button
              onClick={() => { setSelectedItem(null); setShiftModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
            >
              <Clock size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">{t("createShift")}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "employees" && (
          <>
            <EmployeeFilter
              filters={empFilters}
              setFilters={setEmpFilters}
              onClear={handleClearEmpFilters}
            />
            <EmployeeTable
              data={items}
              loading={loading}
              onView={(item) => setViewData({ isOpen: true, data: item })}
              onEdit={(item) => { setSelectedItem(item); setAddOpen(true); }}
              onToggleStatus={(emp, newStatus) =>
                setStatusModal({ isOpen: true, employee: emp, newStatus, loading: false })
              }
              onDelete={(emp) =>
                setDeleteEmpModal({ isOpen: true, employee: emp, loading: false })
              }
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "shifts" && (
          <>
            <ShiftFilter
              filters={shiftFilters}
              setFilters={setShiftFilters}
              onClear={handleClearShiftFilters}
            />
            <ShiftTable
              data={shiftItems}
              loading={shifts?.loading}
              onEdit={(item) => { setSelectedItem(item); setShiftModalOpen(true); }}
              onToggleStatus={(shift) =>
                setShiftActionModal({ isOpen: true, shift, actionType: "TOGGLE_STATUS", loading: false })
              }
              onDelete={(shift) =>
                setShiftActionModal({ isOpen: true, shift, actionType: "DELETE", loading: false })
              }
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={shifts?.pagination?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <EmployeeModal
        isOpen={isAddOpen}
        onClose={handleModalClose(setAddOpen)}
        initialData={selectedItem}
      />
      <EmployeeViewModal
        isOpen={viewData.isOpen}
        onClose={() => setViewData({ isOpen: false, data: null })}
        data={viewData.data}
      />
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={handleModalClose(setShiftModalOpen)}
        initialData={selectedItem}
      />

      <ConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        onConfirm={confirmToggleStatus}
        loading={statusModal.loading}
        message={
          statusModal.newStatus === "ACTIVE"
            ? t("confirmActivateMessage")
            : t("confirmSuspendMessage")
        }
      />

      <ConfirmationModal
        isOpen={deleteEmpModal.isOpen}
        onClose={() => setDeleteEmpModal({ ...deleteEmpModal, isOpen: false })}
        onConfirm={confirmDeleteEmployee}
        loading={deleteEmpModal.loading}
        message={`${t("deleteConfirm")} ${deleteEmpModal.employee?.firstName} ${deleteEmpModal.employee?.lastName}?`}
      />

      <ConfirmationModal
        isOpen={shiftActionModal.isOpen}
        onClose={() => setShiftActionModal({ ...shiftActionModal, isOpen: false })}
        onConfirm={confirmShiftAction}
        loading={shiftActionModal.loading}
        message={
          shiftActionModal.actionType === "DELETE"
            ? `${t("deleteConfirm")} ${shiftActionModal.shift?.name}?`
            : shiftActionModal.shift?.isActive
            ? t("confirmDeactivateShift")
            : t("confirmActivateShift")
        }
      />
    </div>
  );
}