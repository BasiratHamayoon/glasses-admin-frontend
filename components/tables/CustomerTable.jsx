"use client";
import { BaseTable } from "./BaseTable";
import { Eye, Edit2, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CustomerTable = ({ data, loading, onView, onEdit, onAddPrescription }) => {
  const { t } = useLanguage();

  const columns = [
    { 
      header: t("customer") || "Customer", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-black dark:text-white">{row.firstName} {row.lastName}</span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{row.customerId}</span>
        </div>
      ) 
    },
    { 
      header: t("contact") || "Contact", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-black dark:text-white">{row.phone}</span>
          <span className="text-[9px] text-neutral-500">{row.email || 'No Email'}</span>
        </div>
      ) 
    },
    { 
      header: t("loyaltyTier") || "Tier", 
      render: (row) => (
        <span className="text-[9px] font-black uppercase tracking-widest text-[#E9B10C]">
          {row.loyaltyTier || 'BRONZE'}
        </span>
      )
    },
    {
      header: t("recentPurchases") || "Recent Purchases",
      render: (row) => {
        const products = row.recentProducts || row.orders?.flatMap(o => o.items?.map(i => i.product?.name)) || [];
        if (!products || products.length === 0) {
          return <span className="text-[9px] font-bold text-neutral-500 uppercase">None</span>;
        }
        return (
          <div className="flex flex-col gap-1 max-w-[150px]">
            {products.slice(0, 2).map((p, i) => (
              <span key={i} className="text-[9px] truncate bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1 py-0.5 rounded-sm font-medium">
                {typeof p === 'string' ? p : p?.name || 'Product'}
              </span>
            ))}
            {products.length > 2 && <span className="text-[8px] font-bold text-neutral-500">+{products.length - 2} more</span>}
          </div>
        );
      }
    },
    { 
      header: t("status") || "Status", 
      render: (row) => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
          row.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {row.status || (row.isActive ? 'ACTIVE' : 'INACTIVE')}
        </span>
      )
    },
    { 
      header: t("actions") || "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => onView(row)} 
            title="View Profile & Orders" 
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-blue-500 transition-colors"
          >
            <Eye size={14} />
          </button>
          
          <button 
            onClick={() => onEdit(row)} 
            title="Edit Details" 
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          
          <button 
            onClick={() => onAddPrescription(row)} 
            title="Add Prescription" 
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-purple-500 transition-colors"
          >
            <FileText size={14} />
          </button>
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};