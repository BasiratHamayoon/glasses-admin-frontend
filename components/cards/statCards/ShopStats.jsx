"use client";
import { BaseCard } from "../BaseCard";
import { Store, Building2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ShopStats = ({ shops }) => {
  const { t } = useLanguage();
  
  const shopsArray = Array.isArray(shops) ? shops : [];
  const activeShops = shopsArray.filter(s => s.status === 'ACTIVE').length;
  const retailShops = shopsArray.filter(s => s.shopType === 'RETAIL').length;
  const totalShops = shopsArray.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <BaseCard 
        title={t("totalShops") || "Total Shops"} 
        value={totalShops} 
        icon={Store} 
      />
      <BaseCard 
        title={t("activeShops") || "Active Shops"} 
        value={activeShops} 
        icon={CheckCircle2} 
      />
      <BaseCard 
        title={t("retailOutlets") || "Retail Outlets"} 
        value={retailShops} 
        icon={Building2} 
      />
    </div>
  );
};