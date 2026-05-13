"use client";

import { BaseCard } from "../BaseCard";
import {
  Activity,
  AlertCircle,
  Store,
  Check,
  X,
  Clock,
  Users,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formatNum = (value) => {
  const num = Number(value);
  return isNaN(num) ? "0" : num.toLocaleString();
};

const getText = (t, key, fallback) => {
  const value = t?.(key);
  return !value || value === key ? fallback : value;
};

export const MonitorStats = ({ dashboard }) => {
  const { t } = useLanguage();

  const totalShops = Number(dashboard?.totalShops) || 0;
  const activeShops = Number(dashboard?.activeShops) || 0;
  const todayTotalSales = Number(dashboard?.todayTotalSales) || 0;
  const todayOrderCount = Number(dashboard?.todayOrderCount) || 0;
  const totalCashCollectedToday =
    Number(dashboard?.totalCashCollectedToday) || 0;
  const totalLiability = Number(dashboard?.totalLiability) || 0;
  const todayClosings = Number(dashboard?.todayClosings) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard
        title={getText(t, "totalCashCollectedToday", "Cash Collected Today")}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(totalCashCollectedToday)}
          </span>
        }
        icon={Wallet}
        subtitle={`${todayClosings} ${getText(t, "todayClosings", "closings today")}`}
      />

      <BaseCard
        title={getText(t, "todayTotalSales", "Today's Sales")}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(todayTotalSales)}
          </span>
        }
        icon={Activity}
        subtitle={`${todayOrderCount} ${getText(t, "orders", "orders")}`}
      />

      <BaseCard
        title={getText(t, "totalLiability", "Total Liability")}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(totalLiability)}
          </span>
        }
        icon={AlertCircle}
      />

      <BaseCard
        title={getText(t, "activeShops", "Active Shops")}
        value={String(activeShops)}
        icon={Store}
        subtitle={`${getText(t, "outOf", "out of")} ${totalShops} ${getText(
          t,
          "total",
          "total"
        )}`}
      />
    </div>
  );
};

export const ShopStatusPanel = ({
  closing, // { shop, closingId, isClosedToday, totalSales, amountPaidToAdmin, outstandingAfter, ... }
  staff,   // { totalStaff, managers, cashiers, salesStaff }
  dues,    // { outstandingAfterPayment, closingDate, closingNumber }
  shopName,
  onApproveClosing,
  onRejectClosing,
  onCreateClosing,
}) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const tx = (key, fallback) => {
    const value = t?.(key);
    return !value || value === key ? fallback : value;
  };

  const isClosedToday = !!closing?.isClosedToday;
  const needsApproval = isClosedToday && closing?.closingStatus === "SUBMITTED";
  const isPending = !isClosedToday;

  const outstandingDues = Number(dues?.outstandingAfterPayment) || 0;
  const amountPaidToAdmin = Number(closing?.amountPaidToAdmin) || 0;
  const todaySales = Number(closing?.totalSales) || 0;

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-[#E9B10C]">
          {shopName} — {tx("statusOverview", "Status Overview")}
        </h3>

        <div className="flex gap-2 flex-wrap">
          {needsApproval && onApproveClosing && closing?.closingId && (
            <button
              onClick={() => onApproveClosing(closing.closingId)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-green-500/20 transition-colors"
            >
              <Check size={12} /> {tx("approveClosing", "Approve Closing")}
            </button>
          )}

          {needsApproval && onRejectClosing && closing?.closingId && (
            <button
              onClick={() =>
                onRejectClosing(closing.closingId, "Rejected by admin")
              }
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500/10 text-red-500 text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-red-500/20 transition-colors"
            >
              <X size={12} /> {tx("reject", "Reject")}
            </button>
          )}

          {isPending && onCreateClosing && (
            <button
              onClick={onCreateClosing}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E9B10C]/10 text-[#E9B10C] text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-[#E9B10C]/20 transition-colors"
            >
              {tx("createClosing", "Create Closing")}
            </button>
          )}
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Daily Closing Status */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <Clock size={11} /> {tx("dailyClosing", "Daily Closing")}
          </span>
          <span
            className={`text-[11px] font-black uppercase flex items-center gap-1 ${
              isClosedToday
                ? needsApproval
                  ? "text-amber-500"
                  : "text-green-500"
                : "text-orange-500"
            }`}
          >
            {isClosedToday ? <Check size={13} /> : <X size={13} />}
            {isPending
              ? tx("pending", "Pending")
              : needsApproval
              ? tx("submitted", "Submitted")
              : closing?.closingStatus || tx("closed", "Closed")}
          </span>
          {closing?.closingNumber && (
            <span className="text-[9px] text-neutral-400 truncate">
              {closing.closingNumber}
            </span>
          )}
        </div>

        {/* Staff */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <Users size={11} /> {tx("staffActive", "Staff Active")}
          </span>
          <span className="text-xl font-black text-black dark:text-white">
            {Number(staff?.totalStaff) || 0}
          </span>
          <span className="text-[9px] text-neutral-400">
            {staff?.managers || 0} {tx("managers", "Managers")}
          </span>
        </div>

        {/* Pending Dues */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1.5">
            <AlertCircle size={11} /> {tx("pendingDues", "Pending Dues")}
          </span>
          <span className="text-xl font-black text-red-500 flex items-center gap-1">
            ⃁ {formatNum(outstandingDues)}
          </span>
        </div>

        {/* Paid To Admin */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {tx("paidToAdmin", "Paid To Admin")}
          </span>
          <span className="text-xl font-black text-[#E9B10C] flex items-center gap-1">
            ⃁ {formatNum(amountPaidToAdmin)}
          </span>
        </div>

        {/* Today's Sales */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {tx("todaySales", "Today's Sales")}
          </span>
          <span className="text-xl font-black text-green-500 flex items-center gap-1">
            ⃁ {formatNum(todaySales)}
          </span>
        </div>

        {/* Variance */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {tx("variance", "Variance")}
          </span>
          {closing?.hasVariance ? (
            <>
              <span
                className={`text-xl font-black flex items-center gap-1 ${
                  closing.varianceType === "SHORTAGE"
                    ? "text-red-500"
                    : "text-amber-500"
                }`}
              >
                ⃁ {formatNum(closing.varianceAmount)}
              </span>
              <span
                className={`text-[9px] font-black uppercase ${
                  closing.varianceType === "SHORTAGE"
                    ? "text-red-400"
                    : "text-amber-400"
                }`}
              >
                {closing.varianceType}
              </span>
            </>
          ) : (
            <span className="text-xl font-black text-green-500">
              {tx("none", "None")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};