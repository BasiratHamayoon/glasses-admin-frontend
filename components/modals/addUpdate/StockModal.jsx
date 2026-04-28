"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStock } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const StockModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const productsRaw = useSelector(state => state.products);
  const products = Array.isArray(productsRaw) ? productsRaw : productsRaw?.items || [];

  const shopsRaw = useSelector(state => state.shops);
  const shops = Array.isArray(shopsRaw) ? shopsRaw : shopsRaw?.shops?.items || shopsRaw?.items || [];

  const [formData, setFormData] = useState({
    product: '', shop: '', quantity: 0, costPrice: 0, sellingPrice: 0, minStockLevel: 5
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          product: initialData.product?._id || '',
          shop: initialData.shop?._id || '',
          quantity: initialData.quantity || 0,
          costPrice: initialData.costPrice || 0,
          sellingPrice: initialData.sellingPrice || 0,
          minStockLevel: initialData.minStockLevel || 5
        });
      } else {
        setFormData({ product: '', shop: '', quantity: 0, costPrice: 0, sellingPrice: 0, minStockLevel: 5 });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.shop) return toast.error("Product and Shop are required");
    setLoading(true);
    try {
      await dispatch(updateStock(formData)).unwrap();
      toast.success(initialData ? 'Stock updated' : 'Stock added');
      onClose();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Operation failed');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Stock" : t("addShopStock")} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {!initialData && (
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <label className={labelClass}>{t("product")} *</label>
              <select required value={formData.product} onChange={e=>setFormData({...formData, product: e.target.value})} className={inputClass}>
                <option value="">Choose...</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("shop")} *</label>
              <select required value={formData.shop} onChange={e=>setFormData({...formData, shop: e.target.value})} className={inputClass}>
                <option value="">Choose...</option>
                {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>{t("totalQty")}</label><input type="number" required min="0" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: Number(e.target.value)})} className={inputClass} /></div>
          <div><label className={labelClass}>Min Stock Alert</label><input type="number" required min="0" value={formData.minStockLevel} onChange={e=>setFormData({...formData, minStockLevel: Number(e.target.value)})} className={inputClass} /></div>
          <div><label className={labelClass}>Cost Price</label><input type="number" required min="0" value={formData.costPrice} onChange={e=>setFormData({...formData, costPrice: Number(e.target.value)})} className={inputClass} /></div>
          <div><label className={labelClass}>{t("price")}</label><input type="number" required min="0" value={formData.sellingPrice} onChange={e=>setFormData({...formData, sellingPrice: Number(e.target.value)})} className={inputClass} /></div>
        </div>
        <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex gap-2">{loading ? <Loader2 className="animate-spin" size={14}/> : t("save")}</button></div>
      </form>
    </BaseModal>
  );
};