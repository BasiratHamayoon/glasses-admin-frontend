"use client";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const BasePagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-[11px] font-medium transition-colors rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isArabic ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        <span>{t('previous') || 'Previous'}</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map(page => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center text-[11px] font-medium transition-colors rounded-sm ${
                  currentPage === page
                    ? 'border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
              >
                {page}
              </button>
            );
          }
          if (page === currentPage - 2 || page === currentPage + 2) {
            return <div key={page} className="w-8 h-8 flex items-center justify-center text-neutral-400"><MoreHorizontal size={14} /></div>;
          }
          return null;
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-[11px] font-medium transition-colors rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>{t('next') || 'Next'}</span>
        {isArabic ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </div>
  );
};