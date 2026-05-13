"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmLabel,
  confirmClass = "bg-[#E9B10C] hover:bg-yellow-500 text-black",
}) => {
  const { t } = useLanguage();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4 pb-2">
        {description && (
          <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[10px] uppercase font-black tracking-widest border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition-colors disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-[10px] uppercase font-black tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${confirmClass}`}
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {confirmLabel || t("confirm")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};