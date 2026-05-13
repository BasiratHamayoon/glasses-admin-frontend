"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";

import {
  fetchFullMonitoring,
  approveClosing,
  rejectClosing,
  createClosingForShop,
} from "@/redux/actions/monitoringActions";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { MonitorStats, ShopStatusPanel } from "@/components/cards/statCards/MonitoringStats";
import {
  MonitoringPerfTable,
  MonitoringClosingTable,
  PendingClosingsList,
} from "@/components/tables/MonitoringTables";
import { CreateClosingModal } from "@/components/modals/addUpdate/CreateClosingModal";

const slimScrollbarX =
  "overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full";

const slimScrollbarY =
  "overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full";

export default function MonitoringPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("ALL");
  const [isCreateClosingOpen, setCreateClosingOpen] = useState(false);
  const [selectedShopForClosing, setSelectedShopForClosing] = useState(null);

  const fetchedRef = useRef(false);

  const { data, loading } = useSelector((state) => state.monitoring);

  const {
    dashboard = {},
    performance = [],
    pendingDues = { shops: [], totalDue: 0, shopCount: 0 },
    staffOverview = [],
    closingStatus = { status: [], closedCount: 0, pendingCount: 0 },
  } = data || {};

  const shops = (closingStatus?.status || []).map((s) => s.shop).filter(Boolean);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(fetchFullMonitoring());
  }, []);

  const handleRefresh = () => {
    dispatch(fetchFullMonitoring());
    toast.success(t("dataRefreshed"));
  };

  const handleApproveClosing = async (closingId, remarks = "") => {
    if (!closingId) {
      toast.error(t("invalidClosingId") || "Invalid closing ID");
      return;
    }
    try {
      await dispatch(approveClosing({ closingId, remarks })).unwrap();
      toast.success(t("closingApproved"));
      dispatch(fetchFullMonitoring());
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleRejectClosing = async (closingId, reason = "Rejected by admin") => {
    if (!closingId) {
      toast.error(t("invalidClosingId") || "Invalid closing ID");
      return;
    }
    try {
      await dispatch(rejectClosing({ closingId, reason })).unwrap();
      toast.success(t("closingRejected"));
      dispatch(fetchFullMonitoring());
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleCreateClosing = (shop = null) => {
    setSelectedShopForClosing(shop);
    setCreateClosingOpen(true);
  };

  const handleCreateClosingSubmit = async (formData) => {
    try {
      await dispatch(createClosingForShop(formData)).unwrap();
      toast.success(t("closingCreated"));
      setCreateClosingOpen(false);
      dispatch(fetchFullMonitoring());
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const getShopPerformance = (shopId) =>
    performance.find((p) => p._id === shopId) || {};

  const getShopStaff = (shopId) =>
    staffOverview.find((s) => s._id === shopId) || {
      managers: 0,
      cashiers: 0,
      salesStaff: 0,
      totalStaff: 0,
    };

  const getShopClosing = (shopId) =>
    closingStatus?.status?.find((c) => c.shop?._id?.toString() === shopId) || null;

  const getShopDues = (shopId) =>
    pendingDues?.shops?.find((d) => d._id?.toString() === shopId) || {};

  if (loading || !data?.dashboard) return <PageSkeleton />;

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
          <div
            className={`flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto ${slimScrollbarX}`}
          >
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
              <div
                className={`xl:col-span-6 h-[420px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}
              >
                <PendingClosingsList
                  closingStatus={closingStatus}
                  onApprove={handleApproveClosing}
                  onReject={handleRejectClosing}
                  onCreateClosing={handleCreateClosing}
                />
              </div>
              <div
                className={`xl:col-span-6 h-[420px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}
              >
                <MonitoringClosingTable closingStatus={closingStatus} />
              </div>
            </div>
            <div
              className={`h-[350px] border border-neutral-200 dark:border-neutral-800 rounded-sm ${slimScrollbarY}`}
            >
              <MonitoringPerfTable performance={performance} />
            </div>
          </div>
        )}

        {activeTab !== "ALL" && (
          <div className="space-y-6">
            <ShopStatusPanel
              closing={getShopClosing(activeTab)}
              staff={getShopStaff(activeTab)}
              dues={getShopDues(activeTab)}
              shopName={shops.find((s) => s._id?.toString() === activeTab)?.name}
              onApproveClosing={handleApproveClosing}
              onRejectClosing={handleRejectClosing}
              onCreateClosing={() =>
                handleCreateClosing(
                  shops.find((s) => s._id?.toString() === activeTab)
                )
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
                          {getShopPerformance(activeTab).totalOrders || 0}
                        </span>
                      ),
                    },
                    {
                      label: t("avgTransaction"),
                      value: (
                        <span className="flex items-center gap-1 text-[#E9B10C] text-xl font-black">
                          ⃁{" "}
                          {(
                            getShopPerformance(activeTab).avgTransactionValue || 0
                          ).toLocaleString()}
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
    </div>
  );
}