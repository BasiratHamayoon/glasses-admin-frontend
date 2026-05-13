"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const PricingRuleTable = ({ rules, loading }) => {
  const { t } = useLanguage();

  const columns = [
    { header: t("name"), accessor: "name" },
    { header: t("ruleType"), render: (row) => <span className="text-[9px] uppercase font-bold">{row.ruleType}</span> },
    { header: t("applyTo"), render: (row) => <span className="text-[9px] uppercase">{row.applyTo}</span> },
    { header: t("discount"), render: (row) => (
      <span className="font-black text-[#E9B10C]">
        {row.discountType === 'PERCENTAGE' ? `${row.discountValue}%` : `$${row.discountValue}`}
      </span>
    )},
    { header: t("status"), render: (row) => (
      <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${row.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.isActive ? t("active") : t("inactive")}
      </span>
    )}
  ];

  return <BaseTable columns={columns} data={rules} loading={loading} />;
};