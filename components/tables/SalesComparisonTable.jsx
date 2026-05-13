"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { BarChart2 } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

export const SalesComparisonTable = ({ data, loading }) => {
  const { t } = useLanguage();

  const tableData = data?.table || [];

  const columns = [
    {
      header: t("rank"),
      render: (row) => (
        <span className="text-[10px] font-black text-neutral-400">
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
          ⃁ {formatNum(row.totalRevenue)}
        </span>
      ),
    },
    {
      header: t("totalPaid"),
      render: (row) => (
        <span className="font-bold text-blue-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalPaid)}
        </span>
      ),
    },
    {
      header: t("totalDue"),
      render: (row) => (
        <span
          className={`font-bold flex items-center gap-1 ${
            row.totalDue > 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          ⃁ {formatNum(row.totalDue)}
        </span>
      ),
    },
    {
      header: t("totalOrders"),
      render: (row) => (
        <span className="font-black text-black dark:text-white">
          {formatNum(row.totalOrders)}
        </span>
      ),
    },
    {
      header: t("completionRate"),
      render: (row) => (
        <span
          className={`text-[10px] font-black ${
            row.completionRate >= 80
              ? "text-green-500"
              : row.completionRate >= 50
              ? "text-amber-500"
              : "text-red-500"
          }`}
        >
          {row.completionRate}%
        </span>
      ),
    },
    {
      header: t("collectionRate"),
      render: (row) => (
        <span className="text-[10px] font-black text-[#E9B10C]">
          {row.collectionRate}%
        </span>
      ),
    },
    {
      header: t("revenueShare"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E9B10C] rounded-full"
              style={{ width: `${Math.min(row.revenueShare || 0, 100)}%` }}
            />
          </div>
          <span className="text-[9px] font-black text-neutral-500">
            {row.revenueShare}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={14} className="text-[#E9B10C]" />
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("shopComparison")}
        </h3>
      </div>
      <BaseTable columns={columns} data={tableData} loading={loading} />
    </div>
  );
};