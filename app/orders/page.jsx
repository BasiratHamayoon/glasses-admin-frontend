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

export default function OrdersPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("website");
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [viewData, setViewData] = useState({ isOpen: false });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, order: null, status: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, order: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });

  const debounceTimer = useRef(null);

  const { pos, website, selectedOrder, loadingDetails, cancellationLoading } =
    useSelector((state) => state.orders);

  const currentData = activeTab === "pos" ? pos : website;
  const currentItems = Array.isArray(currentData.items) ? currentData.items : [];

  const loadData = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = { ...filters, page: currentPage, limit: ITEMS_PER_PAGE };
      if (activeTab === "pos") {
        dispatch(fetchPOSOrders(params));
      } else {
        dispatch(fetchWebsiteOrders(params));
      }
    }, 300);
  }, [dispatch, activeTab, currentPage, filters]);

  useEffect(() => {
    loadData();
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [loadData]);

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
      loadData();
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
      loadData();
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
      loadData();
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
      loadData();
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
      toast.success(
        `Order #${deleteModal.order.orderNumber} permanently deleted`
      );
      setDeleteModal({ isOpen: false, order: null });
      loadData();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete order");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters(initialFilters);
  };

  if (currentData.loading && !currentItems.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <OrderStats orders={currentItems} type={activeTab} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto">
          {[
            { id: "website", label: t("websiteOrders") || "Website Orders" },
            { id: "pos", label: t("posOrders") || "POS Orders" },
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

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <OrderFilter
          filters={filters}
          setFilters={setFilters}
          onApply={() => {
            setCurrentPage(1);
            loadData();
          }}
          onClear={() => {
            setFilters(initialFilters);
            setCurrentPage(1);
            setTimeout(loadData, 100);
          }}
        />

        <OrderTable
          data={currentItems}
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