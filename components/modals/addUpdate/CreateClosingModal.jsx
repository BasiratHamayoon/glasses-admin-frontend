"use client";
import { useState, useEffect } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export const CreateClosingModal = ({
  isOpen,
  onClose,
  onSubmit,
  shops = [],
  preSelectedShop = null,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const defaultForm = {
    shopId: "",
    closingDate: new Date().toISOString().split("T")[0],
    actualCash: "",
    actualCard: "",
    actualUPI: "",
    notes: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...defaultForm,
        shopId: preSelectedShop?._id || "",
      });
    }
  }, [isOpen, preSelectedShop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopId) return;
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        actualCash: Number(formData.actualCash) || 0,
        actualCard: Number(formData.actualCard) || 0,
        actualUPI: Number(formData.actualUPI) || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black dark:text-white";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("createClosing")} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>{t("shop")} *</label>
          <select
            required
            value={formData.shopId}
            onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
            className={inputClass}
            disabled={!!preSelectedShop}
          >
            <option value="">{t("selectShop")}</option>
            {shops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>{t("closingDate")} *</label>
          <input
            type="date"
            required
            value={formData.closingDate}
            onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("actualCash")} (⃁)</label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={formData.actualCash}
              onChange={(e) => setFormData({ ...formData, actualCash: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("actualCard")} (⃁)</label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={formData.actualCard}
              onChange={(e) => setFormData({ ...formData, actualCard: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("actualUPI")} (⃁)</label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={formData.actualUPI}
              onChange={(e) => setFormData({ ...formData, actualUPI: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("notes")}</label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={loading || !formData.shopId}
            className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : t("createClosing")}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};