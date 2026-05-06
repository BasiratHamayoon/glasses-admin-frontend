"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "@/redux/actions/productActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Loader2,
  UploadCloud,
  Star,
  ChevronRight,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const TABS = ["basic", "media", "pricing", "frameSpecs", "lensSpecs"];

const isBasicTabValid = (formData) =>
  formData.name.trim() !== "" &&
  formData.sku.trim() !== "" &&
  formData.category !== "";

const isPricingTabValid = (formData) =>
  formData.costPrice > 0 && formData.sellingPrice > 0;

const resolveId = (val) => {
  if (!val) return "";
  if (typeof val === "object" && val._id) return val._id;
  return val;
};

const buildDefaultForm = () => ({
  name: "",
  sku: "",
  category: "",
  brand: "",
  gender: "UNISEX",
  ageGroup: "ADULT",
  description: "",
  costPrice: "",
  sellingPrice: "",
  mrp: "",
  discount: "",
  discountType: "PERCENTAGE",
  taxRate: "",
  tags: "",
  images: [],
  frameSpecs: {
    frameWidth: "",
    frameShape: "",
    frameMaterial: "",
    frameType: "",
  },
  lensSpecs: { lensType: "", lensMaterial: "" },
});

export const ProductModal = ({
  isOpen,
  onClose,
  initialData = null,
  categories = [],
  frameShapes = [],
  frameMaterials = [],
  frameTypes = [],
  lensTypes = [],
  lensMaterials = [],
}) => {
  const { language, t } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [loading, setLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [formData, setFormData] = useState(buildDefaultForm());

  useEffect(() => {
    if (!isOpen) return;
    setActiveTabIndex(0);

    if (initialData) {
      setFormData({
        ...buildDefaultForm(),
        ...initialData,
        category: resolveId(initialData.category),
        brand: resolveId(initialData.brand),
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tags || "",
        images: initialData.images || [],
        costPrice: initialData.costPrice ?? "",
        sellingPrice: initialData.sellingPrice ?? "",
        mrp: initialData.mrp ?? "",
        discount: initialData.discount ?? "",
        taxRate: initialData.taxRate ?? "",
        frameSpecs: {
          frameShape: resolveId(initialData.frameSpecs?.frameShape),
          frameMaterial: resolveId(initialData.frameSpecs?.frameMaterial),
          frameType: resolveId(initialData.frameSpecs?.frameType),
          frameWidth: initialData.frameSpecs?.frameWidth ?? "",
        },
        lensSpecs: {
          lensType: resolveId(initialData.lensSpecs?.lensType),
          lensMaterial: resolveId(initialData.lensSpecs?.lensMaterial),
        },
      });
    } else {
      setFormData(buildDefaultForm());
    }
  }, [isOpen, initialData]);

  const handleNestedChange = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const handleSystemImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return { url: base64, isPrimary: false };
        })
      );
      setFormData((prev) => {
        const updated = [...prev.images, ...newImages];
        if (!updated.find((img) => img.isPrimary) && updated.length > 0) {
          updated[0].isPrimary = true;
        }
        return { ...prev, images: updated };
      });
    } catch {
      toast.error(t("failedToReadImages"));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (!updated.find((img) => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isPrimary: i === index })),
    }));
  };

  const handleSubmit = async () => {
    if (!isBasicTabValid(formData)) {
      toast.error(t("fillRequiredFields"));
      return;
    }
    if (!isPricingTabValid(formData)) {
      toast.error(t("fillPricingFields"));
      return;
    }

    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));

      payload.tags = payload.tags
        ? payload.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      payload.costPrice = Number(payload.costPrice) || 0;
      payload.sellingPrice = Number(payload.sellingPrice) || 0;
      payload.mrp = Number(payload.mrp) || 0;
      payload.discount = Number(payload.discount) || 0;
      payload.taxRate = Number(payload.taxRate) || 0;

      if (!payload.brand) delete payload.brand;

      const fs = payload.frameSpecs || {};
      if (fs.frameWidth) fs.frameWidth = Number(fs.frameWidth);
      Object.keys(fs).forEach((k) => {
        if (!fs[k] && fs[k] !== 0) delete fs[k];
      });
      if (Object.keys(fs).length === 0) delete payload.frameSpecs;

      const ls = payload.lensSpecs || {};
      Object.keys(ls).forEach((k) => {
        if (!ls[k]) delete ls[k];
      });
      if (Object.keys(ls).length === 0) delete payload.lensSpecs;

      if (initialData?._id) {
        await dispatch(
          updateProduct({ id: initialData._id, data: payload })
        ).unwrap();
        toast.success(t("productUpdated"));
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success(t("productCreated"));
      }

      onClose(true);
    } catch (err) {
      toast.error(
        err?.message || err?.response?.data?.message || t("errorOccurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] text-black dark:text-white border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none focus:border-[#E9B10C] transition-colors rounded-sm";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  const activeTab = TABS[activeTabIndex];
  const isLastTab = activeTabIndex === TABS.length - 1;
  const isFirstTab = activeTabIndex === 0;

  const hasNoCategories = categories.length === 0;
  const hasNoFrameShapes = frameShapes.filter((o) => o.isActive).length === 0;
  const hasNoFrameMaterials = frameMaterials.filter((o) => o.isActive).length === 0;
  const hasNoFrameTypes = frameTypes.filter((o) => o.isActive).length === 0;
  const hasNoLensTypes = lensTypes.filter((o) => o.isActive).length === 0;
  const hasNoLensMaterials = lensMaterials.filter((o) => o.isActive).length === 0;

  const saveAllowed =
    !loading &&
    isBasicTabValid(formData) &&
    isPricingTabValid(formData);

  const canProceedFromBasic = isBasicTabValid(formData);
  const canProceedFromPricing = isPricingTabValid(formData);

  const canGoNext = () => {
    if (activeTab === "basic") return canProceedFromBasic;
    if (activeTab === "pricing") return canProceedFromPricing;
    return true;
  };

  const NoOptionsWarning = ({ message }) => (
    <div className="col-span-2 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-sm">
      <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
          {t("requiredFirst")}
        </span>
        <span className="text-[10px] text-amber-600 dark:text-amber-500">
          {message}
        </span>
      </div>
    </div>
  );

  const LookupSelect = ({ label, value, onChange, options, noOptionsKey }) => {
    const activeOptions = options.filter((o) => o.isActive).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return (
      <div>
        <label className={labelClass}>{label}</label>
        {activeOptions.length === 0 ? (
          <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-sm">
            <AlertTriangle size={12} className="text-amber-500 shrink-0" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              {t("noOptionsAvailable")}
            </span>
          </div>
        ) : (
          <select value={value} onChange={onChange} className={inputClass}>
            <option value="">{t("select")}</option>
            {activeOptions.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "basic") {
      return (
        <div className="grid grid-cols-2 gap-4">
          {hasNoCategories && (
            <NoOptionsWarning message={t("noCategoryWarning")} />
          )}
          <div className="col-span-2">
            <label className={labelClass}>{t("name")} *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder={t("productNamePlaceholder")}
            />
          </div>
          <div>
            <label className={labelClass}>{t("sku")} *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value.toUpperCase() })
              }
              className={inputClass}
              placeholder="e.g. EYE-001"
            />
          </div>
          <div>
            <label className={labelClass}>{t("category")} *</label>
            {hasNoCategories ? (
              <div className="flex items-center gap-2 p-2 border border-neutral-200 dark:border-neutral-700 rounded-sm bg-neutral-50 dark:bg-neutral-900">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  —
                </span>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className={inputClass}
              >
                <option value="">{t("selectCategory")}</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className={labelClass}>{t("gender")}</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={inputClass}
            >
              {["UNISEX", "MALE", "FEMALE", "KIDS"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("ageGroup")}</label>
            <select
              value={formData.ageGroup}
              onChange={(e) =>
                setFormData({ ...formData, ageGroup: e.target.value })
              }
              className={inputClass}
            >
              {["ADULT", "KIDS", "TEEN", "ALL"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>{t("description")}</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>{t("tags")}</label>
            <input
              type="text"
              value={formData.tags}
              placeholder={t("tagsPlaceholder")}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "media") {
      return (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
            <UploadCloud className="w-8 h-8 mb-2 text-neutral-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
              {t("clickToSelectImages")}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleSystemImageSelect}
            />
          </label>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative group rounded-sm overflow-hidden border-2 ${
                    img.isPrimary ? "border-[#E9B10C]" : "border-transparent"
                  }`}
                >
                  <SafeImage
                    src={img.url}
                    className="w-full h-28 object-cover bg-neutral-100"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className="px-3 py-1 bg-white text-black text-[8px] uppercase tracking-widest font-black rounded-sm hover:bg-[#E9B10C] transition-colors"
                    >
                      {t("setPrimary")}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-3 py-1 bg-red-500 text-white text-[8px] uppercase tracking-widest font-black rounded-sm hover:bg-red-600 transition-colors"
                    >
                      {t("remove")}
                    </button>
                  </div>
                  {img.isPrimary && (
                    <div className="absolute top-1 left-1 bg-[#E9B10C] text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Star size={8} className="fill-black" />
                      {t("primary")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "pricing") {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t("costPrice")} (&#xFDFC;) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) =>
                setFormData({ ...formData, costPrice: e.target.value })
              }
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>
              {t("sellingPrice")} (&#xFDFC;) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) =>
                setFormData({ ...formData, sellingPrice: e.target.value })
              }
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>{t("mrp")} (&#xFDFC;)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: e.target.value })
              }
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>{t("taxRate")} (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({ ...formData, taxRate: e.target.value })
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>{t("discount")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>{t("discountType")}</label>
            <select
              value={formData.discountType}
              onChange={(e) =>
                setFormData({ ...formData, discountType: e.target.value })
              }
              className={inputClass}
            >
              <option value="PERCENTAGE">{t("percentage")} (%)</option>
              <option value="FIXED">{t("fixedAmount")} (&#xFDFC;)</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeTab === "frameSpecs") {
      const allMissing = hasNoFrameShapes && hasNoFrameMaterials && hasNoFrameTypes;
      return (
        <div className="grid grid-cols-2 gap-4">
          {allMissing && (
            <NoOptionsWarning message={t("noFrameSpecsWarning")} />
          )}
          <LookupSelect
            label={t("frameShape")}
            value={formData.frameSpecs.frameShape}
            onChange={(e) =>
              handleNestedChange("frameSpecs", "frameShape", e.target.value)
            }
            options={frameShapes}
          />
          <LookupSelect
            label={t("frameMaterial")}
            value={formData.frameSpecs.frameMaterial}
            onChange={(e) =>
              handleNestedChange("frameSpecs", "frameMaterial", e.target.value)
            }
            options={frameMaterials}
          />
          <LookupSelect
            label={t("frameType")}
            value={formData.frameSpecs.frameType}
            onChange={(e) =>
              handleNestedChange("frameSpecs", "frameType", e.target.value)
            }
            options={frameTypes}
          />
          <div>
            <label className={labelClass}>{t("frameWidth")} (mm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.frameSpecs.frameWidth}
              onChange={(e) =>
                handleNestedChange("frameSpecs", "frameWidth", e.target.value)
              }
              className={inputClass}
              placeholder="e.g. 140"
            />
          </div>
        </div>
      );
    }

    if (activeTab === "lensSpecs") {
      const allMissing = hasNoLensTypes && hasNoLensMaterials;
      return (
        <div className="grid grid-cols-2 gap-4">
          {allMissing && (
            <NoOptionsWarning message={t("noLensSpecsWarning")} />
          )}
          <LookupSelect
            label={t("lensType")}
            value={formData.lensSpecs.lensType}
            onChange={(e) =>
              handleNestedChange("lensSpecs", "lensType", e.target.value)
            }
            options={lensTypes}
          />
          <LookupSelect
            label={t("lensMaterial")}
            value={formData.lensSpecs.lensMaterial}
            onChange={(e) =>
              handleNestedChange("lensSpecs", "lensMaterial", e.target.value)
            }
            options={lensMaterials}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editProduct") : t("addProduct")}
      maxWidth="max-w-3xl"
    >
      <div dir={isArabic ? "rtl" : "ltr"}>
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-5 gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTabIndex(idx)}
              className={`text-[9px] uppercase tracking-[0.2em] font-black px-3 pb-2 pt-1 border-b-2 whitespace-nowrap transition-all ${
                activeTabIndex === idx
                  ? "border-[#E9B10C] text-[#E9B10C]"
                  : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        <div className="min-h-[280px]">{renderTabContent()}</div>

        <div className="flex justify-between items-center gap-2 pt-5 mt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-2">
            {!isFirstTab && (
              <button
                type="button"
                onClick={() => setActiveTabIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-5 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
              >
                <ChevronLeft size={13} />
                {t("back")}
              </button>
            )}
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
          </div>

          <div className="flex gap-2">
            {!isLastTab && (
              <button
                type="button"
                onClick={() => setActiveTabIndex((prev) => prev + 1)}
                disabled={!canGoNext()}
                className={`flex items-center gap-1.5 px-5 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors rounded-sm ${
                  canGoNext()
                    ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {t("next")}
                <ChevronRight size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!saveAllowed}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 rounded-sm ${
                saveAllowed
                  ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};