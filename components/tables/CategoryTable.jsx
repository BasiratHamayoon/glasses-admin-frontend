"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Trash2, Eye } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export const CategoryTable = ({ categories, loading, onView, onEdit, onDelete }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const columns = [
    { 
      header: "IMG", 
      render: (row) => (
        <div className="w-8 h-8 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
          {row.image ? (
            <SafeImage src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : row.icon ? (
            <SafeImage src={row.icon} alt={row.name} className="w-full h-full object-cover p-1" />
          ) : (
            <span className="text-[7px] text-neutral-400 flex items-center justify-center w-full h-full font-bold">NO IMG</span>
          )}
        </div>
      ) 
    },
    { 
      header: t("name") || "Name", 
      render: (row) => {
        const indent = row.level > 0 ? (row.level * 1.5) : 0;
        return (
          <div style={{ [isArabic ? 'paddingRight' : 'paddingLeft']: `${indent}rem` }} className="flex items-center gap-2">
            {row.level > 0 && <span className="text-neutral-400">↳</span>}
            <span className={row.level === 0 ? "font-bold text-[#E9B10C]" : "text-neutral-600 dark:text-neutral-300"}>{row.name}</span>
          </div>
        );
      }
    },
    { header: t("productCount") || "Total Products", render: (row) => <span className="text-[10px] font-bold">{row.productCount || 0}</span> },
    { header: t("level") || "Level", render: (row) => <span className="text-[10px] font-bold">{row.level || 0}</span> },
    { header: t("status") || "Status", render: (row) => (
      <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${row.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.isActive ? (t('active') || 'ACTIVE') : (t('inactive') || 'INACTIVE')}
      </span>
    )},
    { 
      header: t("actions") || "Actions", 
      render: (row) => (
        <div className="flex gap-3 items-center">
          <button onClick={() => onView(row)} title={t('viewCategory') || "View"} className="text-neutral-500 hover:text-blue-500 transition-colors"><Eye size={14} /></button>
          <button onClick={() => onEdit(row)} title="Edit" className="text-neutral-500 hover:text-[#E9B10C] transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => onDelete(row)} title="Delete" className="text-neutral-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={categories} loading={loading} />;
};