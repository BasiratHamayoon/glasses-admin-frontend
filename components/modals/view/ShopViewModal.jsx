"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RenderField = ({ label, value, isBadge = false, isFullWidth = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={`flex flex-col mb-2 ${isFullWidth ? 'col-span-1 sm:col-span-2' : ''}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] rounded-sm w-fit font-black border border-neutral-200 dark:border-neutral-700">{String(value)}</span>
      ) : (
        <span className="text-[11px] font-medium break-words text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 transition-colors">
        <span className="text-[10px] uppercase tracking-widest font-black">{title}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 bg-white dark:bg-[#111111]">{children}</div>}
    </div>
  );
};

export const ShopViewModal = ({ isOpen, onClose, data }) => {
  const { isArabic } = useLanguage();

  if (!data || !data.shop) return null;
  const { shop, wallet, staffCount } = data;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={shop.name} maxWidth="max-w-2xl">
      <div className="pb-4" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* Header Summary */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 flex justify-between items-center mb-4">
           <div>
             <h2 className="text-xl font-black text-[#E9B10C] tracking-widest">{shop.name}</h2>
             <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">{shop.code} | {shop.shopType}</p>
           </div>
           <div className="text-right">
             <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${shop.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
               {shop.status}
             </span>
             <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2">Active Staff</p>
             <h2 className="text-lg font-black text-black dark:text-white">{staffCount || 0}</h2>
           </div>
        </div>

        <Accordion title="Location & Contact" defaultOpen={true}>
          <RenderField label="Street" value={shop.address?.street} />
          <RenderField label="City & State" value={`${shop.address?.city}, ${shop.address?.state}`} />
          <RenderField label="Pincode" value={shop.address?.pincode} />
          <RenderField label="Manager" value={shop.manager?.name} isBadge />
          <RenderField label="Phone" value={shop.contact?.phone} />
          <RenderField label="Email" value={shop.contact?.email} />
        </Accordion>

        <Accordion title="Financial Overview (Wallet)" defaultOpen={true}>
          <RenderField label="Cash Balance" value={`SAR ${wallet?.cashBalance?.toLocaleString() || 0}`} />
          <RenderField label="Total Balance" value={`SAR ${wallet?.totalBalance?.toLocaleString() || 0}`} />
          <RenderField label="Today's Sales" value={`SAR ${wallet?.todaySales?.total?.toLocaleString() || 0}`} />
          <RenderField label="Due to Admin" value={`SAR ${wallet?.liabilityToAdmin?.toLocaleString() || 0}`} isBadge />
        </Accordion>

        <Accordion title="System Configuration">
          <RenderField label="Invoice Prefix" value={shop.settings?.invoicePrefix} />
          <RenderField label="Default Tax Rate" value={`${shop.settings?.defaultTaxRate || 0}%`} />
          <RenderField label="POS Access" value={shop.allowPOSAccess ? 'ENABLED' : 'DISABLED'} isBadge />
          <RenderField label="Description" value={shop.description} isFullWidth />
          
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 border-t border-neutral-200 dark:border-neutral-800 pt-2">
            {['taxEnabled', 'printReceipt', 'dailyClosingRequired'].map(key => (
               <div key={key} className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${shop.settings?.[key] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <span className="text-[9px] uppercase tracking-widest text-neutral-500">{key.replace(/([A-Z])/g, ' $1')}</span>
               </div>
            ))}
          </div>
        </Accordion>

      </div>
    </BaseModal>
  );
};