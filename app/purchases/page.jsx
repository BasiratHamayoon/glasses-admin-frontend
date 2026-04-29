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

export default function PurchasesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [viewModal, setViewModal] = useState({ isOpen: false, data: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, purchase: null, loading: false });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, purchase: null, reason: "", loading: false });

  const debounceTimer = useRef(null);
  const initFetched = useRef(false);
  const isMounted = useRef(false);

  const stateRef = useRef({ activeTab, filters, currentPage });
  useEffect(() => {
    stateRef.current = { activeTab, filters, currentPage };
  });

  const { purchases, pendingRequests } = useSelector(state => state.purchases);

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchShops({ limit: 100 }));
      initFetched.current = true;
    }
  }, [dispatch]);

  const runFetch = useCallback((tab, page, f) => {
    if (tab === "all") {
      dispatch(fetchAllPurchases({
        search: f.search || undefined,
        shopId: f.shopId || undefined,
        category: f.category || undefined,
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      }));
    } else if (tab === "pending") {
      dispatch(fetchPendingEditRequests({
        shopId: f.shopId || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      }));
    }
  }, [dispatch]);

  const scheduleFetch = useCallback((tab, page, f, delay = 300) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runFetch(tab, page, f);
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
      runFetch("all", 1, initialFilters);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleFetch(activeTab, currentPage, stateRef.current.filters, 0);
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleFetch(stateRef.current.activeTab, 1, filters, 300);
    setCurrentPage(1);
  }, [
    filters.search,
    filters.shopId,
    filters.category,
    filters.startDate,
    filters.endDate,
  ]);

  const refreshCurrent = useCallback(() => {
    const { activeTab: tab, currentPage: page, filters: f } = stateRef.current;
    runFetch(tab, page, f);
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === stateRef.current.activeTab) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleRequestApprove = (purchase) =>
    setApproveModal({ isOpen: true, purchase, loading: false });

  const confirmApprove = async () => {
    setApproveModal(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(approveEditRequest(approveModal.purchase._id)).unwrap();
      toast.success(t("editApproved") || "Edit request approved");
      setApproveModal({ isOpen: false, purchase: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || t("approveFailed") || "Failed to approve");
      setApproveModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRequestReject = (purchase) =>
    setRejectModal({ isOpen: true, purchase, reason: "", loading: false });

  const confirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error(t("rejectionReasonRequired") || "Please provide a rejection reason");
      return;
    }
    setRejectModal(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(rejectEditRequest({
        id: rejectModal.purchase._id,
        rejectionReason: rejectModal.reason,
      })).unwrap();
      toast.success(t("editRejected") || "Edit request rejected");
      setRejectModal({ isOpen: false, purchase: null, reason: "", loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || t("rejectFailed") || "Failed to reject");
      setRejectModal(prev => ({ ...prev, loading: false }));
    }
  };

  const pendingCount = pendingRequests.pagination?.total || 0;

  if (!isMounted.current && purchases.loading && !purchases.items.length && !pendingRequests.items.length) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-[13px] uppercase font-black tracking-widest text-black dark:text-white">
            {t("purchaseHistory") || "Purchase History"}
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
            {t("purchaseHistorySubtitle") || "All shop purchase records & edit requests"}
          </p>
        </div>
      </div>

      <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full xl:w-auto">
        {[
          { id: "all", label: t("allPurchases") || "All Purchases" },
          {
            id: "pending",
            label: (
              <span className="flex items-center gap-2">
                {t("pendingEditRequests") || "Pending Edit Requests"}
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[8px] font-black bg-orange-500 text-white rounded-full">
                    {pendingCount}
                  </span>
                )}
              </span>
            ),
          },
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

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "all" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onApply={() => {}}
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
              onPageChange={handlePageChange}
            />
          </>
        )}

        {activeTab === "pending" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onApply={() => {}}
              onClear={handleClearFilters}
            />
            <PurchaseTable
              data={pendingRequests.items}
              loading={pendingRequests.loading}
              onView={(item) => setViewModal({ isOpen: true, data: item })}
              onApprove={handleRequestApprove}
              onReject={handleRequestReject}
              showActions={true}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={pendingRequests.pagination?.pages || 1}
              onPageChange={handlePageChange}
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
        title={t("approveEditTitle") || "Approve Edit Request"}
        message={t("approveEditMessage") || "Are you sure you want to approve this edit request?"}
        confirmText={t("approve") || "Approve"}
        confirmClass="bg-green-500 hover:bg-green-600 text-white"
        iconColor="text-green-500"
      />

      <BaseModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false })}
        title={t("rejectEditTitle") || "Reject Edit Request"}
      >
        <div className="flex flex-col items-center justify-center p-4 text-center" dir={isArabic ? "rtl" : "ltr"}>
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-2">
            {t("rejectEditMessage") || "Are you sure you want to reject this edit request? Please provide a reason."}
          </p>
          <input
            type="text"
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
            placeholder={t("rejectionReasonPlaceholder") || "Enter reason for rejection..."}
            className="w-full mt-4 mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E9B10C] focus:border-[#E9B10C] transition-all"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
              disabled={rejectModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              onClick={confirmReject}
              disabled={rejectModal.loading || !rejectModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 rounded-sm min-w-[120px] bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejectModal.loading ? <Loader2 size={14} className="animate-spin" /> : (t("reject") || "Reject")}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}