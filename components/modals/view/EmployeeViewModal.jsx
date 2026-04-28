"use client";
import { BaseModal } from "../BaseModal";

const RenderField = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      <span className="text-[11px] font-medium text-black dark:text-white">{String(value)}</span>
    </div>
  );
};

export const EmployeeViewModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Employee Profile" maxWidth="max-w-2xl">
      <div className="p-4 space-y-6">
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#E9B10C]">{data.firstName} {data.lastName}</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{data.employeeId} | {data.designation}</p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-sm ${data.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{data.status}</span>
            <p className="text-[10px] mt-2 font-bold">{data.user ? 'Has System Access' : 'No System Access'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RenderField label="Department" value={data.department} />
          <RenderField label="Employment Type" value={data.employmentType.replace('_', ' ')} />
          <RenderField label="Primary Shop" value={data.primaryShop?.name || 'Head Office'} />
          <RenderField label="Date of Joining" value={new Date(data.joiningDate).toLocaleDateString()} />
          <RenderField label="Email" value={data.email || 'N/A'} />
          <RenderField label="Phone" value={data.phone} />
          <RenderField label="Salary Structure" value={data.salaryStructure?.name || 'Not Assigned'} />
          <RenderField label="Assigned Shift" value={data.defaultShift?.name || 'Not Assigned'} />
        </div>
      </div>
    </BaseModal>
  );
};