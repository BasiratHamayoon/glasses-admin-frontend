"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { Check, X, TrendingUp } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

export const MonitoringClosingTable = ({ closingStatus }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("shop"),
      render: (row) => (
        <span className="text-[11px] font-bold text-black dark:text-white">
          {row.shop?.name || "-"}
        </span>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`flex items-center gap-1 text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded-sm w-fit ${
            row.isClosedToday
              ? "bg-green-500/10 text-green-500"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {row.isClosedToday ? <Check size={11} /> : <X size={11} />}
          {row.isClosedToday ? t("closed") : t("pending")}
        </span>
      ),
    },
    {
      header: t("currentBalance"),
      render: (row) => (
        <span className="font-black text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.currentBalance)}
        </span>
      ),
    },
    {
      header: t("todaySales"),
      render: (row) => (
        <span className="font-bold text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.todaySales)}
        </span>
      ),
    },
    {
      header: t("lastClosing"),
      render: (row) => (
        <span className="text-[10px] text-neutral-500 font-bold">
          {row.lastClosingDate
            ? new Date(row.lastClosingDate).toLocaleDateString()
            : t("never")}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] rounded-sm flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("dailyClosingStatus")}
        </h3>
        <div className="flex gap-3">
          <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-sm">
            {closingStatus?.closedCount || 0} {t("closed")}
          </span>
          <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-sm">
            {closingStatus?.pendingCount || 0} {t("pending")}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <BaseTable columns={columns} data={closingStatus?.status || []} />
      </div>
    </div>
  );
};

export const MonitoringPerfTable = ({ performance }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("shop"),
      render: (row) => (
        <div>
          <div className="text-[11px] font-bold text-black dark:text-white">{row.shopName}</div>
          <div className="text-[9px] text-neutral-400 uppercase">{row.shopCode}</div>
        </div>
      ),
    },
    {
      header: t("totalSales"),
      render: (row) => (
        <span className="font-black text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalSales)}
        </span>
      ),
    },
    {
      header: t("transactions"),
      render: (row) => (
        <span className="font-black text-black dark:text-white">
          {row.transactionCount || 0}
        </span>
      ),
    },
    {
      header: t("avgTransaction"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.avgTransactionValue)}
        </span>
      ),
    },
    {
      header: t("rank"),
      render: (_, idx) => (
        <span
          className={`text-[10px] font-black w-7 h-7 rounded-sm flex items-center justify-center border ${
            idx === 0
              ? "bg-[#E9B10C]/10 text-[#E9B10C] border-[#E9B10C]/30"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700"
          }`}
        >
          {idx + 1}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] rounded-sm flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        <TrendingUp size={14} className="text-[#E9B10C]" />
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("shopPerformance")}
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        <BaseTable columns={columns} data={performance || []} />
      </div>
    </div>
  );
};

export const PendingClosingsList = ({
  closingStatus,
  onApprove,
  onReject,
  onCreateClosing,
}) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const pendingList = closingStatus?.status?.filter((s) => !s.isClosedToday) || [];

  return (
    <div className="bg-white dark:bg-[#111111] rounded-sm flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("pendingClosings")} ({pendingList.length})
        </h3>
        {pendingList.length > 0 && onCreateClosing && (
          <button
            onClick={() => onCreateClosing(null)}
            className="text-[9px] uppercase font-black tracking-widest text-[#E9B10C] hover:underline"
          >
            + {t("createClosing")}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pendingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
              <Check size={24} className="text-green-500" strokeWidth={3} />
            </div>
            <h4 className="text-[11px] uppercase font-black tracking-widest text-black dark:text-white mb-1">
              {t("allCaughtUp")}
            </h4>
            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest text-center">
              {t("noPendingClosings")}
            </p>
          </div>
        ) : (
          pendingList.map((entry, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a] gap-3 hover:border-[#E9B10C] transition-colors"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-[12px] text-black dark:text-white truncate">
                  {entry.shop?.name || "-"}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] text-neutral-500 font-bold flex items-center gap-1">
                    {t("balance")}: ⃁ {formatNum(entry.currentBalance)}
                  </span>
                  <span className="text-[9px] text-green-500 font-bold flex items-center gap-1">
                    {t("sales")}: ⃁ {formatNum(entry.todaySales)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onApprove && (
                  <button
                    onClick={() => onApprove(entry.shop?._id)}
                    className="px-3 py-1.5 flex items-center gap-1 text-[9px] uppercase font-black bg-black dark:bg-white text-white dark:text-black rounded-sm hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <Check size={11} strokeWidth={3} /> {t("approve")}
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(entry.shop?._id)}
                    className="px-3 py-1.5 flex items-center gap-1 text-[9px] uppercase font-black border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                  >
                    <X size={11} strokeWidth={3} /> {t("reject")}
                  </button>
                )}
                {onCreateClosing && (
                  <button
                    onClick={() => onCreateClosing(entry.shop)}
                    className="px-3 py-1.5 text-[9px] uppercase font-black border border-[#E9B10C]/50 text-[#E9B10C] rounded-sm hover:bg-[#E9B10C]/10 transition-colors"
                  >
                    {t("create")}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};