"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, XCircle } from "lucide-react";

export const AdjustmentTable = ({ data, loading, onView, onApprove }) => {
  const columns = [
    { 
      header: "Adjustment ID", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">{row.adjustmentNumber}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{new Date(row.adjustmentDate).toLocaleDateString()}</span>
        </div>
      ) 
    },
    { header: "Shop", render: (row) => <span className="text-[10px] font-bold">{row.shop?.name}</span> },
    { header: "Type", render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.adjustmentType}</span> },
    { header: "Total Value Change", render: (row) => (
      <span className={`text-[10px] font-black ${row.totalValueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {row.totalValueChange >= 0 ? '+' : '-'}${Math.abs(row.totalValueChange)}
      </span>
    )},
    { header: "Status", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
        row.status === 'APPLIED' ? 'bg-green-500/10 text-green-500' : 
        row.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
      }`}>
        {row.status}
      </span>
    )},
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Details" className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"><Eye size={14} /></button>
          
          {row.status === 'PENDING' && (
            <>
              <button onClick={() => onApprove(row, 'approve')} title="Approve & Apply" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"><CheckCircle size={14} /></button>
              <button onClick={() => onApprove(row, 'reject')} title="Reject" className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors"><XCircle size={14} /></button>
            </>
          )}
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};