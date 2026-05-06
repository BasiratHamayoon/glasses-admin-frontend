"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory } from "@/redux/actions/categoryActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const TABS = ["basic", "media", "settings"];

const isBasicTabValid = (formData) => {
  return formData.name.trim() !== "";
};

const isTabNextAllowed = (tabName, formData) => {
  if (tabName === "basic") return isBasicTabValid(formData);
  return true;
};

export const CategoryModal = ({ isOpen, onClose, initialData = null }) => {
  const { language, t } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [loading, setLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const defaultForm = {
    name: "",
    description: "",
    image: "",
    isActive: true,
    showOnWebsite: true,
    showOnPOS: true,
    isFeatured: false,
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...defaultForm, ...initialData });
      } else {
        setFormData(defaultForm);
      }
      setActiveTabIndex(0);
    }
  }, [isOpen, initialData]);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, [field]: base64 }));
    } catch (err) {
      toast.error(t("errorReadingFile"));
    }
  };

  const handleNext = () => {
    if (activeTabIndex < TABS.length - 1) {
      setActiveTabIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload._id;
      delete payload.id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.slug;

      if (initialData?._id) {
        await dispatch(
          updateCategory({ id: initialData._id, data: payload })
        ).unwrap();
        toast.success(t("categoryUpdated"));
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success(t("categoryCreated"));
      }
      onClose(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] text-black dark:text-white border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none focus:border-[#E9B10C] transition-colors rounded-sm";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";
  const checkboxClass =
    "w-3 h-3 accent-[#E9B10C] bg-white dark:bg-[#111111] border-neutral-300 dark:border-neutral-700 rounded-sm cursor-pointer";

  const activeTab = TABS[activeTabIndex];
  const isLastTab = activeTabIndex === TABS.length - 1;
  const nextAllowed = isTabNextAllowed(activeTab, formData);
  const saveAllowed = !loading && isBasicTabValid(formData);

  const renderUploadBox = (field, label) => (
    <div>
      <label className={labelClass}>{label}</label>
      {formData[field] ? (
        <div className="relative w-full h-32 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden group">
          <SafeImage src={formData[field]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, [field]: "" }))}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
          <UploadCloud className="w-6 h-6 mb-2 text-neutral-400" />
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
            {t("clickToSelect")} {label}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, field)}
          />
        </label>
      )}
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editCategory") : t("addCategory")}
      maxWidth="max-w-xl"
    >
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTabIndex(idx)}
            className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 transition-all ${
              activeTabIndex === idx
                ? "border-[#E9B10C] text-[#E9B10C]"
                : "border-transparent text-neutral-500"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>{t("name")} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("description")}</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-1 gap-4">
            {renderUploadBox("image", t("mainImage"))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-2 gap-4">
            {["isActive", "showOnWebsite", "showOnPOS", "isFeatured"].map(
              (field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.checked })
                    }
                    className={checkboxClass}
                  />
                  <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">
                    {t(field)}
                  </span>
                </label>
              )
            )}
          </div>
        )}

        <div className="flex justify-between gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-2">
            {activeTabIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
              >
                {t("back")}
              </button>
            )}
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
          </div>

          {isLastTab ? (
            <button
              type="submit"
              disabled={!saveAllowed}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 rounded-sm ${
                saveAllowed
                  ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("save")
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!nextAllowed}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 rounded-sm ${
                nextAllowed
                  ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              {t("next")}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </form>
    </BaseModal>
  );
};