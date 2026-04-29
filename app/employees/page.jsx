"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, Clock } from "lucide-react";

import {
  fetchEmployees, updateEmployeeStatus,
  fetchShifts, toggleShiftStatus, deleteShift
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
  const [shiftActionModal, setShiftActionModal] = useState({ isOpen: false, shift: null, actionType: "", loading: false });

  const debounceTimer = useRef(null);
  const initFetched = useRef(false);
  const isMounted = useRef(false);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const stateRef = useRef({ empFilters, shiftFilters, currentPage });
  useEffect(() => {
    stateRef.current = { empFilters, shiftFilters, currentPage };
  });

  const { items, loading, pagination, shifts } = useSelector(state => state.employees);

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchShops({ limit: 100 }));
      initFetched.current = true;
    }
  }, [dispatch]);

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

  const scheduleFetch = useCallback((tab, page, empF, shiftF, delay = 300) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runFetch(tab, page, empF, shiftF);
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
      runFetch("employees", 1, initialEmpFilters, initialShiftFilters);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleFetch(activeTab, currentPage, stateRef.current.empFilters, stateRef.current.shiftFilters, 0);
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "employees") return;
    setCurrentPage(1);
    scheduleFetch("employees", 1, empFilters, stateRef.current.shiftFilters, 300);
  }, [
    empFilters.search,
    empFilters.status,
    empFilters.department,
    empFilters.primaryShop,
  ]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (activeTabRef.current !== "shifts") return;
    setCurrentPage(1);
    scheduleFetch("shifts", 1, stateRef.current.empFilters, shiftFilters, 300);
  }, [
    shiftFilters.search,
    shiftFilters.shop,
    shiftFilters.isActive,
  ]);

  const refreshCurrent = useCallback(() => {
    const { empFilters: empF, shiftFilters: shiftF, currentPage: page } = stateRef.current;
    runFetch(activeTabRef.current, page, empF, shiftF);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClearEmpFilters = () => {
    setEmpFilters(initialEmpFilters);
    setCurrentPage(1);
  };

  const handleClearShiftFilters = () => {
    setShiftFilters(initialShiftFilters);
    setCurrentPage(1);
  };

  const handleRequestToggleStatus = (emp, newStatus) => {
    setStatusModal({ isOpen: true, employee: emp, newStatus, loading: false });
  };

  const confirmToggleStatus = async () => {
    setStatusModal(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(updateEmployeeStatus({ id: statusModal.employee._id, status: statusModal.newStatus })).unwrap();
      toast.success(t("success") || "Employee status updated");
      setStatusModal({ isOpen: false, employee: null, newStatus: "", loading: false });
      refreshCurrent();
    } catch {
      toast.error(t("error") || "Failed to update status");
      setStatusModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRequestToggleShift = (shift) => {
    setShiftActionModal({ isOpen: true, shift, actionType: "TOGGLE_STATUS", loading: false });
  };

  const handleRequestDeleteShift = (shift) => {
    setShiftActionModal({ isOpen: true, shift, actionType: "DELETE", loading: false });
  };

  const confirmShiftAction = async () => {
    setShiftActionModal(prev => ({ ...prev, loading: true }));
    try {
      if (shiftActionModal.actionType === "TOGGLE_STATUS") {
        await dispatch(toggleShiftStatus(shiftActionModal.shift._id)).unwrap();
        toast.success("Shift status toggled successfully");
      } else if (shiftActionModal.actionType === "DELETE") {
        await dispatch(deleteShift(shiftActionModal.shift._id)).unwrap();
        toast.success("Shift deleted successfully");
      }
      setShiftActionModal({ isOpen: false, shift: null, actionType: "", loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Action failed");
      setShiftActionModal(prev => ({ ...prev, loading: false }));
    }
  };

  const shiftItems = Array.isArray(shifts?.items) ? shifts.items : [];

  if (!isMounted.current && loading && !items.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <EmployeeStats employees={items} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div key={language} className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto">
          {[
            { id: "employees", label: t("employees") || "Staff Directory" },
            { id: "shifts", label: "Shift Management" }
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

        <div className="flex items-center gap-2">
          {activeTab === "employees" && (
            <button
              onClick={() => { setSelectedItem(null); setAddOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">{t("addEmployee") || "Add Employee"}</span>
            </button>
          )}
          {activeTab === "shifts" && (
            <button
              onClick={() => { setSelectedItem(null); setShiftModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
            >
              <Clock size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">Create Shift</span>
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
              onApply={() => {}}
              onClear={handleClearEmpFilters}
            />
            <EmployeeTable
              data={items}
              loading={loading}
              onView={(item) => setViewData({ isOpen: true, data: item })}
              onEdit={(item) => { setSelectedItem(item); setAddOpen(true); }}
              onToggleStatus={handleRequestToggleStatus}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {activeTab === "shifts" && (
          <>
            <ShiftFilter
              filters={shiftFilters}
              setFilters={setShiftFilters}
              onApply={() => {}}
              onClear={handleClearShiftFilters}
            />
            <ShiftTable
              data={shiftItems}
              loading={shifts?.loading}
              onEdit={(item) => { setSelectedItem(item); setShiftModalOpen(true); }}
              onToggleStatus={handleRequestToggleShift}
              onDelete={handleRequestDeleteShift}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={shifts?.pagination?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <EmployeeModal
        isOpen={isAddOpen}
        onClose={() => { setAddOpen(false); refreshCurrent(); }}
        initialData={selectedItem}
      />
      <EmployeeViewModal
        isOpen={viewData.isOpen}
        onClose={() => setViewData({ isOpen: false, data: null })}
        data={viewData.data}
      />
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => { setShiftModalOpen(false); refreshCurrent(); }}
        initialData={selectedItem}
      />

      <ConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        onConfirm={confirmToggleStatus}
        loading={statusModal.loading}
        title={statusModal.newStatus === "ACTIVE" ? (t("confirmActivateTitle") || "Activate Employee") : (t("confirmSuspendTitle") || "Suspend Employee")}
        message={statusModal.newStatus === "ACTIVE" ? (t("confirmActivateMessage") || "Are you sure you want to activate this employee?") : (t("confirmSuspendMessage") || "Are you sure you want to suspend this employee?")}
        confirmText={statusModal.newStatus === "ACTIVE" ? (t("activate") || "Activate") : (t("suspend") || "Suspend")}
        warningText={t("confirmActionWarning") || "Please confirm your action."}
        confirmClass={statusModal.newStatus === "ACTIVE" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
        iconColor={statusModal.newStatus === "ACTIVE" ? "text-green-500" : "text-red-500"}
      />

      <ConfirmationModal
        isOpen={shiftActionModal.isOpen}
        onClose={() => setShiftActionModal({ ...shiftActionModal, isOpen: false })}
        onConfirm={confirmShiftAction}
        loading={shiftActionModal.loading}
        title={shiftActionModal.actionType === "DELETE" ? "Delete Shift" : (shiftActionModal.shift?.isActive ? "Deactivate Shift" : "Activate Shift")}
        message={shiftActionModal.actionType === "DELETE" ? "Are you sure you want to completely delete this shift?" : `Are you sure you want to ${shiftActionModal.shift?.isActive ? "deactivate" : "activate"} this shift?`}
        confirmText={shiftActionModal.actionType === "DELETE" ? (t("delete") || "Delete") : (shiftActionModal.shift?.isActive ? "Deactivate" : "Activate")}
        warningText={shiftActionModal.actionType === "DELETE" ? "This action cannot be undone and removes it from the system." : "Please confirm your action."}
        confirmClass={shiftActionModal.actionType === "DELETE" || shiftActionModal.shift?.isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
        iconColor={shiftActionModal.actionType === "DELETE" || shiftActionModal.shift?.isActive ? "text-red-500" : "text-green-500"}
      />
    </div>
  );
}