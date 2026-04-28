"use client";
import { BaseCard } from "@/components/cards/BaseCard";
import { DollarSign, Activity, AlertCircle, Store, Users, Check, X, Box, RotateCcw, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MonitoringGlobalCards = ({ dashboard }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseCard title={t("totalCashInHand") || "Global Cash In Hand"} value={`$${dashboard.totalCashInHand || 0}`} icon={DollarSign} />
      <BaseCard title={t("todayTotalSales") || "Global Today Sales"} value={`$${dashboard.todayTotalSales || 0}`} icon={Activity} />
      <BaseCard title={t("totalLiability") || "Global Liability (Due)"} value={`$${dashboard.totalLiability || 0}`} icon={AlertCircle} />
      <BaseCard title={t("activeShops") || "Active Shops"} value={dashboard.activeShops || 0} icon={Store} subtitle={`Out of ${dashboard.totalShops} total`} />
    </div>
  );
};

// NEW: The exact Shop Status Panel you requested
export const ShopStatusPanel = ({ closing, staff, dues, shopName }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const isPending = !closing?.isClosedToday;

  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 mb-6">
      <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 text-neutral-800 dark:text-neutral-200">
        {shopName} {t("shopStatus") || "Shop Status"}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* Daily Closing */}
        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Clock size={12}/> {t("dailyClosing") || "Daily Closing"}</span>
          <span className={`text-sm font-black uppercase tracking-widest flex items-center gap-1 ${isPending ? 'text-orange-500' : 'text-green-500'}`}>
            {isPending ? <X size={14} /> : <Check size={14} />}
            {isPending ? (t("pending") || "Pending") : (t("closed") || "Closed")}
          </span>
        </div>

        {/* Staff Active */}
        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Users size={12}/> {t("staffActive") || "Staff Active"}</span>
          <span className="text-xl font-black text-black dark:text-white">{staff?.totalStaff || 0}</span>
        </div>

        {/* Pending Dues */}
        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><AlertCircle size={12}/> {t("pendingDues") || "Pending Dues"}</span>
          <span className="text-xl font-black text-red-500">${dues?.liabilityToAdmin || 0}</span>
        </div>

        {/* Stock Alerts (Fallback to 0 until backend adds this aggregation) */}
        <div className={`flex flex-col gap-2 ${isArabic ? 'md:pl-6 md:border-l' : 'md:pr-6 md:border-r'}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><Box size={12}/> {t("stockAlerts") || "Stock Alerts"}</span>
          <span className="text-xl font-black text-orange-500">0</span>
        </div>

        {/* Returns (Fallback to 0 until backend adds this aggregation) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5"><RotateCcw size={12}/> {t("returns") || "Returns"}</span>
          <span className="text-xl font-black text-black dark:text-white">0</span>
        </div>

      </div>
    </div>
  );
};