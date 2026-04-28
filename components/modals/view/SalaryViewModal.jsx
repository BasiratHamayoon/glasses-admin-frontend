"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { ChevronDown } from "lucide-react";

const RenderField = ({ label, value, isBadge = false, badgeColor = "bg-neutral-100 dark:bg-neutral-800" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-2">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeColor}`}>{String(value)}</span> : <span className="text-[11px] font-medium break-words">{String(value)}</span>}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 transition-colors">
        <span className="text-[10px] uppercase tracking-widest font-black">{title}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 grid grid-cols-2 gap-4">{children}</div>}
    </div>
  );
};

export const SalaryViewModal = ({ isOpen, onClose, salary }) => {
  if (!salary) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Payslip Details" maxWidth="max-w-2xl">
      <div className="pb-4 space-y-2">
        
        {/* Header Block */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">{salary.employee?.firstName} {salary.employee?.lastName}</h2>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">{new Date(0, salary.month-1).toLocaleString('default', { month: 'long' })} {salary.year}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${salary.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{salary.status}</span>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2">Net Salary</p>
            <h2 className="text-xl font-black text-black dark:text-white">${salary.netSalary?.toLocaleString()}</h2>
          </div>
        </div>

        <Accordion title="Earnings & Allowances" defaultOpen={true}>
          <RenderField label="Basic Salary" value={`$${salary.basicSalary}`} />
          <RenderField label="HRA" value={`$${salary.allowances?.hra || 0}`} />
          <RenderField label="DA" value={`$${salary.allowances?.da || 0}`} />
          <RenderField label="Overtime" value={`$${salary.earnings?.overtime || 0}`} />
          <RenderField label="Total Gross" value={`$${salary.grossSalary}`} isBadge badgeColor="bg-blue-500/10 text-blue-500" />
        </Accordion>

        <Accordion title="Deductions" defaultOpen={true}>
          <RenderField label="PF" value={`$${salary.deductions?.pf || 0}`} />
          <RenderField label="ESI" value={`$${salary.deductions?.esi || 0}`} />
          <RenderField label="TDS / Tax" value={`$${salary.deductions?.tds || 0}`} />
          <RenderField label="Loan Recovery" value={`$${salary.deductions?.loanRecovery || 0}`} />
          <RenderField label="Total Deductions" value={`$${salary.totalDeductions}`} isBadge badgeColor="bg-red-500/10 text-red-500" />
        </Accordion>

        <Accordion title="Attendance Summary">
          <RenderField label="Total Days" value={salary.attendanceSummary?.totalDays} />
          <RenderField label="Present" value={salary.attendanceSummary?.presentDays} />
          <RenderField label="Absent" value={salary.attendanceSummary?.absentDays} />
          <RenderField label="Leave" value={salary.attendanceSummary?.leaveDays} />
          <RenderField label="Late Days" value={salary.attendanceSummary?.lateDays} />
          <RenderField label="Overtime Hours" value={salary.attendanceSummary?.overtimeHours} />
        </Accordion>

      </div>
    </BaseModal>
  );
};