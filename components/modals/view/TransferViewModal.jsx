"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, XCircle, Truck, PackageCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { approveTransfer, rejectTransfer, shipTransfer, receiveTransfer, cancelTransfer } from "@/redux/actions/inventoryActions";
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

export const TransferViewModal = ({ isOpen, onClose, transfer, onRefresh }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action) => {
    setActionLoading(action);
    try {
      if (action === "approve") {
        await dispatch(approveTransfer({ id: transfer._id, data: {} })).unwrap();
        toast.success(t("transferApproved"));
      } else if (action === "reject") {
        await dispatch(rejectTransfer({ id: transfer._id, data: { reason: "Rejected" } })).unwrap();
        toast.success(t("transferRejected"));
      } else if (action === "ship") {
        await dispatch(shipTransfer({ id: transfer._id, data: { shippingMethod: "SELF" } })).unwrap();
        toast.success(t("transferShipped"));
      } else if (action === "receive") {
        await dispatch(receiveTransfer({ id: transfer._id, data: {} })).unwrap();
        toast.success(t("transferReceived"));
      } else if (action === "cancel") {
        await dispatch(cancelTransfer({ id: transfer._id, data: { reason: "Cancelled" } })).unwrap();
        toast.success(t("transferCancelled"));
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("transferDetails")} maxWidth="max-w-2xl">
      {!transfer ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{t("loadingModal")}</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <div>
              <div className="text-lg font-black text-[#E9B10C] tracking-widest">{transfer.transferNumber}</div>
              <div className="text-[10px] uppercase text-neutral-500 font-bold mt-1">{transfer.transferType?.replace(/_/g, " ")}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-black rounded-sm ${statusColors[transfer.status] || ""}`}>
                {transfer.status?.replace(/_/g, " ")}
              </span>
              <span className="text-[9px] uppercase font-bold text-neutral-500">{t("priority")}: {transfer.priority}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("fromShop")} value={transfer.fromShop?.name} />
            <Field label={t("toShop")} value={transfer.toShop?.name} />
            <Field label={t("reason")} value={transfer.reason?.replace(/_/g, " ")} />
            <Field label={t("requestedBy")} value={transfer.requestedBy?.name} />
            <Field label={t("totalItems")} value={transfer.totalItems} badge />
            <Field label={t("totalQty")} value={transfer.totalQuantity} badge />
            {transfer.requestNotes && <Field label={t("notes")} value={transfer.requestNotes} />}
            {transfer.approvalNotes && <Field label={t("approvalNotes")} value={transfer.approvalNotes} />}
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">{t("items")}</span>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {transfer.items?.map((item, idx) => (
                <div key={idx} className="p-4 grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <div className="text-[11px] font-bold text-black dark:text-white">{item.productName}</div>
                    <div className="text-[9px] text-neutral-400 uppercase">{item.productSKU}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold mb-1">{t("requested")}</div>
                    <div className="text-[11px] font-bold">{item.requestedQuantity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold mb-1">{t("approved")}</div>
                    <div className="text-[11px] font-bold">{item.approvedQuantity ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800 flex-wrap">
            {transfer.status === "REQUESTED" && (
              <>
                <button onClick={() => handleAction("approve")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 text-[10px] uppercase font-black rounded-sm hover:bg-green-500/20 transition-colors disabled:opacity-60">
                  {actionLoading === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} {t("approve")}
                </button>
                <button onClick={() => handleAction("reject")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-[10px] uppercase font-black rounded-sm hover:bg-red-500/20 transition-colors disabled:opacity-60">
                  {actionLoading === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} {t("reject")}
                </button>
              </>
            )}
            {(transfer.status === "APPROVED" || transfer.status === "PARTIALLY_APPROVED") && (
              <button onClick={() => handleAction("ship")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 text-[10px] uppercase font-black rounded-sm hover:bg-purple-500/20 transition-colors disabled:opacity-60">
                {actionLoading === "ship" ? <Loader2 size={13} className="animate-spin" /> : <Truck size={13} />} {t("ship")}
              </button>
            )}
            {(transfer.status === "SHIPPED" || transfer.status === "IN_TRANSIT") && (
              <button onClick={() => handleAction("receive")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 text-[10px] uppercase font-black rounded-sm hover:bg-green-500/20 transition-colors disabled:opacity-60">
                {actionLoading === "receive" ? <Loader2 size={13} className="animate-spin" /> : <PackageCheck size={13} />} {t("receive")}
              </button>
            )}
            {!["RECEIVED", "CANCELLED", "REJECTED"].includes(transfer.status) && (
              <button onClick={() => handleAction("cancel")} disabled={actionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-neutral-500/10 text-neutral-500 text-[10px] uppercase font-black rounded-sm hover:bg-neutral-500/20 transition-colors disabled:opacity-60">
                {actionLoading === "cancel" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} {t("cancel")}
              </button>
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
};