"use client";
import { BaseCard } from "../BaseCard";
import { ClipboardList, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

export const ClosingStats = ({ stats }) => {
  const { t } = useLanguage();

  const totalClosings = stats?.totalClosings || 0;
  const totalSales = stats?.totalSales || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const totalVariance = stats?.totalVariance || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard
        title={t("totalClosings") || "Total Closings"}
        value={String(totalClosings)}
        icon={ClipboardList}
      />
      <BaseCard
        title={t("totalSales") || "Total Sales"}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(totalSales)}
          </span>
        }
        icon={TrendingUp}
      />
      <BaseCard
        title={t("totalExpenses") || "Total Expenses"}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(totalExpenses)}
          </span>
        }
        icon={TrendingDown}
      />
      <BaseCard
        title={t("totalVariance") || "Total Variance"}
        value={
          <span className="flex items-center gap-1">
            ⃁ {formatNum(totalVariance)}
          </span>
        }
        icon={AlertTriangle}
      />
    </div>
  );
};