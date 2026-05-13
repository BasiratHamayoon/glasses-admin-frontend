"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, XCircle, CheckCircle, Clock } from "lucide-react";

import {
  fetchAllPurchases,
  fetchPendingEditRequests,
  approveEditRequest,
  rejectEditRequest,
  approvePurchase,
  rejectPurchase,
} from "@/redux/actions/purchaseActions";
import { fetchShops } from "@/redux/actions/shopActions";

import { PurchaseTable }       from "@/components/tables/PurchaseTable";
import { PurchaseFilter }      from "@/components/filters/PurchaseFilter";
import { PurchaseViewModal }   from "@/components/modals/view/PurchaseViewModal";
import { BasePagination }      from "@/components/pagination/BasePagination";
import { PageSkeleton }        from "@/components/loaders-and-skeletons/PageSkeleton";
import { ConfirmActionModal }  from "@/components/modals/other/ConfirmActionModal";
import { BaseModal }           from "@/components/modals/BaseModal";

const ITEMS_PER_PAGE = 15;
const initialFilters = { search: "", shopId: "", category: "", startDate: "", endDate: "" };

export default function PurchasesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab,    setActiveTab]    = useState("all");
  const [filters,      setFilters]      = useState(initialFilters);
  const [currentPage,  setCurrentPage]  = useState(1);

  const [viewModal,    setViewModal]    = useState({ isOpen: false, data: null });

  const [purchaseApproveModal, setPurchaseApproveModal] = useState({
    isOpen: false, purchase: null, loading: false,
  });
  const [purchaseRejectModal, setPurchaseRejectModal] = useState({
    isOpen: false, purchase: null, reason: "", loading: false,
  });

  const [approveModal, setApproveModal] = useState({
    isOpen: false, purchase: null, loading: false,
  });
  const [rejectModal, setRejectModal] = useState({
    isOpen: false, purchase: null, reason: "", loading: false,
  });

  const searchDebounceTimer = useRef(null);
  const isMounted           = useRef(false);
  const initialFetchDone    = useRef(false);
  const skipNextPageEffect  = useRef(true);
  const activeTabRef        = useRef("all");
  const filtersRef          = useRef(initialFilters);
  const pageRef             = useRef(1);

  const { purchases, pendingRequests } = useSelector((state) => state.purchases);

  useEffect(() => { filtersRef.current   = filters;      }, [filters]);
  useEffect(() => { activeTabRef.current = activeTab;    }, [activeTab]);
  useEffect(() => { pageRef.current      = currentPage;  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    };
  }, []);

  const runFetch = useCallback((tab, page, f) => {
    if (tab === "all") {
      dispatch(fetchAllPurchases({
        search:    f.search    || undefined,
        shopId:    f.shopId    || undefined,
        category:  f.category  || undefined,
        startDate: f.startDate || undefined,
        endDate:   f.endDate   || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      }));
    } else if (tab === "pending-purchases") {
      dispatch(fetchAllPurchases({
        approvalStatus: "PENDING",
        shopId:    f.shopId    || undefined,
        startDate: f.startDate || undefined,
        endDate:   f.endDate   || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      }));
    } else if (tab === "pending-edits") {
      dispatch(fetchPendingEditRequests({
        shopId: f.shopId || undefined,
        page,
        limit:  ITEMS_PER_PAGE,
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    skipNextPageEffect.current = true;
    dispatch(fetchShops({ limit: 100 }));
    runFetch("all", 1, initialFilters);
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
    runFetch(activeTabRef.current, currentPage, filtersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(activeTab, 1, filtersRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (filters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(activeTabRef.current, 1, filters);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(activeTabRef.current, 1, filters);
    }, 500);
  }, [filters.search]);

  useEffect(() => {
    if (!isMounted.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(activeTabRef.current, 1, filters);
  }, [filters.shopId, filters.category, filters.startDate, filters.endDate]);

  const refreshCurrent = useCallback(() => {
    runFetch(activeTabRef.current, pageRef.current, filtersRef.current);
  }, [runFetch]);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    filtersRef.current = initialFilters;
    setCurrentPage(1);
    pageRef.current = 1;
    skipNextPageEffect.current = true;
    runFetch(activeTabRef.current, 1, initialFilters);
  };

  const confirmPurchaseApprove = async () => {
    setPurchaseApproveModal((p) => ({ ...p, loading: true }));
    try {
      await dispatch(approvePurchase(purchaseApproveModal.purchase._id)).unwrap();
      toast.success("Purchase approved successfully");
      setPurchaseApproveModal({ isOpen: false, purchase: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to approve purchase");
      setPurchaseApproveModal((p) => ({ ...p, loading: false }));
    }
  };

  const confirmPurchaseReject = async () => {
    if (!purchaseRejectModal.reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    setPurchaseRejectModal((p) => ({ ...p, loading: true }));
    try {
      await dispatch(rejectPurchase({
        id:              purchaseRejectModal.purchase._id,
        rejectionReason: purchaseRejectModal.reason,
      })).unwrap();
      toast.success("Purchase rejected successfully");
      setPurchaseRejectModal({ isOpen: false, purchase: null, reason: "", loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to reject purchase");
      setPurchaseRejectModal((p) => ({ ...p, loading: false }));
    }
  };

  const confirmApprove = async () => {
    setApproveModal((p) => ({ ...p, loading: true }));
    try {
      await dispatch(approveEditRequest(approveModal.purchase._id)).unwrap();
      toast.success(t("editApproved"));
      setApproveModal({ isOpen: false, purchase: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("approveFailed"));
      setApproveModal((p) => ({ ...p, loading: false }));
    }
  };

  const confirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error(t("rejectionReasonRequired"));
      return;
    }
    setRejectModal((p) => ({ ...p, loading: true }));
    try {
      await dispatch(rejectEditRequest({
        id:              rejectModal.purchase._id,
        rejectionReason: rejectModal.reason,
      })).unwrap();
      toast.success(t("editRejected"));
      setRejectModal({ isOpen: false, purchase: null, reason: "", loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("rejectFailed"));
      setRejectModal((p) => ({ ...p, loading: false }));
    }
  };

  const pendingEditsCount = pendingRequests.pagination?.total || 0;

  if (!initialFetchDone.current && purchases.loading && !purchases.items.length) {
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

      <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto w-full xl:w-auto">
        {[
          { id: "all",               label: "All Purchases",         badge: 0 },
          { id: "pending-purchases", label: "Pending Approval",      badge: 0, icon: Clock },
          { id: "pending-edits",     label: "Pending Edit Requests", badge: pendingEditsCount },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {Icon && <Icon size={11} />}
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-orange-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
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

        {activeTab === "pending-purchases" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
            <div className="flex items-center gap-3 mb-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-sm">
              <Clock size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                {purchases.pagination?.total || 0} purchases waiting for your approval
              </span>
            </div>
            <PurchaseTable
              data={purchases.items}
              loading={purchases.loading}
              onView={(item)    => setViewModal({ isOpen: true, data: item })}
              onApprove={(item) => setPurchaseApproveModal({ isOpen: true, purchase: item, loading: false })}
              onReject={(item)  => setPurchaseRejectModal({ isOpen: true, purchase: item, reason: "", loading: false })}
              showActions={true}
              actionType="purchase"
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={purchases.pagination?.pages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "pending-edits" && (
          <>
            <PurchaseFilter
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
            <PurchaseTable
              data={pendingRequests.items}
              loading={pendingRequests.loading}
              onView={(item)    => setViewModal({ isOpen: true, data: item })}
              onApprove={(item) => setApproveModal({ isOpen: true, purchase: item, loading: false })}
              onReject={(item)  => setRejectModal({ isOpen: true, purchase: item, reason: "", loading: false })}
              showActions={true}
              actionType="edit"
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

      <ConfirmActionModal
        isOpen={purchaseApproveModal.isOpen}
        onClose={() => setPurchaseApproveModal({ ...purchaseApproveModal, isOpen: false })}
        onConfirm={confirmPurchaseApprove}
        loading={purchaseApproveModal.loading}
        title="Approve Purchase"
        description={`Approve "${purchaseApproveModal.purchase?.itemName}" — ${purchaseApproveModal.purchase?.purchaseNumber}?`}
        confirmLabel="Approve"
        confirmClass="bg-green-500 hover:bg-green-600 text-white"
      />

      <BaseModal
        isOpen={purchaseRejectModal.isOpen}
        onClose={() => setPurchaseRejectModal({ ...purchaseRejectModal, isOpen: false })}
        title="Reject Purchase"
      >
        <div className="flex flex-col items-center p-4 text-center" dir={isArabic ? "rtl" : "ltr"}>
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-1">
            Reject this purchase?
          </p>
          <p className="text-[10px] text-neutral-500 font-bold mb-4">
            {purchaseRejectModal.purchase?.itemName} — {purchaseRejectModal.purchase?.purchaseNumber}
          </p>
          <input
            type="text"
            value={purchaseRejectModal.reason}
            onChange={(e) => setPurchaseRejectModal((p) => ({ ...p, reason: e.target.value }))}
            placeholder="Enter rejection reason..."
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() => setPurchaseRejectModal((p) => ({ ...p, isOpen: false }))}
              disabled={purchaseRejectModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPurchaseReject}
              disabled={purchaseRejectModal.loading || !purchaseRejectModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50"
            >
              {purchaseRejectModal.loading ? <Loader2 size={14} className="animate-spin" /> : "Reject"}
            </button>
          </div>
        </div>
      </BaseModal>

      <ConfirmActionModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ ...approveModal, isOpen: false })}
        onConfirm={confirmApprove}
        loading={approveModal.loading}
        title={t("approveEditTitle")}
        description={t("approveEditMessage")}
        confirmLabel={t("approve")}
        confirmClass="bg-green-500 hover:bg-green-600 text-white"
      />

      <BaseModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false })}
        title={t("rejectEditTitle")}
      >
        <div className="flex flex-col items-center p-4 text-center" dir={isArabic ? "rtl" : "ltr"}>
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-4">
            {t("rejectEditMessage")}
          </p>
          <input
            type="text"
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
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
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50"
            >
              {rejectModal.loading ? <Loader2 size={14} className="animate-spin" /> : t("reject")}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}