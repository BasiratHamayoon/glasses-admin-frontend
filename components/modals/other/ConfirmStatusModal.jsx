"use client";
import { BaseModal } from "../BaseModal";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ConfirmStatusModal = ({ isOpen, onClose, onConfirm, status, loading }) => {
  const { t } = useLanguage();

  const isCompleted = status === 'completed' || status === 'delivered';
  const title = isCompleted ? t("confirmReceiveTitle") || "Confirm Order Receipt" : t("confirmPendingTitle") || "Mark as Pending";
  const message = isCompleted ? t("confirmReceiveMsg") || "Are you sure you want to mark this order as received/completed?" : t("confirmPendingMsg") || "Are you sure you want to revert this order status to pending?";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="p-6 space-y-6">
        <p className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
          {message}
        </p>
        
        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {t("abort") || "Cancel"}
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            disabled={loading} 
            className={`px-6 py-2 text-white text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 transition-colors ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-[#E9B10C] hover:bg-[#d4a00a] text-black'}`}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : (t("confirm") || "Confirm")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};