"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ExpenseModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const { items: shops = [] } = useSelector(
    (state) => state.shops?.shops || { items: [] }
  );

  const defaultForm = {
    title: "",
    shop: "",
    category: "RENT",
    paymentMethod: "CASH",
    vendorName: "",
    amount: "",
    taxPercentage: "",
    description: "",
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
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount) || 0,
        taxPercentage: Number(formData.taxPercentage) || 0,
        items: [
          {
            description: formData.title,
            quantity: 1,
            rate: Number(formData.amount) || 0,
            amount: Number(formData.amount) || 0,
            taxPercentage: Number(formData.taxPercentage) || 0,
          },
        ],
      };

      if (!payload.shop) delete payload.shop;

      await dispatch(createExpense(payload)).unwrap();
      toast.success(t("expenseCreated"));
      onClose(true);
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
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass =
    "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={t("logExpense")} maxWidth="max-w-2xl">
      {!modalReady ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>{t("title")} *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t("shop")} ({t("optional")})</label>
              <select
                value={formData.shop}
                onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                className={inputClass}
              >
                <option value="">{t("headOffice")}</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("category")} *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}
              >
                <option value="RENT">{t("rent")}</option>
                <option value="ELECTRICITY">{t("electricity")}</option>
                <option value="SALARY">{t("salary")}</option>
                <option value="INVENTORY">{t("inventoryPurchases")}</option>
                <option value="MARKETING">{t("marketing")}</option>
                <option value="OTHER">{t("other")}</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("baseAmount")} (⃁) *</label>
              <input
                type="number"
                required
                min="1"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t("taxPercentage")} (%)</label>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={formData.taxPercentage}
                onChange={(e) => setFormData({ ...formData, taxPercentage: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t("paymentMethod")}</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className={inputClass}
              >
                <option value="CASH">{t("cash")}</option>
                <option value="BANK_TRANSFER">{t("bankTransfer")}</option>
                <option value="CARD">{t("card")}</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("vendorName")}</label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>{t("description")}</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : t("createExpense")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};