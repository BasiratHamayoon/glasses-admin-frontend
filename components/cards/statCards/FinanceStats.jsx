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
        value={`SAR ${summary?.totalRevenue?.toLocaleString() || 0}`} 
        icon={DollarSign} 
      />
      <BaseCard 
        title={t("totalExpenses") || "Total Expenses"} 
        value={`SAR ${summary?.totalExpenses?.toLocaleString() || 0}`} 
        icon={AlertCircle} 
      />
      <BaseCard 
        title={t("grossProfit") || "Gross Profit"} 
        value={`SAR ${summary?.grossProfit?.toLocaleString() || 0}`} 
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