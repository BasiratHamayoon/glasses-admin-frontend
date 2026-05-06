"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransfer } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const TRANSFER_TYPES = ["SHOP_TO_SHOP", "WAREHOUSE_TO_SHOP", "SHOP_TO_WAREHOUSE", "RETURN"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];
const REASONS = [
  "STOCK_REPLENISHMENT", "CUSTOMER_REQUEST", "INTER_SHOP_BALANCE",
  "RETURN_DAMAGED", "RETURN_EXCESS", "OTHER",
];

const buildDefault = () => ({
  fromShop: "",
  toShop: "",
  transferType: "SHOP_TO_SHOP",
  priority: "NORMAL",
  reason: "STOCK_REPLENISHMENT",
  requestNotes: "",
  items: [{ product: "", requestedQuantity: "" }],
});

export const TransferModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(buildDefault());

  const { inventoryProducts, inventoryShops } = useSelector(
    (state) => state.inventory
  );
  const products = inventoryProducts.items;
  const shops = inventoryShops.items;

  useEffect(() => {
    if (isOpen) {
      setFormData(buildDefault());
    }
  }, [isOpen]);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", requestedQuantity: "" }],
    }));
  };

  const removeItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromShop || !formData.toShop)
      return toast.error(t("bothShopsRequired"));
    if (formData.fromShop === formData.toShop)
      return toast.error(t("shopsCannotBeSame"));
    if (formData.items.some((item) => !item.product || !item.requestedQuantity))
      return toast.error(t("allItemsRequired"));

    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: formData.items.map((item) => ({
          ...item,
          requestedQuantity: Number(item.requestedQuantity),
        })),
      };
      await dispatch(createTransfer(payload)).unwrap();
      toast.success(t("transferCreated"));
      onClose(true);
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C] transition-colors";
  const labelClass =
    "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={t("newTransfer")}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SearchableSelect
            label={`${t("fromShop")} *`}
            value={formData.fromShop}
            onChange={(val) => setFormData((prev) => ({ ...prev, fromShop: val }))}
            options={shops}
            placeholder={t("selectShop")}
            required
            labelClass={labelClass}
            inputClass={inputClass}
            loading={inventoryShops.loading}
            excludeId={formData.toShop}
          />
          <SearchableSelect
            label={`${t("toShop")} *`}
            value={formData.toShop}
            onChange={(val) => setFormData((prev) => ({ ...prev, toShop: val }))}
            options={shops}
            placeholder={t("selectShop")}
            required
            labelClass={labelClass}
            inputClass={inputClass}
            loading={inventoryShops.loading}
            excludeId={formData.fromShop}
          />
          <div>
            <label className={labelClass}>{t("transferType")} *</label>
            <select
              required
              value={formData.transferType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, transferType: e.target.value }))
              }
              className={inputClass}
            >
              {TRANSFER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("priority")}</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("reason")} *</label>
            <select
              required
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              className={inputClass}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("notes")}</label>
            <input
              type="text"
              value={formData.requestNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, requestNotes: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">
              {t("items")}
            </span>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9B10C] text-black text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-[#d4a00a] transition-colors"
            >
              <Plus size={12} strokeWidth={3} />
              {t("addItem")}
            </button>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {formData.items.map((item, idx) => (
              <div key={idx} className="p-4 grid grid-cols-12 gap-3 items-end">
                <div className="col-span-8">
                  <SearchableSelect
                    label={`${t("product")} *`}
                    value={item.product}
                    onChange={(val) => updateItem(idx, "product", val)}
                    options={products}
                    placeholder={t("searchProduct")}
                    required
                    labelClass={labelClass}
                    inputClass={inputClass}
                    loading={inventoryProducts.loading}
                  />
                </div>
                <div className="col-span-3">
                  <label className={labelClass}>{t("quantity")} *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    inputMode="numeric"
                    value={item.requestedQuantity}
                    onChange={(e) =>
                      updateItem(idx, "requestedQuantity", e.target.value)
                    }
                    className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                </div>
                <div className="col-span-1 flex justify-end pb-0.5">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              t("createTransfer")
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};