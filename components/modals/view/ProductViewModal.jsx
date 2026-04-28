"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChevronDown, Star } from "lucide-react";

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
        <span className="text-[11px] font-medium text-black dark:text-white break-words">{String(value)}</span>
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

export const ProductViewModal = ({ isOpen, onClose, product }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (!product) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('viewProduct') || 'Product Details'} maxWidth="max-w-3xl">
      <div dir={isArabic ? 'rtl' : 'ltr'} className="pb-4">
        
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
          {product.images?.length > 0 ? product.images.map((img, i) => (
            <div key={i} className={`w-32 h-32 shrink-0 rounded-sm overflow-hidden border-2 relative ${img.isPrimary ? 'border-[#E9B10C]' : 'border-neutral-200 dark:border-neutral-800'}`}>
              <SafeImage src={img.url} alt={product.name} className="w-full h-full object-cover" />
              {img.isPrimary && <span className="absolute top-1 left-1 bg-[#E9B10C] text-black text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm flex items-center gap-1"><Star size={8} className="fill-black"/> Primary</span>}
            </div>
          )) : (
            <div className="w-32 h-32 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[9px] uppercase tracking-widest text-neutral-400 font-bold rounded-sm border border-neutral-200 dark:border-neutral-800">No Image</div>
          )}
        </div>

        <Accordion title="General Information" defaultOpen={true}>
          <RenderField label="Name" value={product.name} />
          <RenderField label="SKU" value={product.sku} isBadge />
          <RenderField label="Barcode" value={product.barcode || '-'} />
          <RenderField label="Product Type" value={product.productType} isBadge />
          <RenderField label="Category" value={product.category?.name || '-'} />
          <RenderField label="Target Gender" value={product.gender} />
          <RenderField label="Age Group" value={product.ageGroup} />
          <RenderField label="Description" value={product.description || '-'} isFullWidth />
        </Accordion>

        <Accordion title="Pricing">
          <RenderField label="Cost Price" value={`SAR ${product.costPrice}`} />
          <RenderField label="Selling Price" value={`SAR ${product.sellingPrice}`} />
          <RenderField label="Discount" value={product.discount ? `${product.discount} ${product.discountType === 'PERCENTAGE' ? '%' : 'SAR'}` : 'None'} />
          <RenderField label="Discount Type" value={product.discountType} />
        </Accordion>

        {product.frameSpecs && Object.keys(product.frameSpecs).length > 0 && (
          <Accordion title="Frame Specifications">
            <RenderField label="Shape" value={product.frameSpecs.frameShape} />
            <RenderField label="Material" value={product.frameSpecs.frameMaterial} />
            <RenderField label="Frame Type" value={product.frameSpecs.frameType} />
            <RenderField label="Frame Width" value={product.frameSpecs.frameWidth ? `${product.frameSpecs.frameWidth} mm` : null} />
          </Accordion>
        )}

        {product.lensSpecs && Object.keys(product.lensSpecs).length > 0 && (
          <Accordion title="Lens Specifications">
            <RenderField label="Lens Type" value={product.lensSpecs.lensType} />
            <RenderField label="Material" value={product.lensSpecs.lensMaterial} />
          </Accordion>
        )}

      </div>
    </BaseModal>
  );
};