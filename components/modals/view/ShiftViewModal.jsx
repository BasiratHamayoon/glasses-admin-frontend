"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, Clock, Calendar, Users } from "lucide-react";

const RenderField = ({ label, value, isBadge = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-2">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] rounded-sm w-fit font-black">
          {String(value)}
        </span>
      ) : (
        <span className="text-[11px] font-medium text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest font-black">{title}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-white dark:bg-[#111111]">{children}</div>}
    </div>
  );
};

export const ShiftViewModal = ({ isOpen, onClose, shift }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (!shift) return null;

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('viewShift') || 'Shift Details'} maxWidth="max-w-2xl">
      <div dir={isArabic ? 'rtl' : 'ltr'} className="pb-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-3 bg-neutral-50 dark:bg-[#0a0a0a] rounded-sm">
          <div>
            <h2 className="text-lg font-bold">{shift.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono bg-[#E9B10C]/10 text-[#E9B10C] px-2 py-1 rounded-sm font-bold">
                {shift.code}
              </span>
              <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                shift.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {shift.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-500">Working Hours</div>
            <div className="text-lg font-bold text-[#E9B10C]">{shift.workingHours?.toFixed(1)}h</div>
          </div>
        </div>

        <Accordion title="Basic Information" defaultOpen={true}>
          <RenderField label="Name" value={shift.name} />
          <RenderField label="Code" value={shift.code} isBadge />
          <RenderField label="Description" value={shift.description || 'No description'} />
          <RenderField label="Shop" value={shift.shop?.name || 'All Shops'} />
        </Accordion>

        <Accordion title="Timing">
          <div className="col-span-2 flex items-center gap-4 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-sm">
            <div className="flex-1 text-center">
              <div className="text-[8px] uppercase text-neutral-500">Start</div>
              <div className="text-sm font-mono font-bold">{shift.startTime}</div>
            </div>
            <Clock size={16} className="text-[#E9B10C]" />
            <div className="flex-1 text-center">
              <div className="text-[8px] uppercase text-neutral-500">End</div>
              <div className="text-sm font-mono font-bold">{shift.endTime}</div>
            </div>
          </div>
          
          <RenderField label="Break Duration" value={`${shift.breakDuration} minutes`} />
          <RenderField label="Break Time" value={shift.breakStartTime && shift.breakEndTime ? `${shift.breakStartTime} - ${shift.breakEndTime}` : '-'} />
          <RenderField label="Late Grace Period" value={`${shift.lateGracePeriod} minutes`} />
          <RenderField label="Early Leave Grace" value={`${shift.earlyLeaveGracePeriod} minutes`} />
          <RenderField label="Half Day Hours" value={`${shift.halfDayHours} hours`} />
        </Accordion>

        <Accordion title="Applicable Days">
          <div className="col-span-2 flex flex-wrap gap-2">
            {weekDays.map(day => (
              <span
                key={day}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold rounded-sm ${
                  shift.applicableDays?.includes(day)
                    ? 'bg-[#E9B10C] text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}
              >
                {day.substring(0, 3)}
              </span>
            ))}
          </div>
        </Accordion>

        <Accordion title="Overtime Settings">
          <RenderField label="Overtime Enabled" value={shift.overtimeEnabled ? 'Yes' : 'No'} isBadge />
          {shift.overtimeEnabled && (
            <>
              <RenderField label="Overtime Rate" value={`${shift.overtimeRate}x`} />
              <RenderField label="Minimum Hours" value={`${shift.minOvertimeHours} hours`} />
            </>
          )}
        </Accordion>

        <Accordion title="System Info">
          <RenderField label="Created At" value={new Date(shift.createdAt).toLocaleString()} />
          <RenderField label="Updated At" value={new Date(shift.updatedAt).toLocaleString()} />
        </Accordion>

      </div>
    </BaseModal>
  );
};