"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, XCircle, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { approveAdjustment, applyAdjustment, rejectAdjustment } from "@/redux/actions/inventoryActions";
import { toast } from "sonner";
import { useState } from "react";

const Field = ({ label, value, badge }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">{label}</span>
      {badge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black rounded-sm w-fit text-black dark:text-white">{String(value)}</span>
      ) : (
        <span className="text-[11px] font-medium text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

export const AdjustmentViewModal = ({ isOpen, onClose, adjustment, onRefresh }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action) => {
    setActionLoading(action);
    try {
      if (action === "approve") {
        await dispatch(approveAdjustment({ id: adjustment._id, data: {} })).unwrap();
        toast.success(t("adjApproved"));
      } else if (action === "apply") {
        await dispatch(applyAdjustment(adjustment._id)).unwrap();
        toast.success(t("adjApplied"));
      } else if (action === "reject") {
        await dispatch(rejectAdjustment({ id: adjustment._id, data: { reason: "Rejected" } })).unwrap();
        toast.success(t("adjRejected"));
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    PENDING: "bg-amber-500/10 text-amber-500",
    APPROVED: "bg-blue-500/10 text-blue-500",
    APPLIED: "bg-green-500/10 text-green-500",
    REJECTED: "bg-red-500/10 text-red-500",
    CANCELLED: "bg-neutral-500/10 text-neutral-500",
    DRAFT: "bg-neutral-100 text-neutral-600",
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("adjDetails")} maxWidth="max-w-2xl">
      {!adjustment ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{t("loadingModal")}</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <div>
              <div className="text-lg font-black text-[#E9B10C] tracking-widest">{adjustment.adjustmentNumber}</div>
              <div className="text-[10px] uppercase text-neutral-500 font-bold mt-1">{adjustment.adjustmentType?.replace(/_/g, " ")}</div>
            </div>
            <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-black rounded-sm ${statusColors[adjustment.status] || ""}`}>
              {adjustment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("shop")} value={adjustment.shop?.name} />
            <Field label={t("createdBy")} value={adjustment.createdBy?.name} />
            <Field label={t("reason")} value={adjustment.reason} />
            <Field label={t("notes")} value={adjustment.notes} />
            <Field label={t("totalIncrease")} value={adjustment.totalIncrease} badge />
            <Field label={t("totalDecrease")} value={adjustment.totalDecrease} badge />
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">{t("items")}</span>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {adjustment.items?.map((item, idx) => (
                <div key={idx} className="p-4 grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <div className="text-[11px] font-bold text-black dark:text-white">{item.productName}</div>
                    <div className="text-[9px] text-neutral-400 uppercase">{item.productSKU}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold mb-1">{t("prevQty")}</div>
                    <div className="text-[11px] font-bold">{item.previousQuantity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold mb-1">{t("newQty")}</div>
                    <div className={`text-[11px] font-bold ${item.difference > 0 ? "text-green-500" : item.difference < 0 ? "text-red-500" : ""}`}>
                      {item.newQuantity} ({item.difference > 0 ? "+" : ""}{item.difference})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(adjustment.status === "PENDING" || adjustment.status === "APPROVED") && (
            <div className="flex gap-2 justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
              {adjustment.status === "PENDING" && (
                <>
                  <button onClick={() => handleAction("approve")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 text-[10px] uppercase font-black rounded-sm hover:bg-green-500/20 transition-colors disabled:opacity-60">
                    {actionLoading === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} {t("approve")}
                  </button>
                  <button onClick={() => handleAction("reject")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-[10px] uppercase font-black rounded-sm hover:bg-red-500/20 transition-colors disabled:opacity-60">
                    {actionLoading === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} {t("reject")}
                  </button>
                </>
              )}
              {adjustment.status === "APPROVED" && (
                <button onClick={() => handleAction("apply")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 text-[10px] uppercase font-black rounded-sm hover:bg-blue-500/20 transition-colors disabled:opacity-60">
                  {actionLoading === "apply" ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />} {t("apply")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};