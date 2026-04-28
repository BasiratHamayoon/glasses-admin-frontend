"use client";
import { BaseTable } from "./BaseTable";
import { Eye, Edit2, ShieldAlert, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmployeeTable = ({ data, loading, onView, onEdit, onToggleStatus }) => {
  const { t } = useLanguage();

  const columns = [
    { 
      header: t("employee") || "Employee", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black">{row.firstName} {row.lastName}</span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{row.employeeId}</span>
        </div>
      ) 
    },
    { 
      header: t("role") || "Role / Dept", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase">{row.designation}</span>
          <span className="text-[9px] text-[#E9B10C] font-black">{row.department}</span>
        </div>
      ) 
    },
    { 
      header: t("shop") || "Shop", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold">{row.primaryShop?.name || 'Head Office'}</span>
          {row.primaryShop && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              {row.primaryShop.shopCode || `ID: ${row.primaryShop._id?.slice(-6)}`}
            </span>
          )}
        </div>
      ) 
    },
    { 
      header: t("shift") || "Shift / Timing", 
      render: (row) => (
        <div className="flex flex-col">
          {row.defaultShift ? (
            <>
              <span className="text-[10px] font-bold text-black dark:text-white uppercase">{row.defaultShift.name}</span>
              <span className="text-[9px] text-neutral-500 font-black tracking-widest">{row.defaultShift.startTime} - {row.defaultShift.endTime}</span>
            </>
          ) : (
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Unassigned</span>
          )}
        </div>
      ) 
    },
    { 
      header: "Login Acc", 
      render: (row) => (
        <span className={`text-[10px] font-black ${row.user ? 'text-green-500' : 'text-neutral-400'}`}>
          {row.user ? 'YES' : 'NO'}
        </span>
      )
    },
    { 
      header: t("status") || "Status", 
      render: (row) => (
        <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${row.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : row.status === 'ON_LEAVE' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.status.replace('_', ' ')}
        </span>
      )
    },
    { 
      header: t("actions") || "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Profile" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"><Eye size={14} /></button>
          <button onClick={() => onEdit(row)} title="Edit Employee" className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => onToggleStatus(row, row.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')} title={row.status === 'ACTIVE' ? "Suspend" : "Activate"} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-red-500 transition-colors">
            {row.status === 'ACTIVE' ? <ShieldAlert size={14} /> : <CheckCircle size={14} className="text-green-500" />}
          </button>
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};