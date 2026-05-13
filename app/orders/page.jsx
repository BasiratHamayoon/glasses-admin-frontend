"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

import {
  fetchPOSOrders,
  fetchWebsiteOrders,
  updatePOSOrderStatus,
  updateWebsiteOrderStatus,
  cancelPOSOrder,
  cancelWebsiteOrder,
  fetchPOSOrderById,
  fetchWebsiteOrderById,
  approveCancellation,
  rejectCancellation,
  permanentlyDeleteOrder,
} from "@/redux/actions/orderActions";
import { clearSelectedOrder } from "@/redux/slices/orderSlice";

import { OrderFilter } from "@/components/filters/OrderFilter";
import { OrderTable } from "@/components/tables/OrderTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { OrderStats } from "@/components/cards/statCards/OrderStats";
import { OrderViewModal } from "@/components/modals/view/OrderViewModal";
import { CancelOrderModal } from "@/components/modals/other/CancelOrderModal";
import { ConfirmStatusModal } from "@/components/modals/other/ConfirmStatusModal";
import { RejectCancellationModal } from "@/components/modals/other/RejectCancellationModal";
import { ConfirmActionModal } from "@/components/modals/other/ConfirmActionModal";

const ITEMS_PER_PAGE = 15;
const initialFilters = { search: "", status: [], paymentStatus: [] };

let _orderFetchLock = false;

