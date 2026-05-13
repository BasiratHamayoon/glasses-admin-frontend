// ─── components/tables/MonitoringTables.jsx ───────────────────────────────────
"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable }   from "./BaseTable";
import { Check, X, TrendingUp, Plus } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

// ─── MonitoringClosingTable ────────────────────────────────────────────────────
export const MonitoringClosingTable = ({ closingStatus }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("shop"),
      render: (row) => (
        <div>
          <div className="text-[11px] font-bold text-black dark:text-white">
            {row.shop?.name || "-"}
          </div>
          <div className="text-[9px] text-neutral-400 uppercase">
            {row.shop?.code || ""}
          </div>
        </div>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`flex items-center gap-1 text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded-sm w-fit ${
            row.isClosedToday
              ? row.closingStatus === "APPROVED"
                ? "bg-green-500/10 text-green-500"
                : "bg-amber-500/10 text-amber-500"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {row.isClosedToday ? <Check size={11} /> : <X size={11} />}
          {row.isClosedToday
            ? (row.closingStatus || t("closed"))
            : t("pending")}
        </span>
      ),
    },
    {
      header: t("totalSales"),
      render: (row) => (
        <span className="font-bold text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalSales)}
        </span>
      ),
    },
    {
      header: t("actualCash"),
      render: (row) => (
        <span className="font-black text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.actualCash)}
        </span>
      ),
    },
    {
      header: t("variance"),
      render: (row) =>
        row.hasVariance ? (
          <span
            className={`text-[9px] font-black uppercase ${
              row.varianceType === "SHORTAGE" ? "text-red-500" : "text-amber-500"
            }`}
          >
            {row.varianceType}: ⃁{formatNum(row.varianceAmount)}
          </span>
        ) : (
          <span className="text-[9px] text-green-500 font-black">{t("none")}</span>
        ),
    },
    {
      header: t("amountPaid"),
      render: (row) => (
        <span className="font-bold text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.amountPaidToAdmin)}
        </span>
      ),
    },
    {
      header: t("outstanding"),
      render: (row) => (
        <span
          className={`font-bold flex items-center gap-1 ${
            row.outstandingAfter > 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          ⃁ {formatNum(row.outstandingAfter)}
        </span>
      ),
    },
    {
      header: t("closedBy"),
      render: (row) => (
        <span className="text-[10px] font-bold text-neutral-500">
          {row.closedBy || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] rounded-sm flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center shrink-0">
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

// ─── MonitoringPerfTable ───────────────────────────────────────────────────────
export const MonitoringPerfTable = ({ performance }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("shop"),
      render: (row) => (
        <div>
          <div className="text-[11px] font-bold text-black dark:text-white">
            {row.shopName}
          </div>
          <div className="text-[9px] text-neutral-400 uppercase">
            {row.shopCode}
          </div>
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
          {formatNum(row.totalOrders || 0)}
        </span>
      ),
    },
    {
      header: t("avgTransaction"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(Math.round(row.avgTransactionValue || 0))}
        </span>
      ),
    },
    // ✅ Was: totalCashCollected → Now: totalCashPaidToAdmin
    {
      header: t("paidToAdmin"),
      render: (row) => (
        <span className="font-bold text-blue-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalCashPaidToAdmin || 0)}
        </span>
      ),
    },
    // ✅ NEW: show outstanding (what shop still owes)
    {
      header: t("outstanding"),
      render: (row) => (
        <span
          className={`font-bold flex items-center gap-1 ${
            (row.latestOutstanding || 0) > 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          ⃁ {formatNum(row.latestOutstanding || 0)}
        </span>
      ),
    },
    {
      header: t("closings"),
      render: (row) => (
        <span className="font-black text-neutral-500">
          {row.closingCount || 0}
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
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shrink-0">
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

// ─── PendingClosingsList ───────────────────────────────────────────────────────
// ✅ Uses entry.closingId (now returned by backend) — no extra API call needed
export const PendingClosingsList = ({
  closingStatus,
  onApprove,
  onReject,
  onCreateClosing,
}) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const allStatus = closingStatus?.status || [];

  // Shops that haven't submitted a closing at all
  const notClosedList = allStatus.filter((s) => !s.isClosedToday);

  // Shops that submitted but need admin approval
  const submittedList = allStatus.filter(
    (s) => s.isClosedToday && s.closingStatus === "SUBMITTED"
  );

  return (
    <div className="bg-white dark:bg-[#111111] rounded-sm flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center shrink-0">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("pendingClosings")} ({notClosedList.length + submittedList.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* ── Submitted — needs approval ───────────────────────────────── */}
        {submittedList.length > 0 && (
          <div className="space-y-2">
            <p className="text-[8px] uppercase tracking-widest font-black text-amber-500 px-1">
              {t("awaitingApproval")} ({submittedList.length})
            </p>
            {submittedList.map((entry, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-amber-200 dark:border-amber-900/30 rounded-sm bg-amber-50/50 dark:bg-amber-900/10 gap-3 hover:border-amber-400 transition-colors"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-[12px] text-black dark:text-white truncate">
                    {entry.shop?.name || "-"}
                  </span>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[9px] text-amber-500 font-black uppercase tracking-wider">
                      {t("submitted")} • {entry.closingNumber}
                    </span>
                    <span className="text-[9px] text-green-500 font-bold flex items-center gap-1">
                      {t("sales")}: ⃁ {formatNum(entry.totalSales)}
                    </span>
                    {entry.hasVariance && (
                      <span
                        className={`text-[9px] font-black uppercase ${
                          entry.varianceType === "SHORTAGE"
                            ? "text-red-500"
                            : "text-amber-600"
                        }`}
                      >
                        {entry.varianceType}: ⃁{formatNum(entry.varianceAmount)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* ✅ Use entry.closingId directly — no extra fetch */}
                  <button
                    onClick={() => entry.closingId && onApprove(entry.closingId)}
                    disabled={!entry.closingId}
                    className="px-3 py-1.5 flex items-center gap-1 text-[9px] uppercase font-black bg-green-500/10 text-green-500 rounded-sm hover:bg-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check size={11} strokeWidth={3} />
                    {t("approve")}
                  </button>
                  <button
                    onClick={() =>
                      entry.closingId &&
                      onReject(entry.closingId, "Rejected by admin")
                    }
                    disabled={!entry.closingId}
                    className="px-3 py-1.5 flex items-center gap-1 text-[9px] uppercase font-black border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <X size={11} strokeWidth={3} />
                    {t("reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Not closed yet ──────────────────────────────────────────── */}
        {notClosedList.length > 0 && (
          <div className="space-y-2">
            {submittedList.length > 0 && (
              <p className="text-[8px] uppercase tracking-widest font-black text-orange-500 px-1 pt-2">
                {t("notClosedYet")} ({notClosedList.length})
              </p>
            )}
            {notClosedList.map((entry, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a] gap-3 hover:border-[#E9B10C] transition-colors"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-[12px] text-black dark:text-white truncate">
                    {entry.shop?.name || "-"}
                  </span>
                  <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">
                    {t("notClosedYet")}
                  </span>
                </div>

                {onCreateClosing && (
                  <button
                    onClick={() => onCreateClosing(entry.shop)}
                    className="px-3 py-1.5 flex items-center gap-1 text-[9px] uppercase font-black border border-[#E9B10C]/50 text-[#E9B10C] rounded-sm hover:bg-[#E9B10C]/10 transition-colors shrink-0"
                  >
                    <Plus size={11} strokeWidth={3} />
                    {t("createClosing")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── All done ──────────────────────────────────────────────── */}
        {notClosedList.length === 0 && submittedList.length === 0 && (
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
        )}
      </div>
    </div>
  );
};