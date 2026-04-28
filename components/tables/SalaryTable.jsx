"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, CreditCard } from "lucide-react";

export const SalaryTable = ({ data, loading, onView, onApprove, onPay }) => {
  const columns = [
    { 
      header: "Employee", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black">{row.employee?.firstName} {row.employee?.lastName}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{row.employee?.employeeId}</span>
        </div>
      ) 
    },
    { header: "Shop", render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.shop?.name || 'HO'}</span> },
    { header: "Gross", render: (row) => <span className="text-[10px] font-bold text-neutral-500">${row.grossSalary}</span> },
    { header: "Net Pay", render: (row) => <span className="text-[12px] font-black text-[#E9B10C]">${row.netSalary}</span> },
    { header: "Status", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${row.status === 'PAID' ? 'bg-green-500/10 text-green-500' : row.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
        {row.status}
      </span>
    )},
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Payslip" className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"><Eye size={14} /></button>
          {row.status === 'CALCULATED' && <button onClick={() => onApprove(row)} title="Approve Salary" className="p-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-sm transition-colors"><CheckCircle size={14} /></button>}
          {row.status === 'APPROVED' && <button onClick={() => onPay(row)} title="Process Payment" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"><CreditCard size={14} /></button>}
        </div>
      )
    }
  ];
  return <BaseTable columns={columns} data={data} loading={loading} />;
};