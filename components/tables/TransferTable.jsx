"use client";
import { useDispatch } from "react-redux";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, CheckCircle, XCircle, Truck, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { approveTransfer, rejectTransfer, shipTransfer, receiveTransfer } from "@/redux/actions/inventoryActions";

const statusColors = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  REQUESTED: "bg-amber-500/10 text-amber-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  PARTIALLY_APPROVED: "bg-blue-300/10 text-blue-400",
  REJECTED: "bg-red-500/10 text-red-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  IN_TRANSIT: "bg-purple-500/10 text-purple-500",
  RECEIVED: "bg-green-500/10 text-green-500",
  PARTIALLY_RECEIVED: "bg-green-300/10 text-green-400",
  CANCELLED: "bg-neutral-500/10 text-neutral-500",
};

const priorityColors = {
  LOW: "text-neutral-400",
  NORMAL: "text-blue-400",
  HIGH: "text-amber-500",
  URGENT: "text-red-500",
};

export const TransferTable = ({ data, loading, onView, onRefresh }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const handleApprove = async (row) => {
    try {
      await dispatch(approveTransfer({ id: row._id, data: {} })).unwrap();
      toast.success(t("transferApproved"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleReject = async (row) => {
    try {
      await dispatch(rejectTransfer({ id: row._id, data: { reason: "Rejected by admin" } })).unwrap();
      toast.success(t("transferRejected"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleShip = async (row) => {
    try {
      await dispatch(shipTransfer({ id: row._id, data: { shippingMethod: "SELF" } })).unwrap();
      toast.success(t("transferShipped"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleReceive = async (row) => {
    try {
      await dispatch(receiveTransfer({ id: row._id, data: {} })).unwrap();
      toast.success(t("transferReceived"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const columns = [
    {
      header: t("transferNumber"),
      render: (row) => (
        <span className="text-[10px] font-black tracking-wider text-[#E9B10C]">
          {row.transferNumber}
        </span>
      ),
    },
    {
      header: t("fromShop"),
      render: (row) => <span className="text-[10px] font-bold">{row.fromShop?.name || "-"}</span>,
    },
    {
      header: t("toShop"),
      render: (row) => <span className="text-[10px] font-bold">{row.toShop?.name || "-"}</span>,
    },
    {
      header: t("priority"),
      render: (row) => (
        <span className={`text-[9px] uppercase font-black tracking-widest ${priorityColors[row.priority] || ""}`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: t("items"),
      render: (row) => <span className="font-black text-[11px]">{row.totalItems || 0}</span>,
    },
    {
      header: t("status"),
      render: (row) => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${statusColors[row.status] || "bg-neutral-100 text-neutral-600"}`}>
          {row.status?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-1.5 items-center">
          <button onClick={() => onView(row)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-blue-500 transition-colors" title={t("view")}>
            <Eye size={13} />
          </button>
          {row.status === "REQUESTED" && (
            <>
              <button onClick={() => handleApprove(row)} className="p-1.5 bg-green-500/10 rounded-sm text-green-500 hover:bg-green-500/20 transition-colors" title={t("approve")}>
                <CheckCircle size={13} />
              </button>
              <button onClick={() => handleReject(row)} className="p-1.5 bg-red-500/10 rounded-sm text-red-500 hover:bg-red-500/20 transition-colors" title={t("reject")}>
                <XCircle size={13} />
              </button>
            </>
          )}
          {(row.status === "APPROVED" || row.status === "PARTIALLY_APPROVED") && (
            <button onClick={() => handleShip(row)} className="p-1.5 bg-purple-500/10 rounded-sm text-purple-500 hover:bg-purple-500/20 transition-colors" title={t("ship")}>
              <Truck size={13} />
            </button>
          )}
          {(row.status === "SHIPPED" || row.status === "IN_TRANSIT") && (
            <button onClick={() => handleReceive(row)} className="p-1.5 bg-green-500/10 rounded-sm text-green-500 hover:bg-green-500/20 transition-colors" title={t("receive")}>
              <PackageCheck size={13} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};