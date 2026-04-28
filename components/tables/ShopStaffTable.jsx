"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { Trash2 } from "lucide-react";

export const ShopStaffTable = ({ data, loading, onDelete }) => {
  const columns = [
    { 
      header: "Employee", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[11px]">{row.employee?.firstName} {row.employee?.lastName}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{row.employee?.employeeId}</span>
        </div>
      ) 
    },
    { 
      header: "Role", 
      render: (row) => <span className="text-[9px] uppercase tracking-wider font-black text-[#E9B10C]">{row.role}</span> 
    },
    { 
      header: "Status", 
      render: (row) => <span className="text-[10px] font-bold text-neutral-500">{row.status}</span> 
    },
    { 
      header: "Actions", 
      render: (row) => (
        <button onClick={() => onDelete(row)} title="Remove from Shop" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 hover:text-red-500 rounded-sm transition-colors">
          <Trash2 size={14} />
        </button>
      )
    }
  ];
  return <BaseTable columns={columns} data={data} loading={loading} />;
};