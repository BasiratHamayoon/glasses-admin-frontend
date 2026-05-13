"use client";
import { BaseCard } from "../BaseCard";
import { DollarSign, Users, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const SalaryStats = ({ totals }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <BaseCard 
        title={t("totalEmployeesProcessed") || "Total Employees Processed"} 
        value={totals?.count || 0} 
        icon={Users} 
      />
      <BaseCard 
        title={t("totalGrossPayout") || "Total Gross Payout"} 
        value={`$${totals?.totalGross?.toLocaleString() || 0}`} 
        icon={Briefcase} 
      />
      <BaseCard 
        title={t("totalNetPayout") || "Total Net Payout"} 
        value={`$${totals?.totalNet?.toLocaleString() || 0}`} 
        icon={DollarSign} 
      />
    </div>
  );
};