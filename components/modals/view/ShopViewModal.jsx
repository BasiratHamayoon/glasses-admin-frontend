"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { ChevronDown, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RenderField = ({ label, value, isBadge = false, isFullWidth = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={`flex flex-col mb-2 ${isFullWidth ? "col-span-1 sm:col-span-2" : ""}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] rounded-sm w-fit font-black border border-neutral-200 dark:border-neutral-700 text-black dark:text-white">
          {String(value)}
        </span>
      ) : (
        <span className="text-[11px] font-medium break-words text-black dark:text-white">
          {String(value)}
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
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 bg-white dark:bg-[#111111]">
          {children}
        </div>
      )}
    </div>
  );
};

export const ShopViewModal = ({ isOpen, onClose, data, isLoading = false }) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isLoading ? t("loadingModal") : (data?.shop?.name || t("shopDetails"))}
      maxWidth="max-w-2xl"
    >
      {isLoading || !data || !data.shop ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="pb-4" dir={isArabic ? "rtl" : "ltr"}>
          {(() => {
            const { shop, wallet } = data;
            const managerName = shop.manager?.name || null;
            return (
              <>
                <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#E9B10C] tracking-widest">
                      {shop.name}
                    </h2>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">
                      {shop.code} | {shop.shopType}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                        shop.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {shop.status}
                    </span>
                    {managerName && (
                      <div className="mt-2">
                        <p className="text-[9px] uppercase font-bold text-neutral-500">
                          {t("manager")}
                        </p>
                        <p className="text-[11px] font-black text-black dark:text-white mt-0.5">
                          {managerName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Accordion title={t("locationAndContact")} defaultOpen={true}>
                  <RenderField label={t("street")} value={shop.address?.street} />
                  <RenderField
                    label={t("cityAndState")}
                    value={`${shop.address?.city || ""}, ${shop.address?.state || ""}`}
                  />
                  <RenderField label={t("pincode")} value={shop.address?.pincode} />
                  <RenderField label={t("phone")} value={shop.contact?.phone} />
                  <RenderField label={t("email")} value={shop.contact?.email} />
                </Accordion>

                <Accordion title={t("financialOverview")} defaultOpen={true}>
                  <RenderField
                    label={t("cashBalance")}
                    value={`SAR ${wallet?.cashBalance?.toLocaleString() || 0}`}
                  />
                  <RenderField
                    label={t("totalBalance")}
                    value={`SAR ${wallet?.totalBalance?.toLocaleString() || 0}`}
                  />
                  <RenderField
                    label={t("todaySales")}
                    value={`SAR ${wallet?.todaySales?.total?.toLocaleString() || 0}`}
                  />
                  <RenderField
                    label={t("dueToAdmin")}
                    value={`SAR ${wallet?.liabilityToAdmin?.toLocaleString() || 0}`}
                    isBadge
                  />
                </Accordion>
              </>
            );
          })()}
        </div>
      )}
    </BaseModal>
  );
};