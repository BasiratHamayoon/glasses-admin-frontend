"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const TransactionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const { items: shops = [] } = useSelector(
    (state) => state.shops?.shops || { items: [] }
  );

  const defaultForm = {
    type: "CREDIT",
    category: "SALE",
    paymentMethod: "CASH",
    amount: "",
    description: "",
    shop: "",
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
      };
      if (!payload.shop) delete payload.shop;

      await dispatch(createTransaction(payload)).unwrap();
      toast.success(t("transactionCreated"));
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
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={t("logTransaction")} maxWidth="max-w-xl">
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
            <div>
              <label className={labelClass}>{t("type")} *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={inputClass}
              >
                <option value="CREDIT">{t("moneyIn")}</option>
                <option value="DEBIT">{t("moneyOut")}</option>
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
                <option value="SALE">{t("sale")}</option>
                <option value="DEPOSIT">{t("deposit")}</option>
                <option value="WITHDRAWAL">{t("withdrawal")}</option>
                <option value="EXPENSE">{t("expense")}</option>
                <option value="OTHER">{t("other")}</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("paymentMethod")} *</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className={inputClass}
              >
                <option value="CASH">{t("cash")}</option>
                <option value="CARD">{t("card")}</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">{t("bankTransfer")}</option>
              </select>
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

            <div className="col-span-2">
              <label className={labelClass}>{t("amount")} (⃁) *</label>
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

            <div className="col-span-2">
              <label className={labelClass}>{t("description")} *</label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClass}
                placeholder={t("transactionDescPlaceholder")}
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
              {loading ? <Loader2 size={14} className="animate-spin" /> : t("logTransaction")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};