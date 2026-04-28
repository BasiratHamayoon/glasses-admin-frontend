"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const fontFamily = isArabic 
    ? "var(--font-cairo), var(--font-tajawal), system-ui, sans-serif"
    : "system-ui, -apple-system, sans-serif";

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-2 mt-16 ${isArabic ? 'flex-row-reverse' : ''}`}>
      
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-3 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 hover:border-[#E9B10C] hover:text-[#E9B10C] transition-colors text-[10px] uppercase tracking-[0.2em] cursor-pointer disabled:cursor-not-allowed"
        style={{ fontFamily, fontWeight: 900 }}
      >
        {t('previous')}
      </button>

      {/* Page Numbers */}
      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center border transition-colors cursor-pointer text-[12px] ${
              currentPage === page 
                ? 'bg-[#E9B10C] border-[#E9B10C] text-black' 
                : 'border-neutral-200 dark:border-neutral-800 hover:border-[#E9B10C]'
            }`}
            style={{ fontFamily, fontWeight: 900 }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-3 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 hover:border-[#E9B10C] hover:text-[#E9B10C] transition-colors text-[10px] uppercase tracking-[0.2em] cursor-pointer disabled:cursor-not-allowed"
        style={{ fontFamily, fontWeight: 900 }}
      >
        {t('next')}
      </button>
    </div>
  );
}