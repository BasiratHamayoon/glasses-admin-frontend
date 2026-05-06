"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const RenderField = ({ label, value, isBadge = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] rounded-sm w-fit font-black text-black dark:text-white">
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

const statusColors = {
  PAID: "bg-green-500/10 text-green-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  PARTIAL: "bg-indigo-500/10 text-indigo-500",
  PENDING: "bg-orange-500/10 text-orange-500",
  REJECTED: "bg-red-500/10 text-red-500",
  CANCELLED: "bg-neutral-500/10 text-neutral-500",
};

export const ExpenseViewModal = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("expenseDetails")} maxWidth="max-w-2xl">
      {!data ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="p-2 space-y-6">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
                {t("expenseId")}
              </p>
              <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
                {data.expenseNumber}
              </h2>
              <p className="text-[12px] font-bold mt-1 text-black dark:text-white">{data.title}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-2 flex items-center gap-1">
                {t("shop")}:
                <span className="text-black dark:text-white bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-sm ml-1">
                  {data.shop ? data.shop.name : t("headOffice")}
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${statusColors[data.status] || "bg-neutral-500/10 text-neutral-500"}`}>
                {data.status}
              </span>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mt-3">
                {t("dueAmount")}
              </p>
              <h2 className="text-xl font-black text-red-500 flex items-center gap-1 justify-end">
                ⃁ {data.dueAmount?.toLocaleString() || 0}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <RenderField label={t("category")} value={data.category} isBadge />
            <RenderField label={t("paymentMethod")} value={data.paymentMethod} />
            <RenderField label={t("vendorName")} value={data.vendorName || "-"} />
            <RenderField
              label={t("totalAmount")}
              value={<span className="flex items-center gap-1">⃁ {data.totalAmount?.toLocaleString()}</span>}
            />
            <RenderField
              label={t("paidAmount")}
              value={<span className="flex items-center gap-1">⃁ {data.paidAmount?.toLocaleString()}</span>}
            />
          </div>

          {data.items && data.items.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase font-black mb-3 text-neutral-500 tracking-widest">
                {t("lineItems")}
              </h4>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      {[t("item"), t("qtyRate"), t("tax"), t("total")].map((h) => (
                        <th key={h} className="p-2 text-[9px] uppercase font-bold text-neutral-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, i) => (
                      <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                        <td className="p-2 text-[10px] font-bold text-black dark:text-white">
                          {item.description}
                        </td>
                        <td className="p-2 text-[10px] text-neutral-500">
                          {item.quantity} x ⃁ {item.rate}
                        </td>
                        <td className="p-2 text-[10px] text-neutral-500">
                          ⃁ {item.taxAmount} ({item.taxPercentage}%)
                        </td>
                        <td className="p-2 text-[10px] font-black text-right text-black dark:text-white">
                          ⃁ {item.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};