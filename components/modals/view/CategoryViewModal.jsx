"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChevronDown } from "lucide-react";

const RenderField = ({ label, value, isBadge = false, isFullWidth = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={`flex flex-col mb-2 ${isFullWidth ? 'col-span-1 sm:col-span-2' : ''}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] rounded-sm w-fit font-black text-black dark:text-white">
          {String(value)}
        </span>
      ) : (
        <span className="text-[11px] font-medium text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">{title}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-white dark:bg-[#111111]">{children}</div>}
    </div>
  );
};

export const CategoryViewModal = ({ isOpen, onClose, category }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (!category) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('viewCategory') || 'Category Details'} maxWidth="max-w-2xl">
      <div dir={isArabic ? 'rtl' : 'ltr'} className="pb-4">
        
        <div className="flex gap-4 mb-4">
          {category.image && (
            <div className="flex-1 h-32 rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-800 relative">
               <span className="absolute top-0 left-0 bg-black/50 text-white text-[8px] px-2 py-1 uppercase tracking-widest font-bold z-10 backdrop-blur-sm">Cover</span>
               <SafeImage src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <Accordion title="Basic Information" defaultOpen={true}>
          <RenderField label="Name" value={category.name} />
          <RenderField label="Slug" value={category.slug} />
          <RenderField label="Total Products" value={category.productCount} isBadge />
          <RenderField label="Description" value={category.description} isFullWidth />
        </Accordion>

        <Accordion title="Visibility & Flags">
          <RenderField label="Is Active" value={category.isActive ? 'YES' : 'NO'} isBadge />
          <RenderField label="Is Featured" value={category.isFeatured ? 'YES' : 'NO'} isBadge />
          <RenderField label="Show on Website" value={category.showOnWebsite ? 'YES' : 'NO'} isBadge />
          <RenderField label="Show on POS" value={category.showOnPOS ? 'YES' : 'NO'} isBadge />
        </Accordion>

        <Accordion title="System Info">
          <RenderField label="Created At" value={new Date(category.createdAt).toLocaleString()} />
          <RenderField label="Updated At" value={new Date(category.updatedAt).toLocaleString()} />
          <RenderField label="Created By ID" value={category.createdBy?.name || category.createdBy} />
        </Accordion>

      </div>
    </BaseModal>
  );
};