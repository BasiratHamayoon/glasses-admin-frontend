"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const RenderField = ({ label, value, isBadge = false, badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
        {label}
      </span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeColor}`}>
          {String(value)}
        </span>
      ) : (
        <span className="text-[12px] font-medium text-black dark:text-white break-words">
          {String(value)}
        </span>
      )}
    </div>
  );
};

export const TransactionViewModal = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("transactionDetails")} maxWidth="max-w-3xl">
      {!data ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="p-2 space-y-6">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
                {t("transactionId")}
              </p>
              <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
                {data.transactionNumber}
              </h2>
              <p className="text-[11px] font-medium text-neutral-500 mt-1 flex items-center gap-2 flex-wrap">
                {data.transactionDate && format(new Date(data.transactionDate), "PPpp")}
                <span className="text-[8px]">•</span>
                <span className="font-black text-black dark:text-white uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-sm text-[10px]">
                  {data.shop ? `${data.shop.name}` : t("headOffice")}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
                {t("netAmount")}
              </p>
              <h2 className={`text-2xl font-black flex items-center gap-1 justify-end ${data.type === "CREDIT" ? "text-green-500" : "text-red-500"}`}>
                {data.type === "CREDIT" ? "+" : "-"} ⃁ {data.netAmount?.toLocaleString()}
              </h2>
              <span className={`inline-block mt-2 px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${data.status === "COMPLETED" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                {data.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RenderField
              label={t("type")}
              value={data.type}
              isBadge
              badgeColor={data.type === "CREDIT" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
            />
            <RenderField label={t("category")} value={data.category} isBadge />
            <RenderField label={t("paymentMethod")} value={data.paymentMethod} />
            <RenderField
              label={t("reconciled")}
              value={data.isReconciled ? t("yes") : t("no")}
              isBadge
              badgeColor={data.isReconciled ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}
            />
            <RenderField
              label={t("baseAmount")}
              value={<span className="flex items-center gap-1">⃁ {data.amount}</span>}
            />
            <RenderField
              label={t("tax")}
              value={<span className="flex items-center gap-1">⃁ {data.tax || 0}</span>}
            />
            <RenderField
              label={t("discount")}
              value={<span className="flex items-center gap-1">⃁ {data.discount || 0}</span>}
            />
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <RenderField label={t("description")} value={data.description} />
            <RenderField label={t("internalNotes")} value={data.notes} />
          </div>
        </div>
      )}
    </BaseModal>
  );
};