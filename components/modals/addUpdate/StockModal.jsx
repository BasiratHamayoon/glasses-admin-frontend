"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStock } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2, Search, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function SearchableSelect({ label, value, onChange, options, placeholder, required, labelClass, inputClass }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find(opt => opt._id === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.code && opt.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${inputClass} flex items-center justify-between gap-2 text-left cursor-pointer min-h-[36px]`}
        >
          <span className={selectedOption ? "text-black dark:text-white" : "text-neutral-400"}>
            {selectedOption ? selectedOption.name : placeholder || "Choose..."}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === "Enter") handleClear(e); }}
                className="hover:text-red-500 transition-colors p-0.5"
              >
                <X size={12} />
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${label.replace(" *", "")}...`}
                  className="w-full pl-7 pr-3 py-1.5 text-[10px] font-bold bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-700 rounded-sm outline-none focus:border-[#E9B10C] transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                  No results found
                </div>
              ) : (
                filteredOptions.map(opt => (
                  <button
                    key={opt._id}
                    type="button"
                    onClick={() => handleSelect(opt._id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold transition-colors text-left ${value === opt._id ? "bg-[#E9B10C]/10 text-[#E9B10C]" : "hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-black dark:text-white"}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{opt.name}</div>
                      {opt.code && (
                        <div className="text-[9px] text-neutral-400 font-medium truncate">{opt.code}</div>
                      )}
                    </div>
                    {value === opt._id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E9B10C] shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {required && <input type="text" value={value} onChange={() => {}} required className="sr-only" tabIndex={-1} />}
      </div>
    </div>
  );
}

export const StockModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const productsRaw = useSelector(state => state.products);
  const products = Array.isArray(productsRaw) ? productsRaw : productsRaw?.items || [];

  const shopsRaw = useSelector(state => state.shops);
  const shops = Array.isArray(shopsRaw) ? shopsRaw : shopsRaw?.shops?.items || shopsRaw?.items || [];

  const [formData, setFormData] = useState({
    product: "",
    shop: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    minStockLevel: 5
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          product: initialData.product?._id || "",
          shop: initialData.shop?._id || "",
          quantity: initialData.quantity || 0,
          costPrice: initialData.costPrice || 0,
          sellingPrice: initialData.sellingPrice || 0,
          minStockLevel: initialData.minStockLevel || 5
        });
      } else {
        setFormData({
          product: "",
          shop: "",
          quantity: 0,
          costPrice: 0,
          sellingPrice: 0,
          minStockLevel: 5
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.shop) return toast.error("Product and Shop are required");
    setLoading(true);
    try {
      await dispatch(updateStock(formData)).unwrap();
      toast.success(initialData ? "Stock updated" : "Stock added");
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Stock" : t("addShopStock")} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {!initialData && (
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <SearchableSelect
              label={`${t("product")} *`}
              value={formData.product}
              onChange={(val) => setFormData({ ...formData, product: val })}
              options={products}
              placeholder="Search product..."
              required
              labelClass={labelClass}
              inputClass={inputClass}
            />
            <SearchableSelect
              label={`${t("shop")} *`}
              value={formData.shop}
              onChange={(val) => setFormData({ ...formData, shop: val })}
              options={shops}
              placeholder="Search shop..."
              required
              labelClass={labelClass}
              inputClass={inputClass}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("totalQty")}</label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Min Stock Alert</label>
            <input
              type="number"
              required
              min="0"
              value={formData.minStockLevel}
              onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cost Price</label>
            <input
              type="number"
              required
              min="0"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("price")}</label>
            <input
              type="number"
              required
              min="0"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm mr-2"
          >
            {t("cancel") || "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : t("save") || "Save"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};