"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export const BaseTable = ({ columns, data, loading }) => {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

  if (loading) return <div className="p-8 text-center text-[10px] uppercase tracking-widest text-neutral-500">{t('loading')}</div>;
  if (!data || data.length === 0) return <div className="p-8 text-center text-[10px] uppercase tracking-widest text-neutral-500">{t('noData') || 'No Data Found'}</div>;

  return (
    <div className="w-full overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-sm">
      <table className="w-full text-left border-collapse" dir={isArabic ? 'rtl' : 'ltr'}>
        <thead className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`p-4 text-[10px] uppercase tracking-[0.2em] font-black text-neutral-500 ${isArabic ? 'text-right' : 'text-left'}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#0a0a0a]/50 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className={`p-4 text-[11px] font-medium text-black dark:text-white ${isArabic ? 'text-right' : 'text-left'}`}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};