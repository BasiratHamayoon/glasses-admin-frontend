"use client";
import { BaseTable } from "./BaseTable";
import {
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const OrderTable = ({
  data,
  loading,
  orderType,
  onView,
  onUpdateStatus,
  onCancel,
  onApproveCancellation,
  onRejectCancellation,
  onPermanentDelete,
}) => {
  const { t } = useLanguage();

  const getOrderStatus = (row) => {
    return (
      row.orderStatus || row.status || ""
    ).toUpperCase();
  };

  const getStatusBadge = (status) => {
    const map = {
      COMPLETED: {
        color:
          "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        icon: Check,
        label: "COMPLETED",
      },
      DELIVERED: {
        color:
          "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        icon: Check,
        label: "DELIVERED",
      },
      CANCELLED: {
        color:
          "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        icon: XCircle,
        label: "CANCELLED",
      },
      CANCEL_REQUESTED: {
        color:
          "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        icon: Clock,
        label: "CANCEL REQ.",
      },
      PENDING: {
        color:
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
        icon: Clock,
        label: "PENDING",
      },
      CONFIRMED: {
        color:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: CheckCircle,
        label: "CONFIRMED",
      },
      PROCESSING: {
        color:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        icon: null,
        label: "PROCESSING",
      },
      READY: {
        color:
          "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
        icon: null,
        label: "READY",
      },
      SHIPPED: {
        color:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: null,
        label: "SHIPPED",
      },
    };
    return (
      map[status] || {
        color:
          "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
        icon: null,
        label: status || "UNKNOWN",
      }
    );
  };

  const columns = [
    {
      header: t("order"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-black text-black dark:text-white">
            #{row.orderNumber}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
          <span className="text-[8px] font-bold text-neutral-400 uppercase">
            {row.orderType || orderType.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: t("customer"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase text-black dark:text-white">
            {row.customer?.firstName
              ? `${row.customer.firstName} ${row.customer.lastName || ""}`.trim()
              : row.shippingAddress?.name || "Walk-in"}
          </span>
          <span className="text-[9px] text-[#E9B10C] font-black">
            {row.customer?.phone || row.shippingAddress?.phone || "N/A"}
          </span>
          {row.customer?.customerId && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              {row.customer.customerId}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("amount"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-black text-black dark:text-white">
            ⃁ {(row.totalAmount || 0).toLocaleString()}
          </span>
          {row.dueAmount > 0 && (
            <span className="text-[8px] font-bold text-red-500">
              {t("due")}: ⃁ {row.dueAmount.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("payment"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm w-fit ${
              row.paymentStatus === "PAID"
                ? "bg-green-500/10 text-green-500"
                : row.paymentStatus === "PARTIAL"
                ? "bg-yellow-500/10 text-yellow-600"
                : row.paymentStatus === "REFUNDED"
                ? "bg-blue-500/10 text-blue-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {row.paymentStatus || "PENDING"}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
            {row.paymentMethod}
          </span>
        </div>
      ),
    },
    {
      header: t("status"),
      render: (row) => {
        const status = getOrderStatus(row);
        const badge = getStatusBadge(status);
        const Icon = badge.icon;

        return (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm border flex w-max items-center gap-1.5 ${badge.color}`}
            >
              {Icon && <Icon size={10} strokeWidth={3} />}
              {badge.label}
            </span>
            {status === "CANCEL_REQUESTED" && row.cancellation?.reason && (
              <span className="text-[8px] text-orange-500 font-medium max-w-[120px] truncate">
                {row.cancellation.reason}
              </span>
            )}
            {status === "CANCELLED" && row.cancellation?.reason && (
              <span className="text-[8px] text-red-400 font-medium max-w-[120px] truncate">
                {row.cancellation.reason}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: t("actions"),
      render: (row) => {
        const status = getOrderStatus(row);
        const isCancelled = status === "CANCELLED";
        const isCancelRequested = status === "CANCEL_REQUESTED";
        const isCompleted = ["COMPLETED", "DELIVERED"].includes(status);
        const isPending = status === "PENDING";

        return (
          <div className="flex gap-1.5 items-center flex-wrap">
            <button
              onClick={() => onView(row)}
              title={t("viewDetails")}
              className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-black dark:hover:text-white transition-colors"
            >
              <Eye size={13} />
            </button>

            {isCancelRequested && (
              <>
                <button
                  onClick={() => onApproveCancellation(row)}
                  title={t("approveCancellation")}
                  className="p-1.5 bg-green-500/10 rounded-sm text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                >
                  <ThumbsUp size={13} />
                </button>
                <button
                  onClick={() => onRejectCancellation(row)}
                  title={t("rejectCancellation")}
                  className="p-1.5 bg-red-500/10 rounded-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ThumbsDown size={13} />
                </button>
              </>
            )}

            {isCancelled && (
              <button
                onClick={() => onPermanentDelete(row)}
                title={t("permanentlyDelete")}
                className="p-1.5 bg-red-500/10 rounded-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}

            {!isCancelled && !isCancelRequested && (
              <>
                {!isCompleted && (
                  <button
                    onClick={() => onUpdateStatus(row, "COMPLETED")}
                    title={t("markCompleted")}
                    className="p-1.5 bg-green-500/10 rounded-sm text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <CheckCircle size={13} />
                  </button>
                )}
                {!isPending && !isCompleted && (
                  <button
                    onClick={() => onUpdateStatus(row, "PENDING")}
                    title={t("markPending")}
                    className="p-1.5 bg-yellow-500/10 rounded-sm text-yellow-600 hover:bg-[#E9B10C] hover:text-black transition-colors"
                  >
                    <Clock size={13} />
                  </button>
                )}
                {!isCompleted && (
                  <button
                    onClick={() => onCancel(row)}
                    title={t("cancelOrder")}
                    className="p-1.5 bg-red-500/10 rounded-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <XCircle size={13} />
                  </button>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};