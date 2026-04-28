"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { ChevronDown } from "lucide-react";

const RenderField = ({ label, value, isBadge = false, badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-2">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black border border-neutral-200 dark:border-neutral-700 ${badgeColor}`}>{String(value)}</span> : <span className="text-[11px] font-medium break-words">{String(value)}</span>}
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
      {open && <div className="p-3 grid grid-cols-2 gap-4 bg-white dark:bg-[#111111]">{children}</div>}
    </div>
  );
};

export const StructureViewModal = ({ isOpen, onClose, structure }) => {
  if (!structure) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Salary Structure Details" maxWidth="max-w-2xl">
      <div className="pb-4 space-y-2">
        
        {/* Header Block */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Structure Code</p>
            <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">{structure.code}</h2>
            <p className="text-[12px] font-bold mt-1 text-black dark:text-white">{structure.name}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${structure.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {structure.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2">Net Salary</p>
            <h2 className="text-xl font-black text-green-500">SAR {structure.netSalary?.toLocaleString()}</h2>
          </div>
        </div>

        <Accordion title="Base & Work Setup" defaultOpen={true}>
          <RenderField label="Basic Salary" value={`SAR ${structure.basicSalary}`} />
          <RenderField label="Gross Salary" value={`SAR ${structure.grossSalary}`} isBadge />
          <RenderField label="Working Days / Month" value={structure.workingDaysPerMonth} />
          <RenderField label="Working Hours / Day" value={structure.workingHoursPerDay} />
          <RenderField label="Per Day Salary" value={`SAR ${structure.perDaySalary?.toFixed(2)}`} />
          <RenderField label="Per Hour Salary" value={`SAR ${structure.perHourSalary?.toFixed(2)}`} />
        </Accordion>

        <Accordion title="Fixed Allowances" defaultOpen={true}>
          <RenderField label="HRA" value={`SAR ${structure.allowances?.hra || 0}`} />
          <RenderField label="DA" value={`SAR ${structure.allowances?.da || 0}`} />
          <RenderField label="TA" value={`SAR ${structure.allowances?.ta || 0}`} />
          <RenderField label="Medical" value={`SAR ${structure.allowances?.medical || 0}`} />
          <RenderField label="Special" value={`SAR ${structure.allowances?.special || 0}`} />
          <RenderField label="Other" value={`SAR ${structure.allowances?.other || 0}`} />
          <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <RenderField label="Total Allowances" value={`SAR ${structure.totalAllowances}`} isBadge badgeColor="bg-blue-500/10 text-blue-500 border-transparent" />
          </div>
        </Accordion>

        <Accordion title="Fixed Deductions" defaultOpen={true}>
          <RenderField label="PF" value={`SAR ${structure.deductions?.pf || 0}`} />
          <RenderField label="ESI" value={`SAR ${structure.deductions?.esi || 0}`} />
          <RenderField label="Professional Tax" value={`SAR ${structure.deductions?.professionalTax || 0}`} />
          <RenderField label="TDS" value={`SAR ${structure.deductions?.tds || 0}`} />
          <RenderField label="Other" value={`SAR ${structure.deductions?.other || 0}`} />
          <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <RenderField label="Total Deductions" value={`SAR ${structure.totalDeductions}`} isBadge badgeColor="bg-red-500/10 text-red-500 border-transparent" />
          </div>
        </Accordion>

        <Accordion title="HR Policies (Overtime & Commission)">
          <RenderField label="Overtime Enabled" value={structure.overtimeEnabled ? "YES" : "NO"} isBadge />
          {structure.overtimeEnabled && <RenderField label="Overtime Rate" value={`SAR ${structure.overtimeRatePerHour} / hr`} />}
          
          <RenderField label="Commission Enabled" value={structure.commissionEnabled ? "YES" : "NO"} isBadge />
          {structure.commissionEnabled && (
            <>
              <RenderField label="Commission Type" value={structure.commissionType} />
              <RenderField label="Commission Rate" value={structure.commissionType === 'PERCENTAGE' ? `${structure.commissionRate}%` : `SAR ${structure.commissionRate}`} />
            </>
          )}
        </Accordion>

      </div>
    </BaseModal>
  );
}