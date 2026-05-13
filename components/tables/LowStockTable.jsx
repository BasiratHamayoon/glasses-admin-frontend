"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const LowStockTable = ({ alerts, loading }) => {
  const { t } = useLanguage();
  
  const columns = [
    { header: t("product") || "Product", render: (row) => <span className="font-bold">{row.product?.name || '-'}</span> },
    { header: t("shop") || "Shop", render: (row) => <span className="text-neutral-500">{row.shop?.name || '-'}</span> },
    { header: t("quantity") || "Qty", render: (row) => <span className="font-black text-lg text-red-500">{row.quantity}</span> },
    { header: t("minLevel") || "Min Level", render: (row) => <span className="text-neutral-500">{row.minStockLevel}</span> },
    { header: t("status") || "Status", render: (row) => (
      <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${row.status === 'OUT_OF_STOCK' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
        {row.status?.replace('_', ' ')}
      </span>
    )},
  ];

  return <BaseTable columns={columns} data={alerts} loading={loading} />;
};