"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createCustomer, updateCustomer } from "@/redux/actions/customerActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const CustomerModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const defaultForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "MALE",
    source: "WALK_IN",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setModalReady(false);
      if (initialData) {
        setFormData({
          ...defaultForm,
          ...initialData,
          email: initialData.email || "",
        });
      } else {
        setFormData(defaultForm);
      }
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.email) delete payload.email;
      if (!payload.lastName) delete payload.lastName;
      payload.phone = payload.phone.replace(/\D/g, "");

      if (initialData?._id) {
        await dispatch(updateCustomer({ id: initialData._id, data: payload })).unwrap();
        toast.success(t("customerUpdated"));
      } else {
        await dispatch(createCustomer(payload)).unwrap();
        toast.success(t("customerCreated"));
      }
      onClose(true);
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white";
  const labelClass =
    "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editCustomer") : t("addCustomer")}
      maxWidth="max-w-md"
    >
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
              <label className={labelClass}>{t("firstName")} *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("lastName")}</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("phone")} *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("email")}</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("gender")}</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className={inputClass}
              >
                <option value="MALE">{t("male")}</option>
                <option value="FEMALE">{t("female")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("source")}</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className={inputClass}
              >
                <option value="WALK_IN">{t("walkIn")}</option>
                <option value="WEBSITE">{t("website")}</option>
                <option value="REFERRAL">{t("referral")}</option>
              </select>
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
              className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : t("saveCustomer")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};