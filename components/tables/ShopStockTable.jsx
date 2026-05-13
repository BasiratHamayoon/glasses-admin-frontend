"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const ShopStockTable = ({ stocks, loading }) => {
  const { t } = useLanguage();
  const columns = [
    { header: t("product") || "Product", render: (row) => <span className="font-bold">{row.product?.name || '-'}</span> },
    { header: "SKU", render: (row) => <span className="text-[10px] text-neutral-500">{row.product?.sku || '-'}</span> },
    { header: t("shop") || "Shop", render: (row) => <span className="text-[11px] font-medium">{row.shop?.name || '-'}</span> },
    { header: t("quantity") || "Qty", render: (row) => <span className="font-black text-lg">{row.quantity}</span> },
    { header: t("price") || "Price", render: (row) => <span className="text-[#E9B10C] font-bold">${row.sellingPrice}</span> },
    { header: t("status") || "Status", render: (row) => {
      const colors = {
        'IN_STOCK': 'bg-green-500/10 text-green-500',
        'LOW_STOCK': 'bg-orange-500/10 text-orange-500',
        'OUT_OF_STOCK': 'bg-red-500/10 text-red-500'
      };
      return <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${colors[row.status] || 'bg-neutral-500/10 text-neutral-500'}`}>{row.status?.replace('_', ' ')}</span>;
    }}
  ];
  return <BaseTable columns={columns} data={stocks} loading={loading} />;
};