"use client";
import { BaseCard } from "../BaseCard";
import { Activity, AlertCircle, Store, Users, Check, X, Box, RotateCcw, Clock, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper to guarantee a valid number format
const formatCurrency = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0' : num.toLocaleString();
};

export const MonitorStats = ({ dashboard }) => {
  const { t, language } = useLanguage();
  
  // Safely extract text (falls back to English if translation is missing or is an object)
  const getTitle = (key, fallback) => {
    const translation = t(key);
    return typeof translation === 'string' ? translation : fallback;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <BaseCard 
        title={getTitle("totalCashInHand", "Global Cash In Hand")} 
        value={`SAR ${formatCurrency(dashboard?.totalCashInHand)}`} 
        icon={Coins} 
      />
      
      <BaseCard 
        title={getTitle("todayTotalSales", "Global Today Sales")} 
        value={`SAR ${formatCurrency(dashboard?.todayTotalSales)}`} 
        icon={Activity} 
      />
      
      <BaseCard 
        title={getTitle("totalLiability", "Global Liability (Due)")} 
        value={`SAR ${formatCurrency(dashboard?.totalLiability)}`} 
        icon={AlertCircle} 
      />
      
      <BaseCard 
        title={getTitle("activeShops", "Active Shops")} 
        value={String(Number(dashboard?.activeShops) || 0)} 
        icon={Store} 
        subtitle={`Out of ${Number(dashboard?.totalShops) || 0} total`} 
      />
    </div>
  );
};

export const ShopStatusPanel = ({ closing, staff, dues, shopName }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const isPending = !closing?.isClosedToday;
  const pendingDuesAmount = Number(dues?.liabilityToAdmin) || 0;

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 mb-6 shadow-sm">
      <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 text-[#E9B10C]">
        {shopName} {typeof t("shopStatus") === 'string' ? t("shopStatus") : "Status Overview"}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800" dir={isArabic ? 'rtl' : 'ltr'}>
        
        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Clock size={12}/> {typeof t("dailyClosing") === 'string' ? t("dailyClosing") : "Daily Closing"}</span>
          <span className={`text-sm font-black uppercase tracking-widest flex items-center gap-1 ${isPending ? 'text-orange-500' : 'text-green-500'}`}>
            {isPending ? <X size={14} /> : <Check size={14} />}
            {isPending ? (typeof t("pending") === 'string' ? t("pending") : "Pending") : (typeof t("closed") === 'string' ? t("closed") : "Closed")}
          </span>
        </div>

        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Users size={12}/> {typeof t("staffActive") === 'string' ? t("staffActive") : "Staff Active"}</span>
          <span className="text-xl font-black text-black dark:text-white">{Number(staff?.totalStaff) || 0}</span>
        </div>

        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><AlertCircle size={12}/> {typeof t("pendingDues") === 'string' ? t("pendingDues") : "Pending Dues"}</span>
          <span className="text-xl font-black text-red-500">SAR {formatCurrency(pendingDuesAmount)}</span>
        </div>

        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Box size={12}/> {typeof t("stockAlerts") === 'string' ? t("stockAlerts") : "Stock Alerts"}</span>
          <span className="text-xl font-black text-orange-500">0</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><RotateCcw size={12}/> {typeof t("returns") === 'string' ? t("returns") : "Returns"}</span>
          <span className="text-xl font-black text-black dark:text-white">0</span>
        </div>

      </div>
    </div>
  );
};