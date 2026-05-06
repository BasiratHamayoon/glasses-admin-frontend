"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export const RejectCancellationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  order,
}) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(t("rejectionReasonRequired"));
      return;
    }
    setError("");
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("rejectCancellation")}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 pb-2">
        {order && (
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-3">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest block mb-0.5">
              {t("order")}
            </span>
            <span className="text-[12px] font-black text-black dark:text-white">
              #{order.orderNumber}
            </span>
            {order.cancellation?.reason && (
              <div className="mt-2">
                <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest block mb-0.5">
                  {t("cancellationReason")}
                </span>
                <p className="text-[11px] font-medium text-orange-500">
                  {order.cancellation.reason}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
          {t("rejectCancellationDesc")}
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500">
            {t("rejectionReason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            rows={3}
            placeholder={t("rejectionReasonPlaceholder")}
            className="w-full px-3 py-2 text-[11px] font-medium bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#E9B10C] resize-none"
          />
          {error && (
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
              {error}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[10px] uppercase font-black tracking-widest border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition-colors disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[10px] uppercase font-black tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {t("rejectCancellation")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};