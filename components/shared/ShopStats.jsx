"use client";
import { BaseCard } from "@/components/cards/BaseCard";
import { Store, Building2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ShopStats = ({ shops }) => {
  const { t } = useLanguage();
  const activeShops = shops?.filter(s => s.status === 'ACTIVE').length || 0;
  const retailShops = shops?.filter(s => s.shopType === 'RETAIL').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard title={t("totalShops") || "Total Shops"} value={shops?.length || 0} icon={Store} />
      <BaseCard title={t("activeShops") || "Active Shops"} value={activeShops} icon={CheckCircle2} />
      <BaseCard title={t("retailOutlets") || "Retail Outlets"} value={retailShops} icon={Building2} />
    </div>
  );
};