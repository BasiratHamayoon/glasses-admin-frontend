"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { fetchClosingDetails } from "@/redux/actions/monitoringActions";
import { clearClosingDetail } from "@/redux/slices/monitoringSlice";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

const Field = ({ label, value, color, isFullWidth = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div
      className={`flex flex-col gap-1 ${
        isFullWidth ? "col-span-2 sm:col-span-3" : ""
      }`}
    >
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
        {label}
      </span>
      <span
        className={`text-[11px] font-bold ${
          color || "text-black dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const MoneyField = ({ label, value, color }) => {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
        {label}
      </span>
      <span
        className={`text-[11px] font-bold flex items-center gap-1 ${
          color || "text-black dark:text-white"
        }`}
      >
        ⃁ {formatNum(value)}
      </span>
    </div>
  );
};

const statusColors = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  OPEN: "bg-blue-500/10 text-blue-500",
  SUBMITTED: "bg-amber-500/10 text-amber-500",
  VERIFIED: "bg-purple-500/10 text-purple-500",
  APPROVED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-red-500/10 text-red-500",
  REOPENED: "bg-orange-500/10 text-orange-500",
};

export const ClosingDetailModal = ({
  isOpen,
  onClose,
  closingId,
  onApprove,
  onReject,
}) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const { data: closing, loading } = useSelector(
    (state) => state.monitoring.closingDetail
  );

  useEffect(() => {
    if (isOpen && closingId) {
      dispatch(fetchClosingDetails(closingId));
    }
    return () => {
      if (!isOpen) dispatch(clearClosingDetail());
    };
  }, [isOpen, closingId]);

  const closingData = closing?.closing;

  const shopName = closingData?.shop?.name || t("unknownShop") || "Unknown Shop";
  const closingDateStr = closingData?.closingDate
    ? new Date(closingData.closingDate).toLocaleDateString()
    : "—";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("closingDetails")}
      maxWidth="max-w-2xl"
    >
      {loading || !closingData ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <div>
              <div className="text-lg font-black text-[#E9B10C] tracking-widest">
                {closingData.closingNumber || "—"}
              </div>
              <div className="text-[10px] uppercase text-neutral-500 font-bold mt-1">
                {shopName} — {closingDateStr}
              </div>
            </div>
            <span
              className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                statusColors[closingData.status] || ""
              }`}
            >
              {closingData.status}
            </span>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {t("actualAmountsEntered")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <MoneyField
                label={t("actualCash")}
                value={closingData.actualCash}
              />
              <MoneyField
                label={t("actualCard")}
                value={closingData.actualCard}
              />
              <MoneyField
                label={t("actualUPI")}
                value={closingData.actualUPI}
              />
            </div>
          </div>

          {(closingData.totalSales !== undefined ||
            closingData.cashSales !== undefined ||
            closingData.cardSales !== undefined ||
            closingData.upiSales !== undefined ||
            closingData.totalExpenses !== undefined ||
            closingData.netSales !== undefined ||
            closingData.systemClosingBalance !== undefined ||
            closingData.physicalCash !== undefined ||
            closingData.hasVariance !== undefined) && (
            <div>
              <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {t("systemCalculated")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {closingData.totalSales !== undefined && (
                  <MoneyField
                    label={t("totalSales")}
                    value={closingData.totalSales}
                    color="text-green-500"
                  />
                )}
                {closingData.totalExpenses !== undefined && (
                  <MoneyField
                    label={t("totalExpenses")}
                    value={closingData.totalExpenses}
                    color="text-red-500"
                  />
                )}
                {closingData.netSales !== undefined && (
                  <MoneyField
                    label={t("netSales")}
                    value={closingData.netSales}
                    color="text-blue-500"
                  />
                )}
                {closingData.cashSales !== undefined && (
                  <MoneyField
                    label={t("cashSales")}
                    value={closingData.cashSales}
                  />
                )}
                {closingData.cardSales !== undefined && (
                  <MoneyField
                    label={t("cardSales")}
                    value={closingData.cardSales}
                  />
                )}
                {closingData.upiSales !== undefined && (
                  <MoneyField
                    label={t("upiSales")}
                    value={closingData.upiSales}
                  />
                )}
                {closingData.systemClosingBalance !== undefined && (
                  <MoneyField
                    label={t("systemBalance")}
                    value={closingData.systemClosingBalance}
                  />
                )}
                {closingData.physicalCash !== undefined && (
                  <MoneyField
                    label={t("physicalCash")}
                    value={closingData.physicalCash}
                  />
                )}
                {closingData.hasVariance !== undefined && (
                  <Field
                    label={t("variance")}
                    value={
                      closingData.hasVariance
                        ? `${closingData.varianceType} (⃁ ${formatNum(
                            closingData.varianceAmount
                          )})`
                        : t("none")
                    }
                    color={
                      closingData.hasVariance
                        ? closingData.varianceType === "SHORTAGE"
                          ? "text-red-500"
                          : "text-amber-500"
                        : "text-green-500"
                    }
                  />
                )}
                {closingData.totalOrders !== undefined && (
                  <Field
                    label={t("totalOrders")}
                    value={String(closingData.totalOrders)}
                  />
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {t("closingInfo")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {closingData.closedBy?.name && (
                <Field
                  label={t("closedBy")}
                  value={closingData.closedBy.name}
                />
              )}
              {closingData.approvedBy?.name && (
                <Field
                  label={t("approvedBy")}
                  value={closingData.approvedBy.name}
                />
              )}
            </div>
          </div>

          {closingData.notes && (
            <div className="p-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
                {t("notes")}
              </div>
              <div className="text-[11px] font-medium text-black dark:text-white">
                {closingData.notes}
              </div>
            </div>
          )}

          {["SUBMITTED", "PENDING", "OPEN"].includes(closingData.status) && (
            <div className="flex gap-2 justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
              {onApprove && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(closingData._id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 text-[10px] uppercase font-black rounded-sm hover:bg-green-500/20 transition-colors"
                >
                  <CheckCircle size={13} />
                  {t("approve")}
                </button>
              )}
              {onReject && (
                <button
                  type="button"
                  onClick={() => {
                    onReject(closingData._id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-[10px] uppercase font-black rounded-sm hover:bg-red-500/20 transition-colors"
                >
                  <XCircle size={13} />
                  {t("reject")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};