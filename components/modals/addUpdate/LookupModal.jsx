"use client";
import { useState, useEffect } from "react";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export const LookupModal = ({ isOpen, onClose, onSubmit, initialData = null, title, loading, extraFields = null }) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const defaultForm = { name: "", value: "", description: "", sortOrder: 0, isActive: true };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        value: initialData.value || "",
        description: initialData.description || "",
        sortOrder: initialData.sortOrder ?? 0,
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData(defaultForm);
    }
  }, [isOpen, initialData]);

  const inputClass =
    "w-full bg-white dark:bg-[#111111] text-black dark:text-white border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none focus:border-[#E9B10C] transition-colors rounded-sm";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={title} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>{t("name")} *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
            />
          </div>
        
          <div>
            <label className={labelClass}>{t("sortOrder")}</label>
            <input
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>{t("description")}</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 accent-[#E9B10C]"
            />
            <label htmlFor="isActive" className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 cursor-pointer">
              {t("active")}
            </label>
          </div>
          {extraFields && extraFields(formData, setFormData, inputClass, labelClass)}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#E9B10C] text-black hover:bg-[#d4a00a] transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {t("save")}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};