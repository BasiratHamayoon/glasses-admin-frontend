"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { Trophy } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

export const SalesLeaderboardTable = ({ data, loading }) => {
  const { t } = useLanguage();

  const leaderboard = data?.leaderboard || [];

  const columns = [
    {
      header: t("rank"),
      render: (row) => (
        <span
          className={`text-[10px] font-black w-7 h-7 rounded-sm flex items-center justify-center border ${
            row.rank === 1
              ? "bg-[#E9B10C]/10 text-[#E9B10C] border-[#E9B10C]/30"
              : row.rank === 2
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
              : "border-transparent text-neutral-400"
          }`}
        >
          {String(row.rank)}
        </span>
      ),
    },
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
      header: t("totalRevenue"),
      render: (row) => (
        <span className="font-black text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.metrics?.totalRevenue)}
        </span>
      ),
    },
    {
      header: t("totalOrders"),
      render: (row) => (
        <span className="font-black text-black dark:text-white">
          {formatNum(row.metrics?.totalOrders)}
        </span>
      ),
    },
    {
      header: t("avgOrderValue"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.metrics?.avgOrderValue)}
        </span>
      ),
    },
    {
      header: t("completionRate"),
      render: (row) => (
        <span
          className={`text-[10px] font-black ${
            (row.metrics?.completionRate || 0) >= 80
              ? "text-green-500"
              : (row.metrics?.completionRate || 0) >= 50
              ? "text-amber-500"
              : "text-red-500"
          }`}
        >
          {row.metrics?.completionRate || 0}%
        </span>
      ),
    },
    {
      header: t("uniqueCustomers"),
      render: (row) => (
        <span className="font-bold text-blue-500">
          {formatNum(row.metrics?.uniqueCustomers)}
        </span>
      ),
    },
    {
      header: t("totalItemsSold"),
      render: (row) => (
        <span className="font-bold text-neutral-500">
          {formatNum(row.metrics?.totalItemsSold)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={14} className="text-[#E9B10C]" />
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("shopLeaderboard")}
        </h3>
      </div>
      <BaseTable columns={columns} data={leaderboard} loading={loading} />
    </div>
  );
};