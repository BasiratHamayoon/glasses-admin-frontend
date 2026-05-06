"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateCashFlow, generateProfitLoss } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const GenerateReportModal = ({ isOpen, onClose, reportType, onSuccess }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const shops = useSelector((state) => state.shops?.shops?.items || []);

  const defaultForm = {
    shop: "",
    period: "MONTHLY",
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setModalReady(false);
      setFormData(defaultForm);
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      return toast.error(t("datesRequired"));
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return toast.error(t("startDateAfterEndDate"));
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.shop) delete payload.shop;

      if (reportType === "CASH_FLOW") {
        await dispatch(generateCashFlow(payload)).unwrap();
      } else {
        await dispatch(generateProfitLoss(payload)).unwrap();
      }

      toast.success(t("reportGenerated"));
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || err?.message || t("operationFailed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  const title =
    reportType === "CASH_FLOW"
      ? t("generateCashFlowReport")
      : t("generateProfitLossReport");

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      {!modalReady ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div>
            <label className={labelClass}>{t("selectShop")}</label>
            <select
              value={formData.shop}
              onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
              className={inputClass}
            >
              <option value="">{t("allShopsConsolidated")}</option>
              {shops.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>{t("reportingPeriod")}</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className={inputClass}
            >
              <option value="DAILY">{t("daily")}</option>
              <option value="WEEKLY">{t("weekly")}</option>
              <option value="MONTHLY">{t("monthly")}</option>
              <option value="QUARTERLY">{t("quarterly")}</option>
              <option value="YEARLY">{t("yearly")}</option>
              <option value="CUSTOM">{t("customRange")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("startDate")} *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("endDate")} *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : t("generate")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};