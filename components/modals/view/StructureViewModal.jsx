"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, Loader2 } from "lucide-react";

const isReactElement = (value) =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  value.$$typeof;

const RenderField = ({
  label,
  value,
  isBadge = false,
  badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white",
}) => {
  if (value === undefined || value === null || value === "") return null;

  const renderValue = isReactElement(value) ? value : String(value);

  return (
    <div className="flex flex-col mb-2">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black border border-neutral-200 dark:border-neutral-700 ${badgeColor}`}>
          {renderValue}
        </span>
      ) : (
        <span className="text-[11px] font-medium break-words text-black dark:text-white">
          {renderValue}
        </span>
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
        <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="p-3 grid grid-cols-2 gap-4 bg-white dark:bg-[#111111]">
          {children}
        </div>
      )}
    </div>
  );
};

export const StructureViewModal = ({ isOpen, onClose, structure }) => {
  const { t } = useLanguage();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("salaryStructureDetails")}
      maxWidth="max-w-2xl"
    >
      {!structure ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="pb-4 space-y-2">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
                {t("structureCode")}
              </p>
              <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
                {structure.code}
              </h2>
              <p className="text-[12px] font-bold mt-1 text-black dark:text-white">
                {structure.name}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                  structure.isActive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {structure.isActive ? t("active") : t("inactive")}
              </span>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2">
                {t("netSalary")}
              </p>
              <h2 className="text-xl font-black text-green-500 flex items-center gap-1 justify-end">
                ⃁ {(structure.netSalary || 0).toLocaleString()}
              </h2>
            </div>
          </div>

          <Accordion title={t("baseAndWorkSetup")} defaultOpen={true}>
            <RenderField
              label={t("basicSalary")}
              value={
                <span className="flex items-center gap-1">
                  ⃁ {(structure.basicSalary || 0).toLocaleString()}
                </span>
              }
            />
            <RenderField
              label={t("grossSalary")}
              value={
                <span className="flex items-center gap-1">
                  ⃁ {(structure.grossSalary || 0).toLocaleString()}
                </span>
              }
              isBadge
            />
            <RenderField
              label={t("workingDaysPerMonth")}
              value={structure.workingDaysPerMonth}
            />
            <RenderField
              label={t("workingHoursPerDay")}
              value={structure.workingHoursPerDay}
            />
            <RenderField
              label={t("perDaySalary")}
              value={
                <span className="flex items-center gap-1">
                  ⃁ {(structure.perDaySalary || 0).toFixed(2)}
                </span>
              }
            />
            <RenderField
              label={t("perHourSalary")}
              value={
                <span className="flex items-center gap-1">
                  ⃁ {(structure.perHourSalary || 0).toFixed(2)}
                </span>
              }
            />
          </Accordion>

          <Accordion title={t("fixedAllowances")} defaultOpen={true}>
            {["hra", "da", "ta", "medical", "special", "other"].map((key) => (
              <RenderField
                key={key}
                label={key.toUpperCase()}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(structure.allowances?.[key] || 0).toLocaleString()}
                  </span>
                }
              />
            ))}
            <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <RenderField
                label={t("totalAllowances")}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(structure.totalAllowances || 0).toLocaleString()}
                  </span>
                }
                isBadge
                badgeColor="bg-blue-500/10 text-blue-500 border-transparent"
              />
            </div>
          </Accordion>

          <Accordion title={t("fixedDeductions")} defaultOpen={true}>
            {["pf", "esi", "professionalTax", "tds", "other"].map((key) => (
              <RenderField
                key={key}
                label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(structure.deductions?.[key] || 0).toLocaleString()}
                  </span>
                }
              />
            ))}
            <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <RenderField
                label={t("totalDeductions")}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(structure.totalDeductions || 0).toLocaleString()}
                  </span>
                }
                isBadge
                badgeColor="bg-red-500/10 text-red-500 border-transparent"
              />
            </div>
          </Accordion>

          <Accordion title={t("hrPolicies")}>
            <RenderField
              label={t("overtimeEnabled")}
              value={structure.overtimeEnabled ? t("yes") : t("no")}
              isBadge
            />
            {structure.overtimeEnabled && (
              <RenderField
                label={t("overtimeRatePerHour")}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(structure.overtimeRatePerHour || 0).toLocaleString()} / {t("hour")}
                  </span>
                }
              />
            )}
            <RenderField
              label={t("commissionEnabled")}
              value={structure.commissionEnabled ? t("yes") : t("no")}
              isBadge
            />
            {structure.commissionEnabled && (
              <>
                <RenderField
                  label={t("commissionType")}
                  value={structure.commissionType}
                />
                <RenderField
                  label={t("commissionRate")}
                  value={
                    structure.commissionType === "PERCENTAGE"
                      ? `${structure.commissionRate || 0}%`
                      : (
                        <span className="flex items-center gap-1">
                          ⃁ {(structure.commissionRate || 0).toLocaleString()}
                        </span>
                      )
                  }
                />
              </>
            )}
          </Accordion>
        </div>
      )}
    </BaseModal>
  );
};