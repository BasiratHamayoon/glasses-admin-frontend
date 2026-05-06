"use client";
import { BaseCard } from "../BaseCard";
import { Box, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formatCompact = (num) => {
  const n = Number(num) || 0;
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

export const InventoryStats = ({ stockValuation, webSummary }) => {
  const { t } = useLanguage();

  const totalProducts = stockValuation?.totals?.totalProducts || 0;
  const totalQuantity = stockValuation?.totals?.totalQuantity || 0;
  const totalCostValue = stockValuation?.totals?.totalCostValue || 0;
  const totalRetailValue = stockValuation?.totals?.totalRetailValue || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard
        title={t("totalProductsInStock")}
        value={String(totalProducts)}
        icon={Box}
      />
      <BaseCard
        title={t("totalStockQuantity")}
        value={formatCompact(totalQuantity)}
        icon={AlertTriangle}
      />
      <BaseCard
        title={t("totalCostValue")}
        value={`⃁ ${formatCompact(totalCostValue)}`}
        icon={DollarSign}
      />
      <BaseCard
        title={t("totalRetailValue")}
        value={`⃁ ${formatCompact(totalRetailValue)}`}
        icon={TrendingUp}
      />
    </div>
  );
};