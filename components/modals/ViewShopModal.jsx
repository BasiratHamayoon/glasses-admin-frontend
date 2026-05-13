"use client";
import { BaseModal } from "./BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";

export const ViewShopModal = ({ isOpen, onClose, shop }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (!shop) return null;

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      <span className="text-[12px] font-medium text-black dark:text-white">{value || '-'}</span>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={shop.name} maxWidth="max-w-3xl">
      <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* Core Info */}
        <div className="bg-neutral-50 dark:bg-[#1a1a1a] p-5 rounded-sm border border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailRow label={t('shopCode') || 'Shop Code'} value={shop.code} />
            <DetailRow label={t('shopType') || 'Shop Type'} value={shop.shopType} />
            <DetailRow label={t('status') || 'Status'} value={shop.status} />
            <DetailRow label={t('description') || 'Description'} value={shop.description} />
          </div>
        </div>

        {/* Address & Contact - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 dark:border-neutral-800 p-5 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-widest font-black mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-[#E9B10C]">
              {t('address') || 'Address Details'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <DetailRow label={t('street') || 'Street'} value={shop.address?.street} />
              <DetailRow label={t('area') || 'Area'} value={shop.address?.area} />
              <DetailRow label={t('city') || 'City'} value={shop.address?.city} />
              <DetailRow label={t('state') || 'State'} value={shop.address?.state} />
              <DetailRow label={t('pincode') || 'Pincode'} value={shop.address?.pincode} />
            </div>
          </div>
          
          <div className="border border-neutral-200 dark:border-neutral-800 p-5 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-widest font-black mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-[#E9B10C]">
              {t('contact') || 'Contact Details'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <DetailRow label={t('phone') || 'Phone'} value={shop.contact?.phone} />
              <DetailRow label={t('alternatePhone') || 'Alt Phone'} value={shop.contact?.alternatePhone} />
              <DetailRow label="Email" value={shop.contact?.email} />
              <DetailRow label="WhatsApp" value={shop.contact?.whatsapp} />
            </div>
          </div>
        </div>

        {/* Settings Overview */}
        {shop.settings && (
          <div className="border border-neutral-200 dark:border-neutral-800 p-5 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-widest font-black mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-[#E9B10C]">
              {t('settings') || 'System Settings'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
               {['taxEnabled', 'printReceipt', 'returnEnabled', 'lowStockAlert', 'openingCashRequired', 'dailyClosingRequired'].map(key => (
                 <div key={key} className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full shrink-0 ${shop.settings[key] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <span className="text-[10px] uppercase tracking-widest font-medium text-neutral-500">
                     {key.replace(/([A-Z])/g, ' $1').trim()}
                   </span>
                 </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </BaseModal>
  );
};