"use client";
import { BaseCard } from "../BaseCard";
import { Users, UserPlus, CreditCard, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CustomerStats = ({ stats }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard title={t("totalCustomers") || "Total Customers"} value={stats?.totalCustomers || 0} icon={Users} />
      <BaseCard title={t("newThisMonth") || "New This Month"} value={stats?.newThisMonth || 0} icon={UserPlus} />
      <BaseCard title={t("totalCredit") || "Total Store Credit"} value={`${stats?.totalCredit?.toLocaleString() || 0} SAR`} icon={CreditCard} />
      <BaseCard title={t("activeVIPs") || "VIP / Platinum Members"} value={stats?.platinumCount || 0} icon={Award} />
    </div>
  );
};