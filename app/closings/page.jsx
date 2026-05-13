"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";

import {
  fetchAllClosings,
  approveClosing,
  rejectClosing,
  bulkApproveClosings,
  createClosingForShop,
  deleteClosing,
  fetchClosingDetails,
} from "@/redux/actions/monitoringActions";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { ClosingStats } from "@/components/cards/statCards/ClosingStats";
import { ClosingsTable } from "@/components/tables/ClosingsTable";
import { ClosingFilter } from "@/components/filters/ClosingFilter";
import { CreateClosingModal } from "@/components/modals/addUpdate/CreateClosingModal";
import { ClosingDetailModal } from "@/components/modals/view/ClosingDetailModal";
import { BasePagination } from "@/components/pagination/BasePagination";
import { BaseModal } from "@/components/modals/BaseModal";
import { generateClosingReceipt } from "@/utils/closingReceipt";

const ITEMS_PER_PAGE = 15;

const initialClosingFilters = {
  search: "",
  shop: "",
  status: [],
  startDate: "",
  endDate: "",
};

export default function ClosingsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeShopId, setActiveShopId] = useState("all");
  const [closingsPage, setClosingsPage] = useState(1);
  const [closingFilters, setClosingFilters] = useState(initialClosingFilters);
  const [isCreateClosingOpen, setCreateClosingOpen] = useState(false);
  const [viewClosingId, setViewClosingId] = useState(null);
  const [selectedShopForClosing, setSelectedShopForClosing] = useState(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);
  const [deleteClosingModal, setDeleteClosingModal] = useState({
    isOpen: false,
    closing: null,
    reason: "",
    loading: false,
  });

  const isMounted = useRef(false);
  const searchDebounceTimer = useRef(null);
  const filtersRef = useRef(initialClosingFilters);
  const pageRef = useRef(1);
  const skipNextPageEffect = useRef(true);
  const hasFetched = useRef(false);

  const { closings, data } = useSelector((state) => state.monitoring);

  const shops = (data?.closingStatus?.status || [])
    .map((s) => s.shop)
    .filter(Boolean);

  const closingItems = Array.isArray(closings.items) ? closings.items : [];

  const shopList = useCallback(() => {
    const shopMap = new Map();
    closingItems.forEach((closing) => {
      const shop = closing.shop;
      if (shop?._id && !shopMap.has(shop._id)) {
        shopMap.set(shop._id, {
          id: shop._id,
          name: shop.name || shop.code || shop._id,
        });
      }
    });
    return Array.from(shopMap.values());
  }, [closingItems]);

  const currentShopList = shopList();

  const visibleItems = useCallback(() => {
    if (activeShopId === "all") return closingItems;
    return closingItems.filter((c) => c.shop?._id === activeShopId);
  }, [activeShopId, closingItems]);

  const displayItems = visibleItems();

  const buildClosingParams = (f, page) => {
    const params = { page, limit: ITEMS_PER_PAGE };
    if (f.search?.trim()) params.search = f.search.trim();
    if (f.shop) params.shopId = f.shop;
    if (f.status?.length) params.status = f.status[0];
    if (f.startDate) params.startDate = f.startDate;
    if (f.endDate) params.endDate = f.endDate;
    return params;
  };

  const runClosingsFetch = useCallback(
    (f, page) => {
      dispatch(fetchAllClosings(buildClosingParams(f, page)));
    },
    [dispatch]
  );

  useEffect(() => {
    filtersRef.current = closingFilters;
  }, [closingFilters]);

  useEffect(() => {
    pageRef.current = closingsPage;
  }, [closingsPage]);

  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    skipNextPageEffect.current = true;
    runClosingsFetch(initialClosingFilters, 1);
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
    runClosingsFetch(filtersRef.current, closingsPage);
  }, [closingsPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (closingFilters.search === "") {
      skipNextPageEffect.current = true;
      setClosingsPage(1);
      pageRef.current = 1;
      runClosingsFetch(closingFilters, 1);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setClosingsPage(1);
      pageRef.current = 1;
      runClosingsFetch(closingFilters, 1);
    }, 500);
  }, [closingFilters.search]);

  useEffect(() => {
    if (!isMounted.current) return;
    skipNextPageEffect.current = true;
    setClosingsPage(1);
    pageRef.current = 1;
    runClosingsFetch(closingFilters, 1);
  }, [
    closingFilters.shop,
    closingFilters.status,
    closingFilters.startDate,
    closingFilters.endDate,
  ]);

  const refreshCurrent = useCallback(() => {
    runClosingsFetch(filtersRef.current, pageRef.current);
  }, [runClosingsFetch]);

  const handleShopTabChange = (shopId) => {
    setActiveShopId(shopId);
  };

  const handleApproveClosing = async (closingId, remarks = "") => {
    if (!closingId) {
      toast.error(t("invalidClosingId") || "Invalid closing ID");
      return;
    }
    try {
      await dispatch(approveClosing({ closingId, remarks })).unwrap();
      toast.success(t("closingApproved"));
      refreshCurrent();
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
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleBulkApprove = async (ids) => {
    try {
      const result = await dispatch(
        bulkApproveClosings({ closingIds: ids, remarks: "Bulk approved" })
      ).unwrap();
      toast.success(
        `${result.approved?.length || 0} ${t("closingsApproved")}`
      );
      refreshCurrent();
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
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleDeleteClosing = (closing) => {
    setDeleteClosingModal({
      isOpen: true,
      closing,
      reason: "",
      loading: false,
    });
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
      setDeleteClosingModal({
        isOpen: false,
        closing: null,
        reason: "",
        loading: false,
      });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setDeleteClosingModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePrintReceipt = async (closing) => {
    setReceiptLoadingId(closing._id);
    try {
      const detailResult = await dispatch(fetchClosingDetails(closing._id)).unwrap();
      const closingData = detailResult?.closing || detailResult;

      let orders = closingData?.orders || closingData?.orderBreakdown || [];

      if (orders.length === 0) {
        const closingDate = closingData?.closingDate || closingData?.date || closingData?.createdAt;
        const shopId = closingData?.shop?._id || closing?.shop?._id;

        if (shopId && closingDate) {
          try {
            const dateStr = new Date(closingDate).toISOString().split("T")[0];
            const ordersResponse = await api.get("/admin/admin-orders/pos", {
              params: {
                shopId,
                startDate: dateStr,
                endDate: dateStr,
                limit: 100,
                _t: Date.now(),
              },
            });
            orders = ordersResponse.data?.data?.orders || [];
          } catch (e) {
            orders = [];
          }
        }
      }

      generateClosingReceipt({ ...closingData, orders });
    } catch (err) {
      generateClosingReceipt(closing);
    } finally {
      setReceiptLoadingId(null);
    }
  };

  const handleClearClosingFilters = () => {
    setClosingFilters(initialClosingFilters);
    filtersRef.current = initialClosingFilters;
    setClosingsPage(1);
    pageRef.current = 1;
    skipNextPageEffect.current = true;
    runClosingsFetch(initialClosingFilters, 1);
  };

  if (closings.loading && !closingItems.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <ClosingStats stats={closings.stats} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-[11px] uppercase tracking-[0.3em] font-black text-black dark:text-white">
          {t("closings")}
        </h1>
        <button
          type="button"
          onClick={() => handleCreateClosing(null)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors text-[10px] uppercase font-black tracking-widest rounded-sm w-full sm:w-auto"
        >
          <Plus size={13} strokeWidth={3} />
          {t("createClosing")}
        </button>
      </div>

      {currentShopList.length > 0 && (
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto gap-1">
          <button
            onClick={() => handleShopTabChange("all")}
            className={`flex-none px-5 py-2 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
              activeShopId === "all"
                ? "bg-neutral-800 text-white dark:bg-white dark:text-black shadow-sm"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {t("allShops")}
          </button>
          {currentShopList.map((shop) => (
            <button
              key={shop.id}
              onClick={() => handleShopTabChange(shop.id)}
              className={`flex-none px-5 py-2 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeShopId === shop.id
                  ? "bg-neutral-800 text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {shop.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <ClosingFilter
          filters={closingFilters}
          setFilters={setClosingFilters}
          onClear={handleClearClosingFilters}
        />

        <ClosingsTable
          data={displayItems}
          loading={closings.loading}
          onApprove={handleApproveClosing}
          onReject={handleRejectClosing}
          onView={(id) => setViewClosingId(id)}
          onBulkApprove={handleBulkApprove}
          onDelete={handleDeleteClosing}
          onPrintReceipt={handlePrintReceipt}
          receiptLoadingId={receiptLoadingId}
        />

        <BasePagination
          currentPage={closingsPage}
          totalPages={closings.pagination?.totalPages || 1}
          onPageChange={setClosingsPage}
        />
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
        onClose={() =>
          setDeleteClosingModal((prev) => ({ ...prev, isOpen: false }))
        }
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
              setDeleteClosingModal((prev) => ({
                ...prev,
                reason: e.target.value,
              }))
            }
            placeholder={t("deletionReasonPlaceholder")}
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() =>
                setDeleteClosingModal((prev) => ({ ...prev, isOpen: false }))
              }
              disabled={deleteClosingModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={confirmDeleteClosing}
              disabled={
                deleteClosingModal.loading || !deleteClosingModal.reason.trim()
              }
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