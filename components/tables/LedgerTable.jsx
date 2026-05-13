"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const LedgerTable = ({ ledgers, loading }) => {
  const { t } = useLanguage();

  const columns = [
    { 
      header: t("transactionId") || "Txn ID", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-[#E9B10C] tracking-widest">{row.transactionId || '-'}</span>
          <span className="text-[9px] text-neutral-500">{new Date(row.transactionDate).toLocaleString()}</span>
        </div>
      )
    },
    { 
      header: t("type") || "Type", 
      render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.type?.replace(/_/g, ' ') || '-'}</span> 
    },
    { 
      header: t("amount") || "Amount", 
      render: (row) => (
        <span className={`font-black ${row.category === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
          {row.category === 'EXPENSE' ? '-' : '+'}${(row.amount || 0).toLocaleString()}
        </span>
      )
    },
    { 
      header: t("paymentMethod") || "Method", 
      render: (row) => <span className="text-[9px] uppercase font-bold text-neutral-500">{row.paymentMethod || '-'}</span> 
    },
    { 
      header: t("balanceAfter") || "Balance", 
      render: (row) => <span className="text-[11px] font-bold text-black dark:text-white">${(row.balanceAfter || 0).toLocaleString()}</span> 
    },
    { 
      header: t("status"), 
      render: (row) => (
        <span className={`px-2 py-1 text-[9px] uppercase font-black rounded-sm ${row.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
          {row.status || 'PENDING'}
        </span>
      )
    },
  ];

  // 🔥 CRITICAL FIX: Ensure safeData is an array to prevent "Objects are not valid as React child" errors
  const safeData = Array.isArray(ledgers) ? ledgers : [];

  return <BaseTable columns={columns} data={safeData} loading={loading} />;
};