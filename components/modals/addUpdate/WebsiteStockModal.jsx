"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWebsiteStock } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const buildDefault = () => ({
  product: "",
  quantity: "",
  websitePrice: "",
  mrp: "",
  isOnSale: false,
  salePrice: "",
  isVisible: true,
});

export const WebsiteStockModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(buildDefault());

  const { inventoryProducts } = useSelector((state) => state.inventory);
  const products = inventoryProducts.items;

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        product: initialData.product?._id || initialData.product || "",
        quantity: initialData.quantity ?? "",
        websitePrice: initialData.websitePrice ?? "",
        mrp: initialData.mrp ?? "",
        isOnSale: initialData.isOnSale || false,
        salePrice: initialData.salePrice ?? "",
        isVisible: initialData.isVisible ?? true,
      });
    } else {
      setFormData(buildDefault());
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product) return toast.error(t("pleaseSelectProduct"));
    setLoading(true);
    try {
      const payload = {
        product: formData.product,
        quantity: Number(formData.quantity) || 0,
        websitePrice: Number(formData.websitePrice) || 0,
        mrp: Number(formData.mrp) || 0,
        isOnSale: formData.isOnSale,
        salePrice: Number(formData.salePrice) || 0,
        isVisible: formData.isVisible,
      };
      await dispatch(updateWebsiteStock(payload)).unwrap();
      toast.success(initialData ? t("stockUpdated") : t("stockAdded"));
      onClose(true);
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass =
    "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("updateWebStock") : t("addWebStock")}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!initialData && (
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <SearchableSelect
              label={`${t("product")} *`}
              value={formData.product}
              onChange={(val) => setFormData((prev) => ({ ...prev, product: val }))}
              options={products}
              placeholder={t("searchProduct")}
              required
              labelClass={labelClass}
              inputClass={inputClass}
              loading={inventoryProducts.loading}
            />
          </div>
        )}

        {initialData && (
          <div className="px-3 py-2 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
              {t("product")}
            </span>
            <p className="text-[11px] font-bold text-black dark:text-white mt-0.5">
              {initialData.product?.name || t("unknown")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("totalQty")}</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("webPrice")} (&#xFDFC;)</label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={formData.websitePrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, websitePrice: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("mrp")} (&#xFDFC;)</label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={formData.mrp}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mrp: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          {formData.isOnSale && (
            <div>
              <label className={labelClass}>{t("salePrice")} (&#xFDFC;)</label>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salePrice: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          )}
        </div>

        <div className="flex gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))
              }
              className="w-3 h-3 accent-[#E9B10C]"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
              {t("visibility")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOnSale}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isOnSale: e.target.checked }))
              }
              className="w-3 h-3 accent-[#E9B10C]"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
              {t("onSale")}
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
            className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : t("save")}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};