"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2, Loader2 } from "lucide-react";

import {
  fetchFullMonitoring,
  fetchAllClosings,
  approveClosing,
  rejectClosing,
  bulkApproveClosings,
  createClosingForShop,
  deleteClosing,
} from "@/redux/actions/monitoringActions";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { MonitorStats, ShopStatusPanel } from "@/components/cards/statCards/MonitoringStats";
import { MonitoringPerfTable, MonitoringClosingTable, PendingClosingsList } from "@/components/tables/MonitoringTables";
import { ClosingsTable } from "@/components/tables/ClosingsTable";
import { ClosingFilter } from "@/components/filters/ClosingFilter";
import { CreateClosingModal } from "@/components/modals/addUpdate/CreateClosingModal";
import { ClosingDetailModal } from "@/components/modals/view/ClosingDetailModal";
import { BasePagination } from "@/components/pagination/BasePagination";
import { BaseModal } from "@/components/modals/BaseModal";

const ITEMS_PER_PAGE = 15;

const initialClosingFilters = {
  search: "",
  shop: "",
  status: [],
  startDate: "",
  endDate: "",
};

const slimScrollbarX =
  "overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full";

const slimScrollbarY =
  "overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full";

export default function MonitoringPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("ALL");
  const [closingsPage, setClosingsPage] = useState(1);
  const [closingFilters, setClosingFilters] = useState(initialClosingFilters);
  const [closingsFetched, setClosingsFetched] = useState(false);

  const [isCreateClosingOpen, setCreateClosingOpen] = useState(false);
  const [viewClosingId, setViewClosingId] = useState(null);
  const [selectedShopForClosing, setSelectedShopForClosing] = useState(null);
  const [deleteClosingModal, setDeleteClosingModal] = useState({
    isOpen: false,
    closing: null,
    reason: "",
    loading: false,
  });

  const fetchedRef = useRef(false);
  const debounceTimer = useRef(null);
  const filtersRef = useRef(initialClosingFilters);
  const pageRef = useRef(1);
  const skipNextPageEffect = useRef(true);
  const activeTabRef = useRef("ALL");

  const { data, loading } = useSelector((state) => state.monitoring);
  const { closings } = useSelector((state) => state.monitoring);

  const buildClosingParams = (f, page) => {
    const params = { page, limit: ITEMS_PER_PAGE };
    if (f.search?.trim()) params.search = f.search.trim();
    if (f.shop) params.shop = f.shop;
    if (f.status?.length) params.status = f.status.join(",");
    if (f.startDate) params.startDate = f.startDate;
    if (f.endDate) params.endDate = f.endDate;
    return params;
  };

  const runClosingsFetch = (f, page) => {
    dispatch(fetchAllClosings(buildClosingParams(f, page)));
  };

  useEffect(() => {
    filtersRef.current = closingFilters;
  }, [closingFilters]);

  useEffect(() => {
    pageRef.current = closingsPage;
  }, [closingsPage]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(fetchFullMonitoring());
  }, []);

  useEffect(() => {
    if (activeTab !== "CLOSINGS") return;

    if (!closingsFetched) {
      setClosingsFetched(true);
      skipNextPageEffect.current = true;
      runClosingsFetch(initialClosingFilters, 1);
      return;
    }
  }, [activeTab]);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    if (activeTabRef.current !== "CLOSINGS") return;
    runClosingsFetch(filtersRef.current, closingsPage);
  }, [closingsPage]);

  useEffect(() => {
    if (!closingsFetched) return;
    if (activeTabRef.current !== "CLOSINGS") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setClosingsPage(1);
      pageRef.current = 1;
      runClosingsFetch(closingFilters, 1);
    }, 300);
  }, [
    closingFilters.search,
    closingFilters.shop,
    closingFilters.status,
    closingFilters.startDate,
    closingFilters.endDate,
  ]);

  const handleRefresh = () => {
    dispatch(fetchFullMonitoring());
    if (activeTabRef.current === "CLOSINGS") {
      runClosingsFetch(filtersRef.current, pageRef.current);
    }
    toast.success(t("dataRefreshed"));
  };

  const handleApproveClosing = async (closingId, remarks = "") => {
    try {
      await dispatch(approveClosing({ closingId, remarks })).unwrap();
      toast.success(t("closingApproved"));
      dispatch(fetchFullMonitoring());
      if (activeTabRef.current === "CLOSINGS") {
        runClosingsFetch(filtersRef.current, pageRef.current);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleRejectClosing = async (closingId, reason = "Rejected by admin") => {
    try {
      await dispatch(rejectClosing({ closingId, reason })).unwrap();
      toast.success(t("closingRejected"));
      dispatch(fetchFullMonitoring());
      if (activeTabRef.current === "CLOSINGS") {
        runClosingsFetch(filtersRef.current, pageRef.current);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleBulkApprove = async (ids) => {
    try {
      const result = await dispatch(
        bulkApproveClosings({ closingIds: ids, remarks: "Bulk approved" })
      ).unwrap();
      toast.success(`${result.approved?.length || 0} ${t("closingsApproved")}`);
      dispatch(fetchFullMonitoring());
      if (activeTabRef.current === "CLOSINGS") {
        runClosingsFetch(filtersRef.current, pageRef.current);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleCreateClosing = (shop) => {
    setSelectedShopForClosing(shop);
    setCreateClosingOpen(true);
  };

  const handleCreateClosingSubmit = async (formData) => {
    try {
      await dispatch(createClosingForShop(formData)).unwrap();
      toast.success(t("closingCreated"));
      setCreateClosingOpen(false);
      dispatch(fetchFullMonitoring());
      if (activeTabRef.current === "CLOSINGS") {
        runClosingsFetch(filtersRef.current, pageRef.current);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleDeleteClosing = (closing) => {
    setDeleteClosingModal({ isOpen: true, closing, reason: "", loading: false });
  };

  const confirmDeleteClosing = async () => {
    if (!deleteClosingModal.reason.trim()) {
      toast.error(t("deletionReasonRequired"));
      return;
    }
    setDeleteClosingModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(
        deleteClosing({
          closingId: deleteClosingModal.closing._id,
          reason: deleteClosingModal.reason,
        })
      ).unwrap();
      toast.success(t("closingDeleted"));
      setDeleteClosingModal({ isOpen: false, closing: null, reason: "", loading: false });
      dispatch(fetchFullMonitoring());
      if (activeTabRef.current === "CLOSINGS") {
        runClosingsFetch(filtersRef.current, pageRef.current);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setDeleteClosingModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClearClosingFilters = () => {
    setClosingFilters(initialClosingFilters);
    setClosingsPage(1);
  };

  if (loading || !data?.dashboard) return <PageSkeleton />;

  const {
    dashboard,
    performance = [],
    pendingDues,
    staffOverview,
    closingStatus,
  } = data;

  const shops = dashboard.shops || [];

  const getShopPerformance = (id) =>
    performance?.find((p) => p._id === id || p.shopId === id) || {};

  const getShopStaff = (id) =>
    staffOverview?.find((s) => s._id === id || s.shopId === id) || {
      managers: 0,
      cashiers: 0,
      salesStaff: 0,
      totalStaff: 0,
    };

  const getShopClosing = (id) =>
    closingStatus?.status?.find((c) => c.shop?._id === id) || null;

  const getShopDues = (id) =>
    pendingDues?.wallets?.find((w) => w.shop?._id === id) || {};

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-[11px] uppercase tracking-[0.3em] font-black text-black dark:text-white">
          {t("monitoring")}
        </h1>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-[10px] uppercase font-black tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
        >
          <RefreshCw size={13} />
          {t("refresh")}
        </button>
      </div>

      <MonitorStats dashboard={dashboard} />

      <div className="w-full border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className={`flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto ${slimScrollbarX}`}>
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === "ALL"
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {t("globalOverview")}
            </button>
            {shops.map((shop) => (
              <button
                key={shop._id}
                type="button"
                onClick={() => setActiveTab(shop._id)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm whitespace-nowrap ${
                  activeTab === shop._id
                    ? "bg-[#E9B10C] text-black shadow-sm"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {shop.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveTab("CLOSINGS")}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === "CLOSINGS"
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {t("allClosings")}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleCreateClosing(null)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors text-[10px] uppercase font-black tracking-widest rounded-sm shrink-0 w-full sm:w-auto"
          >
            <Plus size={13} strokeWidth={3} />
            {t("createClosing")}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "ALL" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className={`xl:col-span-6 h-[420px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}>
                <PendingClosingsList
                  closingStatus={closingStatus}
                  onApprove={handleApproveClosing}
                  onReject={handleRejectClosing}
                  onCreateClosing={handleCreateClosing}
                />
              </div>
              <div className={`xl:col-span-6 h-[420px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}>
                <MonitoringClosingTable closingStatus={closingStatus} />
              </div>
            </div>
            <div className={`h-[350px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}>
              <MonitoringPerfTable performance={performance} />
            </div>
          </div>
        )}

        {activeTab === "CLOSINGS" && (
          <div className="space-y-4">
            <ClosingFilter
              filters={closingFilters}
              setFilters={setClosingFilters}
              onClear={handleClearClosingFilters}
            />
            <ClosingsTable
              data={closings.items}
              loading={closings.loading}
              stats={closings.stats}
              onApprove={handleApproveClosing}
              onReject={handleRejectClosing}
              onView={(id) => setViewClosingId(id)}
              onBulkApprove={handleBulkApprove}
              onDelete={handleDeleteClosing}
            />
            <BasePagination
              currentPage={closingsPage}
              totalPages={closings.pagination?.totalPages || 1}
              onPageChange={setClosingsPage}
            />
          </div>
        )}

        {activeTab !== "ALL" && activeTab !== "CLOSINGS" && (
          <div className="space-y-6">
            <ShopStatusPanel
              closing={getShopClosing(activeTab)}
              staff={getShopStaff(activeTab)}
              dues={getShopDues(activeTab)}
              shopName={shops.find((s) => s._id === activeTab)?.name}
              onApproveClosing={handleApproveClosing}
              onRejectClosing={handleRejectClosing}
              onCreateClosing={() =>
                handleCreateClosing(shops.find((s) => s._id === activeTab))
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3 text-[#E9B10C]">
                  {t("staffOverview")}
                </h3>
                <div className="space-y-4">
                  {[
                    { label: t("managers"), value: getShopStaff(activeTab).managers || 0 },
                    { label: t("cashiers"), value: getShopStaff(activeTab).cashiers || 0 },
                    { label: t("salesStaff"), value: getShopStaff(activeTab).salesStaff || 0 },
                    { label: t("totalStaff"), value: getShopStaff(activeTab).totalStaff || 0 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                    >
                      <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="font-black text-[14px] text-black dark:text-white bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-700 w-10 h-10 rounded-sm flex items-center justify-center">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3 text-[#E9B10C]">
                  {t("performanceOverview")}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: t("totalSales"),
                      value: (
                        <span className="flex items-center gap-1 text-green-500 text-xl font-black">
                          ⃁ {(getShopPerformance(activeTab).totalSales || 0).toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      label: t("transactions"),
                      value: (
                        <span className="text-xl font-black text-black dark:text-white">
                          {getShopPerformance(activeTab).transactionCount || 0}
                        </span>
                      ),
                    },
                    {
                      label: t("avgTransaction"),
                      value: (
                        <span className="flex items-center gap-1 text-[#E9B10C] text-xl font-black">
                          ⃁ {(getShopPerformance(activeTab).avgTransactionValue || 0).toLocaleString()}
                        </span>
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                    >
                      <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                        {item.label}
                      </span>
                      {item.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateClosingModal
        isOpen={isCreateClosingOpen}
        onClose={() => setCreateClosingOpen(false)}
        onSubmit={handleCreateClosingSubmit}
        shops={shops}
        preSelectedShop={selectedShopForClosing}
      />

      <ClosingDetailModal
        isOpen={!!viewClosingId}
        onClose={() => setViewClosingId(null)}
        closingId={viewClosingId}
        onApprove={handleApproveClosing}
        onReject={handleRejectClosing}
      />

      <BaseModal
        isOpen={deleteClosingModal.isOpen}
        onClose={() => setDeleteClosingModal({ ...deleteClosingModal, isOpen: false })}
        title={t("deleteClosingTitle")}
      >
        <div className="flex flex-col items-center p-4 text-center">
          <Trash2 size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-2">
            {t("deleteClosingWarning")}
          </p>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-4">
            {deleteClosingModal.closing?.closingNumber}
          </p>
          <input
            type="text"
            value={deleteClosingModal.reason}
            onChange={(e) =>
              setDeleteClosingModal({ ...deleteClosingModal, reason: e.target.value })
            }
            placeholder={t("deletionReasonPlaceholder")}
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() => setDeleteClosingModal({ ...deleteClosingModal, isOpen: false })}
              disabled={deleteClosingModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={confirmDeleteClosing}
              disabled={deleteClosingModal.loading || !deleteClosingModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteClosingModal.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("delete")
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}