"use client";
import { BaseTable } from "./BaseTable";
import { Eye, ShieldCheck, Undo2 } from "lucide-react";

export const TransactionTable = ({ data, loading, onView, onReconcile, onReverse }) => {
  const columns = [
    { 
      header: "Txn ID", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">{row.transactionNumber}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{new Date(row.transactionDate).toLocaleDateString()}</span>
        </div>
      ) 
    },
    { 
      header: "Shop", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider font-black text-neutral-800 dark:text-neutral-200">
            {row.shop?.name || 'Head Office'}
          </span>
          {row.shop && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
              {row.shop.shopCode || `ID: ${row.shop._id?.slice(-6)}`}
            </span>
          )}
        </div>
      ) 
    },
    { header: "Type", render: (row) => <span className={`text-[9px] font-black uppercase ${row.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>{row.type}</span> },
    { header: "Category", render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.category}</span> },
    { header: "Amount", render: (row) => <span className="text-[12px] font-black">SAR {row.netAmount?.toLocaleString() || 0}</span> },
    { header: "Method", render: (row) => <span className="text-[9px] uppercase">{row.paymentMethod}</span> },
    { header: "Reconciled", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${row.isReconciled ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
        {row.isReconciled ? "Yes" : "Pending"}
      </span>
    )},
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Details" className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"><Eye size={14} /></button>
          {!row.isReconciled && <button onClick={() => onReconcile(row)} title="Reconcile" className="p-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-sm transition-colors"><ShieldCheck size={14} /></button>}
          {!row.isReversed && row.status !== 'REVERSED' && <button onClick={() => onReverse(row)} title="Reverse Transaction" className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors"><Undo2 size={14} /></button>}
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};