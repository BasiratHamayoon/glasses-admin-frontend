"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const WebStockTable = ({ stocks, loading }) => {
  const { t } = useLanguage();
  const columns = [
    { header: t("product") || "Product", render: (row) => <span className="font-bold">{row.product?.name || '-'}</span> },
    { header: "SKU", render: (row) => <span className="text-[10px] text-neutral-500">{row.product?.sku || '-'}</span> },
    { header: t("webPrice") || "Web Price", render: (row) => <span className="text-[#E9B10C] font-bold">${row.websitePrice}</span> },
    { header: t("available") || "Available", render: (row) => <span className="font-black">{row.availableQuantity}</span> },
    { header: t("visibility") || "Visibility", render: (row) => (
      <span className={`px-2 py-1 text-[9px] uppercase font-black rounded-sm ${row.isVisible ? 'bg-green-500/10 text-green-500' : 'bg-neutral-500/10 text-neutral-500'}`}>{row.isVisible ? 'Visible' : 'Hidden'}</span>
    )},
  ];
  return <BaseTable columns={columns} data={stocks} loading={loading} />;
};