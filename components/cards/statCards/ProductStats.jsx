"use client";
import { BaseCard } from "@/components/cards/BaseCard";
import { Package, Tags, Percent } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProductStats = ({ products, categories }) => {
  const { t } = useLanguage();
  const activeCategoriesCount = categories?.filter(c => c.isActive).length || 0;
  const totalValue = products?.reduce((acc, curr) => acc + (curr.sellingPrice || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard title={t("totalProducts")} value={products?.length || 0} icon={Package} />
      <BaseCard title={t("activeCategories")} value={activeCategoriesCount} icon={Tags} />
      <BaseCard title={t("totalValue")} value={`SAR ${totalValue.toFixed(2)}`} icon={Percent} />
    </div>
  );
};