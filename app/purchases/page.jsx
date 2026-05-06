"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";

import {
  fetchAllPurchases,
  fetchPendingEditRequests,
  approveEditRequest,
  rejectEditRequest,
} from "@/redux/actions/purchaseActions";
import { fetchShops } from "@/redux/actions/shopActions";

import { PurchaseTable } from "@/components/tables/PurchaseTable";
import { PurchaseFilter } from "@/components/filters/PurchaseFilter";
import { PurchaseViewModal } from "@/components/modals/view/PurchaseViewModal";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";
import { BaseModal } from "@/components/modals/BaseModal";

const ITEMS_PER_PAGE = 15;

const initialFilters = {
  search: "",
  shopId: "",
  category: "",
  startDate: "",
  endDate: "",
};

let _purchasesInitialized = false;

export default function PurchasesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [viewModal, setViewModal] = useState({ isOpen: false, data: null });
  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    purchase: null,
    loading: false,
  });
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    purchase: null,
    reason: "",
    loading: false,
  });

  const debounceTimer = useRef(null);
  const skipNextPageEffect = useRef(true);
  const activeTabRef = useRef("all");
  const filtersRef = useRef(initialFilters);
  const pageRef = useRef(1);

  const { purchases, pendingRequests } = useSelector(
    (state) => state.purchases
  );

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const runFetch = useCallback(
    (tab, page, f) => {
      if (tab === "all") {
        dispatch(
          fetchAllPurchases({
            search: f.search || undefined,
            shopId: f.shopId || undefined,
            category: f.category || undefined,
            startDate: f.startDate || undefined,
            endDate: f.endDate || undefined,
            page,
            limit: ITEMS_PER_PAGE,
          })
        );
      } else if (tab === "pending") {
        dispatch(
          fetchPendingEditRequests({
            shopId: f.shopId || undefined,
            page,
            limit: ITEMS_PER_PAGE,
          })
        );
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchShops({ limit: 100 }));

    if (_purchasesInitialized) return;
    _purchasesInitialized = true;
    skipNextPageEffect.current = true;
    runFetch("all", 1, initialFilters);

    return () => {
      _purchasesInitialized = false;
    };
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(activeTabRef.current, currentPage, filtersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!_purchasesInitialized) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(activeTab, 1, filtersRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (!_purchasesInitialized) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(activeTabRef.current, 1, filters);
    }, 300);
  }, [
    filters.search,
    filters.shopId,
    filters.category,
    filters.startDate,
    filters.endDate,
  ]);

  const refreshCurrent = useCallback(() => {
    runFetch(activeTabRef.current, pageRef.current, filtersRef.current);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const confirmApprove = async () => {
    setApproveModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(approveEditRequest(approveModal.purchase._id)).unwrap();
      toast.success(t("editApproved"));
      setApproveModal({ isOpen: false, purchase: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || t("approveFailed")
      );
      setApproveModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const confirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error(t("rejectionReasonRequired"));
      return;
    }
    setRejectModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(
        rejectEditRequest({
          id: rejectModal.purchase._id,
          rejectionReason: rejectModal.reason,
        })
      ).unwrap();
      toast.success(t("editRejected"));
      setRejectModal({
        isOpen: false,
        purchase: null,
        reason: "",
        loading: false,
      });
      refreshCurrent();
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || t("rejectFailed")
      );
      setRejectModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const pendingCount = pendingRequests.pagination?.total || 0;

  if (purchases.loading && !purchases.items.length && !_purchasesInitialized) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-[11px] uppercase font-black tracking-[0.3em] text-black dark:text-white">
            {t("purchaseHistory")}
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
            {t("purchaseHistorySubtitle")}
          </p>
        </div>
      </div>

      <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide w-full xl:w-auto">
        {[
          { id: "all", labelKey: "allPurchases" },
          {
            id: "pending",
            labelKey: "pendingEditRequests",
            badge: pendingCount,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#E9B10C] text-black shadow-sm"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {t(tab.labelKey)}
            {tab.badge > 0 && (
              <span className="px-1.5 py-0.5 text-[8px] font-black bg-orange-500 text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "all" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
            <PurchaseTable
              data={purchases.items}
              loading={purchases.loading}
              onView={(item) => setViewModal({ isOpen: true, data: item })}
              showActions={false}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={purchases.pagination?.pages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "pending" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
            <PurchaseTable
              data={pendingRequests.items}
              loading={pendingRequests.loading}
              onView={(item) => setViewModal({ isOpen: true, data: item })}
              onApprove={(purchase) =>
                setApproveModal({ isOpen: true, purchase, loading: false })
              }
              onReject={(purchase) =>
                setRejectModal({
                  isOpen: true,
                  purchase,
                  reason: "",
                  loading: false,
                })
              }
              showActions={true}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={pendingRequests.pagination?.pages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <PurchaseViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, data: null })}
        data={viewModal.data}
      />

      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ ...approveModal, isOpen: false })}
        onConfirm={confirmApprove}
        loading={approveModal.loading}
        message={t("approveEditMessage")}
      />

      <BaseModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false })}
        title={t("rejectEditTitle")}
      >
        <div
          className="flex flex-col items-center p-4 text-center"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-4">
            {t("rejectEditMessage")}
          </p>
          <input
            type="text"
            value={rejectModal.reason}
            onChange={(e) =>
              setRejectModal({ ...rejectModal, reason: e.target.value })
            }
            placeholder={t("rejectionReasonPlaceholder")}
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
              disabled={rejectModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={confirmReject}
              disabled={rejectModal.loading || !rejectModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejectModal.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("reject")
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
