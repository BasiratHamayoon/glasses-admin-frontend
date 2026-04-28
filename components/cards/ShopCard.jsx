"use client";
import { Edit2, Trash2, MapPin, Phone, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ShopCard = ({ shop, onEdit, onDelete, onView }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    // 🔥 Increased padding (p-6) and gap (gap-5) for a wider, more premium look
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col gap-5 group hover:border-[#E9B10C] transition-all duration-300 relative shadow-sm hover:shadow-md">
      
      {/* Top Header: Status & Code */}
      <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3" dir={isArabic ? 'rtl' : 'ltr'}>
        <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${shop.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {shop.status}
        </span>
        <span className="text-[10px] uppercase font-bold text-neutral-400">
          {shop.code}
        </span>
      </div>

      {/* Main Info */}
      <div dir={isArabic ? 'rtl' : 'ltr'} className="flex-1">
        <h3 className="text-lg font-black text-black dark:text-white mb-1 truncate">{shop.name}</h3>
        <p className="text-[11px] uppercase tracking-widest text-[#E9B10C] font-bold mb-4">{t(shop.shopType?.toLowerCase()) || shop.shopType}</p>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3 text-[12px] text-neutral-500">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{shop.address?.city || '-'} , {shop.address?.state || '-'}</span>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-neutral-500">
            <Phone size={14} className="shrink-0" />
            <span>{shop.contact?.phone || '-'}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800" dir={isArabic ? 'rtl' : 'ltr'}>
        <button 
          onClick={() => onView(shop)} 
          className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
        >
          <Eye size={14} /> {t("viewDetails") || "View Details"}
        </button>

        <div className="flex gap-4">
          <button onClick={() => onEdit(shop)} className="text-neutral-400 hover:text-[#E9B10C] transition-colors"><Edit2 size={16} /></button>
          <button onClick={() => onDelete(shop)} className="text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};