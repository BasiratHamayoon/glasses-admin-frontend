"use client";
import { BaseTable } from "./BaseTable";
import { Edit2, ShieldAlert, CheckCircle, Trash2 } from "lucide-react";

export const ShiftTable = ({ data, loading, onEdit, onToggleStatus, onDelete }) => {
  const columns = [
    { 
      header: "Shift Info", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">{row.code}</span>
          <span className="text-[10px] font-bold text-black dark:text-white mt-0.5">{row.name}</span>
        </div>
      ) 
    },
    { 
      header: "Timing", 
      render: (row) => (
        <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700">
          {row.startTime} - {row.endTime}
        </span>
      ) 
    },
    { header: "Hours", render: (row) => <span className="text-[11px] font-black">{row.workingHours} hrs</span> },
    { 
      header: "Shop", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold">{row.shop?.name || 'Universal'}</span>
          {row.shop && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              {row.shop.shopCode || `ID: ${row.shop._id?.slice(-6)}`}
            </span>
          )}
        </div>
      ) 
    },
    { header: "Status", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${row.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    )},
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onEdit(row)} title="Edit" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => onToggleStatus(row)} title="Toggle Status" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-500 transition-colors">
            {row.isActive ? <ShieldAlert size={14} className="text-orange-500" /> : <CheckCircle size={14} className="text-green-500" />}
          </button>
          <button onClick={() => onDelete(row)} title="Delete" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      )
    }
  ];
  return <BaseTable columns={columns} data={data} loading={loading} />;
};