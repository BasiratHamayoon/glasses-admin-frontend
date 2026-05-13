"use client";
import { useDispatch } from "react-redux";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, CheckCircle, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { approveAdjustment, applyAdjustment, rejectAdjustment } from "@/redux/actions/inventoryActions";

const statusColors = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PENDING: "bg-amber-500/10 text-amber-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  REJECTED: "bg-red-500/10 text-red-500",
  APPLIED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-neutral-500/10 text-neutral-500",
};

export const AdjustmentTable = ({ data, loading, onView, onRefresh }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const handleApprove = async (row) => {
    try {
      await dispatch(approveAdjustment({ id: row._id, data: {} })).unwrap();
      toast.success(t("adjApproved"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleApply = async (row) => {
    try {
      await dispatch(applyAdjustment(row._id)).unwrap();
      toast.success(t("adjApplied"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const handleReject = async (row) => {
    try {
      await dispatch(rejectAdjustment({ id: row._id, data: { reason: "Rejected by admin" } })).unwrap();
      toast.success(t("adjRejected"));
      onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    }
  };

  const columns = [
    {
      header: t("adjNumber"),
      render: (row) => (
        <span className="text-[10px] font-black tracking-wider text-[#E9B10C]">
          {row.adjustmentNumber}
        </span>
      ),
    },
    {
      header: t("shop"),
      render: (row) => (
        <span className="text-[10px] font-bold">{row.shop?.name || "-"}</span>
      ),
    },
    {
      header: t("adjType"),
      render: (row) => (
        <span className="text-[9px] uppercase tracking-widest font-bold">
          {row.adjustmentType?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: t("items"),
      render: (row) => (
        <span className="font-black text-[11px]">{row.items?.length || 0}</span>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${statusColors[row.status] || "bg-neutral-100 text-neutral-600"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: t("createdBy"),
      render: (row) => (
        <span className="text-[10px] font-bold">{row.createdBy?.name || "-"}</span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-1.5 items-center">
          <button onClick={() => onView(row)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-blue-500 transition-colors" title={t("view")}>
            <Eye size={13} />
          </button>
          {row.status === "PENDING" && (
            <>
              <button onClick={() => handleApprove(row)} className="p-1.5 bg-green-500/10 rounded-sm text-green-500 hover:bg-green-500/20 transition-colors" title={t("approve")}>
                <CheckCircle size={13} />
              </button>
              <button onClick={() => handleReject(row)} className="p-1.5 bg-red-500/10 rounded-sm text-red-500 hover:bg-red-500/20 transition-colors" title={t("reject")}>
                <XCircle size={13} />
              </button>
            </>
          )}
          {row.status === "APPROVED" && (
            <button onClick={() => handleApply(row)} className="p-1.5 bg-blue-500/10 rounded-sm text-blue-500 hover:bg-blue-500/20 transition-colors" title={t("apply")}>
              <Zap size={13} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};