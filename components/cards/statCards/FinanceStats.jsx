"use client";
import { BaseCard } from "../BaseCard";
import { DollarSign, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const FinanceStats = ({ summary }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard
        title={t("totalRevenue") || "Total Revenue"}
        value={<span className="flex items-center gap-1">⃁ {summary?.totalRevenue?.toLocaleString() || 0}</span>}
        icon={DollarSign}
      />
      <BaseCard
        title={t("totalExpenses") || "Total Expenses"}
        value={<span className="flex items-center gap-1">⃁ {summary?.totalExpenses?.toLocaleString() || 0}</span>}
        icon={AlertCircle}
      />
      <BaseCard
        title={t("grossProfit") || "Gross Profit"}
        value={<span className="flex items-center gap-1">⃁ {summary?.grossProfit?.toLocaleString() || 0}</span>}
        icon={TrendingUp}
      />
      <BaseCard
        title={t("totalOrders") || "Total Orders"}
        value={String(summary?.totalOrders || 0)}
        icon={FileText}
      />
    </div>
  );
};