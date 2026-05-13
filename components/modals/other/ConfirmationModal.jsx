"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  loading,
  confirmText, // Dynamic button text
  confirmClass = "bg-red-500 hover:bg-red-600 text-white", // Dynamic button color
  warningText, // Dynamic sub-text
  iconColor = "text-red-500" // Dynamic icon color
}) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title || t('confirmDelete') || 'Confirm Deletion'}>
      <div className="flex flex-col items-center justify-center p-4 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <AlertTriangle size={48} className={`${iconColor} mb-4 opacity-80`} />
        <p className="text-[12px] text-black dark:text-white font-medium mb-2">{message}</p>
        <p className="text-[10px] text-neutral-500 mb-6">{warningText || t('deleteWarning') || 'This action cannot be undone.'}</p>

        <div className="flex gap-3 w-full justify-center">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
          >
            {t('cancel') || 'Cancel'}
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 rounded-sm min-w-[120px] ${confirmClass}`}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : (confirmText || t('delete') || 'Delete')}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};