export default function OrdersPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("pos");
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeShopId, setActiveShopId] = useState("all");

  const [viewData, setViewData] = useState({ isOpen: false });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, order: null, status: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, order: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });

  const debounceTimer = useRef(null);
  const skipNextPageEffect = useRef(true);
  const filtersRef = useRef(initialFilters);
  const pageRef = useRef(1);
  const activeTabRef = useRef("pos");

  const { pos, website, selectedOrder, loadingDetails, cancellationLoading } =
    useSelector((state) => state.orders);

  const currentData = activeTab === "pos" ? pos : website;
  const currentItems = Array.isArray(currentData.items) ? currentData.items : [];

  const shops = useCallback(() => {
    if (activeTab !== "pos") return [];
    const shopMap = new Map();
    currentItems.forEach((order) => {
      if (order.shop?._id && !shopMap.has(order.shop._id)) {
        shopMap.set(order.shop._id, {
          id: order.shop._id,
          name: order.shop.name || order.shop.code || order.shop._id,
        });
      }
    });
    return Array.from(shopMap.values());
  }, [activeTab, currentItems]);

  const shopList = shops();

  const displayItems = useCallback(() => {
    if (activeTab !== "pos" || activeShopId === "all") return currentItems;
    return currentItems.filter((order) => order.shop?._id === activeShopId);
  }, [activeTab, activeShopId, currentItems]);

  const visibleItems = displayItems();

  const runFetch = useCallback(
    (page, currentFilters, tab) => {
      const params = { ...currentFilters, page, limit: ITEMS_PER_PAGE };
      if (tab === "pos") {
        dispatch(fetchPOSOrders(params));
      } else {
        dispatch(fetchWebsiteOrders(params));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (_orderFetchLock) return;
    _orderFetchLock = true;
    skipNextPageEffect.current = true;
    runFetch(1, initialFilters, activeTabRef.current);
    return () => {
      _orderFetchLock = false;
    };
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(currentPage, filtersRef.current, activeTabRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!_orderFetchLock) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (filters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(1, filters, activeTabRef.current);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(1, filters, activeTabRef.current);
    }, 500);
  }, [filters.search]);

  useEffect(() => {
    if (!_orderFetchLock) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(1, filters, activeTabRef.current);
  }, [filters.status, filters.paymentStatus]);

  const refreshCurrent = useCallback(() => {
    runFetch(pageRef.current, filtersRef.current, activeTabRef.current);
  }, [runFetch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    activeTabRef.current = tab;
    setCurrentPage(1);
    pageRef.current = 1;
    setFilters(initialFilters);
    filtersRef.current = initialFilters;
    setActiveShopId("all");
    skipNextPageEffect.current = true;
    runFetch(1, initialFilters, tab);
  };

  const handleShopTabChange = (shopId) => {
    setActiveShopId(shopId);
  };

  const handleViewDetails = (order) => {
    setViewData({ isOpen: true });
    if (activeTab === "pos") dispatch(fetchPOSOrderById(order._id));
    else dispatch(fetchWebsiteOrderById(order._id));
  };

  const closeViewModal = () => {
    setViewData({ isOpen: false });
    dispatch(clearSelectedOrder());
  };

  const handleUpdateStatusClick = (order, newStatus) => {
    setStatusModal({ isOpen: true, order, status: newStatus });
  };

  const confirmUpdateStatus = async () => {
    const { order, status } = statusModal;
    if (!order || !status) return;
    try {
      if (activeTab === "pos") {
        await dispatch(updatePOSOrderStatus({ id: order._id, status })).unwrap();
      } else {
        await dispatch(updateWebsiteOrderStatus({ id: order._id, status })).unwrap();
      }
      toast.success(`Order marked as ${status}`);
      setStatusModal({ isOpen: false, order: null, status: null });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update status");
    }
  };

  const confirmCancel = async (reason) => {
    try {
      if (activeTab === "pos") {
        await dispatch(cancelPOSOrder({ id: cancelModal.orderId, reason })).unwrap();
      } else {
        await dispatch(cancelWebsiteOrder({ id: cancelModal.orderId, reason })).unwrap();
      }
      toast.success("Order cancelled successfully");
      setCancelModal({ isOpen: false, orderId: null });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to cancel order");
    }
  };

  const confirmApproveCancellation = async () => {
    if (!approveModal.order) return;
    try {
      await dispatch(
        approveCancellation({ id: approveModal.order._id, orderType: activeTab })
      ).unwrap();
      toast.success("Cancellation approved — stock restored");
      setApproveModal({ isOpen: false, order: null });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to approve cancellation");
    }
  };

  const confirmRejectCancellation = async (reason) => {
    if (!rejectModal.order) return;
    try {
      await dispatch(
        rejectCancellation({
          id: rejectModal.order._id,
          reason,
          orderType: activeTab,
        })
      ).unwrap();
      toast.success("Cancellation request rejected");
      setRejectModal({ isOpen: false, order: null });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to reject cancellation");
    }
  };

  const confirmPermanentDelete = async () => {
    if (!deleteModal.order) return;
    try {
      await dispatch(
        permanentlyDeleteOrder({
          id: deleteModal.order._id,
          orderType: activeTab,
        })
      ).unwrap();
      toast.success(`Order #${deleteModal.order.orderNumber} permanently deleted`);
      setDeleteModal({ isOpen: false, order: null });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete order");
    }
  };

  if (currentData.loading && !currentItems.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <OrderStats orders={visibleItems} type={activeTab} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto">
          {[
            { id: "pos", label: t("posOrders") || "POS Orders" },
            { id: "website", label: t("websiteOrders") || "Website Orders" },
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "pos" && shopList.length > 0 && (
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto gap-1">
          <button
            onClick={() => handleShopTabChange("all")}
            className={`flex-none px-5 py-2 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
              activeShopId === "all"
                ? "bg-neutral-800 text-white dark:bg-white dark:text-black shadow-sm"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {t("allShops") || "All Shops"}
          </button>
          {shopList.map((shop) => (
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
        <OrderFilter
          filters={filters}
          setFilters={setFilters}
          onClear={() => {
            setFilters(initialFilters);
            filtersRef.current = initialFilters;
            setCurrentPage(1);
            pageRef.current = 1;
            skipNextPageEffect.current = true;
            runFetch(1, initialFilters, activeTabRef.current);
          }}
          onApply={() => {}}
        />

        <OrderTable
          data={visibleItems}
          loading={currentData.loading}
          orderType={activeTab}
          onView={handleViewDetails}
          onUpdateStatus={handleUpdateStatusClick}
          onCancel={(row) => setCancelModal({ isOpen: true, orderId: row._id })}
          onApproveCancellation={(row) => setApproveModal({ isOpen: true, order: row })}
          onRejectCancellation={(row) => setRejectModal({ isOpen: true, order: row })}
          onPermanentDelete={(row) => setDeleteModal({ isOpen: true, order: row })}
        />

        <BasePagination
          currentPage={currentPage}
          totalPages={currentData.pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <OrderViewModal
        isOpen={viewData.isOpen}
        onClose={closeViewModal}
        data={selectedOrder}
        loading={loadingDetails}
      />

      <CancelOrderModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, orderId: null })}
        onConfirm={confirmCancel}
        loading={currentData.loading}
      />

      <ConfirmStatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, order: null, status: null })}
        onConfirm={confirmUpdateStatus}
        status={statusModal.status}
        loading={currentData.loading}
      />

      <ConfirmActionModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, order: null })}
        onConfirm={confirmApproveCancellation}
        loading={cancellationLoading}
        title={t("approveCancellation")}
        description={
          approveModal.order
            ? `${t("approveCancellationDesc")} #${approveModal.order.orderNumber}? ${t("stockWillBeRestored")}`
            : ""
        }
        confirmLabel={t("approve")}
        confirmClass="bg-green-500 hover:bg-green-600 text-white"
      />

      <RejectCancellationModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, order: null })}
        onConfirm={confirmRejectCancellation}
        loading={cancellationLoading}
        order={rejectModal.order}
      />

      <ConfirmActionModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, order: null })}
        onConfirm={confirmPermanentDelete}
        loading={cancellationLoading}
        title={t("permanentlyDelete")}
        description={
          deleteModal.order
            ? `${t("permanentDeleteDesc")} #${deleteModal.order.orderNumber}? ${t("cannotBeUndone")}`
            : ""
        }
        confirmLabel={t("deleteForever")}
        confirmClass="bg-red-500 hover:bg-red-600 text-white"
      />
    </div>
  );
}