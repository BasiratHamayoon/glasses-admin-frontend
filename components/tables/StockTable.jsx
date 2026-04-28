"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Eye } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export const StockTable = ({ data, loading, onView, onEdit, isWebsite = false }) => {
  const { t } = useLanguage();

  const columns = [
    { 
      header: t("product") || "Product", 
      render: (row) => {
        const primaryImg = row.product?.images?.find(img => img.isPrimary)?.url || row.product?.images?.[0]?.url;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
               <SafeImage src={primaryImg} alt={row.product?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold truncate max-w-[150px]">{row.product?.name}</span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">{row.product?.sku}</span>
            </div>
          </div>
        );
      } 
    },
    ...(!isWebsite ? [{ header: t("shop") || "Shop", render: (row) => <span className="text-[10px] font-bold">{row.shop?.name || '-'}</span> }] : []),
    { 
      header: t("price") || "Price", 
      render: (row) => <span className="font-bold text-[#E9B10C]">SAR {isWebsite ? row.websitePrice : row.sellingPrice}</span> 
    },
    { header: t("availableQty") || "Available", render: (row) => <span className="font-black">{row.availableQuantity || 0}</span> },
    { header: t("status") || "Status", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${row.status === 'IN_STOCK' ? 'bg-green-500/10 text-green-500' : row.status === 'LOW_STOCK' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.status?.replace('_', ' ')}
      </span>
    )},
    { 
      header: t("actions") || "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors hover:text-blue-500"><Eye size={14} /></button>
          <button onClick={() => onEdit(row)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors"><Edit2 size={14} /></button>
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};