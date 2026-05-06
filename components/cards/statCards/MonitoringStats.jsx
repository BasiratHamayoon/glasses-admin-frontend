"use client";
import { BaseCard } from "../BaseCard";
import { Activity, AlertCircle, Store, Check, X, Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formatNum = (value) => {
  const num = Number(value);
  return isNaN(num) ? "0" : num.toLocaleString();
};

export const MonitorStats = ({ dashboard }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard
        title={t("totalCashInHand")}
        value={<span className="flex items-center gap-1">⃁ {formatNum(dashboard?.totalCashInHand)}</span>}
        icon={Activity}
      />
      <BaseCard
        title={t("todayTotalSales")}
        value={<span className="flex items-center gap-1">⃁ {formatNum(dashboard?.todayTotalSales)}</span>}
        icon={Activity}
      />
      <BaseCard
        title={t("totalLiability")}
        value={<span className="flex items-center gap-1">⃁ {formatNum(dashboard?.totalLiability)}</span>}
        icon={AlertCircle}
      />
      <BaseCard
        title={t("activeShops")}
        value={String(Number(dashboard?.activeShops) || 0)}
        icon={Store}
        subtitle={`${t("outOf")} ${Number(dashboard?.totalShops) || 0} ${t("total")}`}
      />
    </div>
  );
};

export const ShopStatusPanel = ({
  closing,
  staff,
  dues,
  shopName,
  onApproveClosing,
  onRejectClosing,
  onCreateClosing,
}) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const isPending = !closing?.isClosedToday;
  const pendingDuesAmount = Number(dues?.liabilityToAdmin) || 0;
  const currentBalance = Number(closing?.currentBalance) || 0;
  const todaySales = Number(closing?.todaySales) || 0;

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-[#E9B10C]">
          {shopName} — {t("statusOverview")}
        </h3>
        {isPending && (
          <div className="flex gap-2">
            {onApproveClosing && closing?.shop?._id && (
              <button
                onClick={() => onApproveClosing(closing._id)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-green-500/20 transition-colors"
              >
                <Check size={12} /> {t("approveClosing")}
              </button>
            )}
            {onCreateClosing && (
              <button
                onClick={onCreateClosing}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E9B10C]/10 text-[#E9B10C] text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-[#E9B10C]/20 transition-colors"
              >
                {t("createClosing")}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" dir={isArabic ? "rtl" : "ltr"}>
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <Clock size={11} /> {t("dailyClosing")}
          </span>
          <span className={`text-[11px] font-black uppercase flex items-center gap-1 ${isPending ? "text-orange-500" : "text-green-500"}`}>
            {isPending ? <X size={13} /> : <Check size={13} />}
            {isPending ? t("pending") : t("closed")}
          </span>
          {closing?.lastClosingDate && (
            <span className="text-[9px] text-neutral-400">
              {new Date(closing.lastClosingDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <Users size={11} /> {t("staffActive")}
          </span>
          <span className="text-xl font-black text-black dark:text-white">
            {Number(staff?.totalStaff) || 0}
          </span>
          <span className="text-[9px] text-neutral-400">
            {staff?.managers || 0} {t("managers")}
          </span>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <AlertCircle size={11} /> {t("pendingDues")}
          </span>
          <span className="text-xl font-black text-red-500 flex items-center gap-1">
            ⃁ {formatNum(pendingDuesAmount)}
          </span>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {t("currentBalance")}
          </span>
          <span className="text-xl font-black text-[#E9B10C] flex items-center gap-1">
            ⃁ {formatNum(currentBalance)}
          </span>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {t("todaySales")}
          </span>
          <span className="text-xl font-black text-green-500 flex items-center gap-1">
            ⃁ {formatNum(todaySales)}
          </span>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {t("lastClosing")}
          </span>
          <span className="text-[11px] font-bold text-black dark:text-white">
            {closing?.lastClosingDate
              ? new Date(closing.lastClosingDate).toLocaleDateString()
              : t("never")}
          </span>
          <span className="text-[9px] text-neutral-400 flex items-center gap-1">
            ⃁ {formatNum(closing?.lastClosingBalance || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};