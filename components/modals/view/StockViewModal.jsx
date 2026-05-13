"use client";
import { BaseModal } from "../BaseModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const isReactElement = (value) =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  value.$$typeof;

const RenderField = ({ label, value, isBadge = false }) => {
  if (value === undefined || value === null || value === "") return null;

  const renderValue = isReactElement(value) ? value : String(value);

  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] rounded-sm w-fit font-black text-black dark:text-white">
          {renderValue}
        </span>
      ) : (
        <span className="text-[12px] font-medium break-words text-black dark:text-white">
          {renderValue}
        </span>
      )}
    </div>
  );
};

export const StockViewModal = ({ isOpen, onClose, stock, isWebsite = false }) => {
  const { t } = useLanguage();

  const primaryImg =
    stock?.product?.images?.find(img => img.isPrimary)?.url ||
    stock?.product?.images?.[0]?.url;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isWebsite ? t("websiteStockDetails") : t("shopStockDetails")}
      maxWidth="max-w-2xl"
    >
      {!stock ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <div className="flex gap-4 items-center bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
            <div className="w-16 h-16 rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
              <SafeImage
                src={primaryImg}
                alt={stock.product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
                {stock.product?.name}
              </h2>
              <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">
                {stock.product?.sku}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                  stock.status === "IN_STOCK"
                    ? "bg-green-500/10 text-green-500"
                    : stock.status === "LOW_STOCK"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {stock.status?.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {!isWebsite && (
              <RenderField label={t("assignedShop")} value={stock.shop?.name} isBadge />
            )}
            <RenderField label={t("totalQty")} value={stock.quantity} />
            <RenderField label={t("availableQty")} value={stock.availableQuantity} isBadge />
            <RenderField
              label={t("costPrice")}
              value={
                stock.costPrice !== undefined ? (
                  <span className="flex items-center gap-1">
                    ⃁ {(stock.costPrice || 0).toLocaleString()}
                  </span>
                ) : null
              }
            />
            <RenderField
              label={t("sellingPrice")}
              value={
                stock.sellingPrice !== undefined ? (
                  <span className="flex items-center gap-1">
                    ⃁ {(stock.sellingPrice || 0).toLocaleString()}
                  </span>
                ) : null
              }
            />
            {isWebsite && stock.websitePrice !== undefined && (
              <RenderField
                label={t("webPrice")}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(stock.websitePrice || 0).toLocaleString()}
                  </span>
                }
                isBadge
              />
            )}
            <RenderField label={t("minStockAlert")} value={stock.minStockLevel} />
            {isWebsite && (
              <RenderField
                label={t("visibleOnWeb")}
                value={stock.isVisible ? t("yes") : t("no")}
              />
            )}
            {isWebsite && (
              <RenderField
                label={t("isFeatured")}
                value={stock.isFeatured ? t("yes") : t("no")}
              />
            )}
            {isWebsite && stock.isOnSale && (
              <RenderField
                label={t("salePrice")}
                value={
                  <span className="flex items-center gap-1">
                    ⃁ {(stock.salePrice || 0).toLocaleString()}
                  </span>
                }
                isBadge
              />
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
};