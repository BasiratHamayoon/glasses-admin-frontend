"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const RenderField = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      <span className="text-[11px] font-medium text-black dark:text-white">{String(value)}</span>
    </div>
  );
};

export const EmployeeViewModal = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("employeeProfile")} maxWidth="max-w-2xl">
      {!data ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-[#E9B10C]">
                {data.firstName} {data.lastName}
              </h2>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                {data.employeeId} | {data.designation}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 text-[9px] font-black uppercase rounded-sm ${
                  data.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {data.status}
              </span>
              <p className="text-[10px] mt-2 font-bold text-neutral-500">
                {data.user ? t("hasSystemAccess") : t("noSystemAccess")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <RenderField label={t("department")} value={data.department} />
            <RenderField
              label={t("employmentType")}
              value={data.employmentType?.replace("_", " ")}
            />
            <RenderField
              label={t("primaryShop")}
              value={data.primaryShop?.name || t("headOffice")}
            />
            <RenderField
              label={t("dateOfJoining")}
              value={data.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : "-"}
            />
            <RenderField label={t("email")} value={data.email || t("notAvailable")} />
            <RenderField label={t("phone")} value={data.phone} />
            <RenderField
              label={t("salaryStructure")}
              value={data.salaryStructure?.name || t("notAssigned")}
            />
            <RenderField
              label={t("assignedShift")}
              value={data.defaultShift?.name || t("notAssigned")}
            />
          </div>
        </div>
      )}
    </BaseModal>
  );
};