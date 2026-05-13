"use client";
import { BaseCard } from "@/components/cards/BaseCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layers, CheckCircle, XCircle } from "lucide-react";

export const LookupStats = ({ items = [], label }) => {
  const { t } = useLanguage();
  const active = items.filter((i) => i.isActive).length;
  const inactive = items.filter((i) => !i.isActive).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard title={`${t("total")} ${label}`} value={items.length} icon={Layers} />
      <BaseCard title={t("active")} value={active} icon={CheckCircle} />
      <BaseCard title={t("inactive")} value={inactive} icon={XCircle} />
    </div>
  );
};