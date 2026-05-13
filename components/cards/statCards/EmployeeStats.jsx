"use client";
import { BaseCard } from "../BaseCard";
import { Users, UserCheck, UserMinus, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmployeeStats = ({ employees }) => {
  const { t } = useLanguage();
  
  const total = employees?.length || 0;
  const active = employees?.filter(e => e.status === 'ACTIVE').length || 0;
  const onLeave = employees?.filter(e => e.status === 'ON_LEAVE').length || 0;
  const salesStaff = employees?.filter(e => e.department === 'SALES').length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard title={t("totalEmployees") || "Total Staff"} value={total} icon={Users} />
      <BaseCard title={t("activeStaff") || "Active"} value={active} icon={UserCheck} />
      <BaseCard title={t("onLeave") || "On Leave"} value={onLeave} icon={UserMinus} />
      <BaseCard title={t("salesStaff") || "Sales Dept"} value={salesStaff} icon={Briefcase} />
    </div>
  );
};