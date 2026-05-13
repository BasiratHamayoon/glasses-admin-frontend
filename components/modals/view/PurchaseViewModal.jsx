"use client";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const isReactElement = (value) =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  value.$$typeof;

const Field = ({ label, value, isBadge = false, badgeClass = "" }) => {
  if (value === undefined || value === null || value === "") return null;

  const renderValue = isReactElement(value) ? value : String(value);

  return (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
        {label}
      </span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeClass}`}>
          {renderValue}
        </span>
      ) : (
        <span className="text-[12px] font-medium text-black dark:text-white break-words">
          {renderValue}
        </span>
      )}
    </div>
  );
};

const editStatusColors = {
  NONE: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
  PENDING: "bg-orange-500/10 text-orange-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  REJECTED: "bg-red-500/10 text-red-500",
};

export const PurchaseViewModal = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();

  const editStatus = data?.editRequest?.status || "NONE";
  const pendingChanges = data?.editRequest?.pendingChanges;
  const hasPendingChanges =
    pendingChanges &&
    Object.values(pendingChanges).some(
      (v) => v !== null && v !== undefined && v !== ""
    );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("purchaseDetails")} maxWidth="max-w-3xl">
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
                {t("purchaseId")}
              </p>
              <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
                {data.purchaseNumber}
              </h2>
              <p className="text-[11px] font-medium text-neutral-500 mt-1">
                {data.purchaseDate ? format(new Date(data.purchaseDate), "PPP") : "—"}
              </p>
              <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-sm">
                {data.shop?.name || "—"}
                {data.shop?.code ? ` (${data.shop.code})` : ""}
              </span>
            </div>
            <div className="text-right space-y-2">
              <p className="text-[10px] uppercase font-bold text-neutral-500">
                {t("totalValue")}
              </p>
              <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-1 justify-end">
                ⃁ {((data.price || 0) * (data.quantity || 1)).toLocaleString()}
              </h2>
              <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${editStatusColors[editStatus]}`}>
                {t("edit")}: {editStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label={t("itemName")} value={data.itemName} />
            <Field
              label={t("category")}
              value={data.category?.name || data.customCategory || "—"}
            />
            <Field label={t("quantity")} value={data.quantity} />
            <Field
              label={t("unitPrice")}
              value={
                <span className="flex items-center gap-1">
                  ⃁ {(data.price || 0).toLocaleString()}
                </span>
              }
            />
            <Field
              label={t("supplierShop")}
              value={data.supplierShopName || "—"}
            />
            <Field
              label={t("createdBy")}
              value={data.createdBy?.name || "—"}
            />
          </div>

          {data.notes && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <Field label={t("notes")} value={data.notes} />
            </div>
          )}

          {data.productRef && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
                {t("linkedProduct")}
              </p>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <div>
                  <p className="text-[11px] font-black text-black dark:text-white">
                    {data.productRef.name}
                  </p>
                  {data.productRef.sku && (
                    <p className="text-[9px] text-neutral-500 uppercase">
                      SKU: {data.productRef.sku}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {editStatus !== "NONE" && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
              <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500">
                {t("editRequestDetails")}
              </p>

              <div className="p-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-500">{t("status")}</span>
                  <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${editStatusColors[editStatus]}`}>
                    {editStatus}
                  </span>
                </div>

                {data.editRequest?.requestedBy && (
                  <div className="flex justify-between">
                    <span className="text-[9px] uppercase font-bold text-neutral-500">{t("requestedBy")}</span>
                    <span className="text-[10px] font-bold text-black dark:text-white">
                      {data.editRequest.requestedBy?.name || "—"}
                    </span>
                  </div>
                )}

                {data.editRequest?.requestedAt && (
                  <div className="flex justify-between">
                    <span className="text-[9px] uppercase font-bold text-neutral-500">{t("requestedAt")}</span>
                    <span className="text-[10px] font-bold text-black dark:text-white">
                      {format(new Date(data.editRequest.requestedAt), "PPp")}
                    </span>
                  </div>
                )}

                {data.editRequest?.reason && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 shrink-0">{t("reason")}</span>
                    <span className="text-[10px] font-medium text-right text-black dark:text-white">
                      {data.editRequest.reason}
                    </span>
                  </div>
                )}

                {editStatus === "REJECTED" && data.editRequest?.rejectionReason && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[9px] uppercase font-bold text-red-500 shrink-0">{t("rejectionReason")}</span>
                    <span className="text-[10px] font-medium text-right text-red-500">
                      {data.editRequest.rejectionReason}
                    </span>
                  </div>
                )}

                {editStatus === "APPROVED" && data.editRequest?.approvedBy && (
                  <div className="flex justify-between">
                    <span className="text-[9px] uppercase font-bold text-blue-500">{t("approvedBy")}</span>
                    <span className="text-[10px] font-bold text-blue-500">
                      {data.editRequest.approvedBy?.name || "—"}
                    </span>
                  </div>
                )}
              </div>

              {hasPendingChanges && (
                <div>
                  <p className="text-[9px] uppercase font-bold text-neutral-500 mb-2">
                    {t("proposedChanges")}
                  </p>
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("field")}</th>
                          <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("currentValue")}</th>
                          <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("proposedValue")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingChanges.itemName && (
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("itemName")}</td>
                            <td className="p-2 text-[10px] text-neutral-500">{data.itemName}</td>
                            <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.itemName}</td>
                          </tr>
                        )}
                        {pendingChanges.quantity != null && (
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("quantity")}</td>
                            <td className="p-2 text-[10px] text-neutral-500">{data.quantity}</td>
                            <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.quantity}</td>
                          </tr>
                        )}
                        {pendingChanges.price != null && (
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("unitPrice")}</td>
                            <td className="p-2 text-[10px] text-neutral-500 flex items-center gap-1">
                              ⃁ {(data.price || 0).toLocaleString()}
                            </td>
                            <td className="p-2 text-[10px] font-bold text-[#E9B10C] flex items-center gap-1">
                              ⃁ {(pendingChanges.price || 0).toLocaleString()}
                            </td>
                          </tr>
                        )}
                        {pendingChanges.supplierShopName !== null &&
                          pendingChanges.supplierShopName !== undefined && (
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("supplier")}</td>
                            <td className="p-2 text-[10px] text-neutral-500">{data.supplierShopName || "—"}</td>
                            <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.supplierShopName || "—"}</td>
                          </tr>
                        )}
                        {pendingChanges.notes !== null &&
                          pendingChanges.notes !== undefined && (
                          <tr className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                            <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">{t("notes")}</td>
                            <td className="p-2 text-[10px] text-neutral-500">{data.notes || "—"}</td>
                            <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.notes || "—"}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};