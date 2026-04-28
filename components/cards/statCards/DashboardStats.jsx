"use client";
import { BaseCard } from "../BaseCard";
import { Users, Store, Box, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardStats = ({ stats }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard 
        title={t("totalSystemUsers") || "Total System Users"} 
        value={stats?.users?.total || 0} 
        icon={Users} 
        subtitle={`${stats?.users?.active || 0} ${t("active") || "Active"}`} 
      />
      <BaseCard 
        title={t("totalShops") || "Total Shops"} 
        value={stats?.shops?.total || 0} 
        icon={Store} 
        subtitle={`${stats?.shops?.active || 0} ${t("active") || "Active"}`} 
      />
      <BaseCard 
        title={t("totalProducts") || "Total Products"} 
        value={stats?.products?.total || 0} 
        icon={Box} 
      />
      <BaseCard 
        title={t("todaySales") || "Today's Sales"} 
        value={`${stats?.sales?.today || 0} SAR`} 
        icon={Activity} 
        subtitle={`MTD: ${stats?.sales?.thisMonth || 0} SAR`}
      />
    </div>
  );
};