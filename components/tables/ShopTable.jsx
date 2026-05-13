"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Trash2 } from "lucide-react";

export const ShopTable = ({ shops, loading, onEdit, onDelete }) => {
  const { t } = useLanguage();

  const columns = [
    { header: t("shopName") || "Shop Name", accessor: "name" },
    { header: t("shopCode") || "Code", accessor: "code" },
    { header: t("city") || "City", render: (row) => <span className="text-[11px] text-neutral-500">{row.address?.city || '-'}</span> },
    { header: t("shopType") || "Type", render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.shopType}</span> },
    { header: t("status"), render: (row) => (
      <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${row.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.status}
      </span>
    )},
    { 
      header: t("actions") || "Actions", 
      render: (row) => (
        <div className="flex gap-3 items-center">
          <button onClick={() => onEdit(row)} className="text-neutral-500 hover:text-[#E9B10C] transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => onDelete(row)} className="text-neutral-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={shops} loading={loading} />;
};