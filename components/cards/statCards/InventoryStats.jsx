"use client";
import { BaseCard } from "../BaseCard";
import { Box, AlertTriangle, CheckCircle, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const InventoryStats = ({ summary }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard 
        title={t("totalProducts") || "Total Products In Stock"} 
        value={summary?.totalProducts || 0} 
        icon={Box} 
      />
      <BaseCard 
        title={t("inStock") || "Healthy Stock"} 
        value={summary?.inStockCount || 0} 
        icon={CheckCircle} 
      />
      <BaseCard 
        title={t("lowStock") || "Low Stock Alerts"} 
        value={summary?.lowStockCount || 0} 
        icon={AlertTriangle} 
      />
      <BaseCard 
        title={t("outOfStock") || "Out of Stock"} 
        value={summary?.outOfStockCount || 0} 
        icon={Tag} 
      />
    </div>
  );
};