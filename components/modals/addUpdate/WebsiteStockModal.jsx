"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWebsiteStock } from "@/redux/actions/inventoryActions"; 
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WebsiteStockModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const productsRaw = useSelector(state => state.products);
  const products = Array.isArray(productsRaw) ? productsRaw : productsRaw?.items || [];

  const [formData, setFormData] = useState({
    product: '', quantity: 0, websitePrice: 0, mrp: 0,
    isOnSale: false, salePrice: 0, isVisible: true
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...formData, ...initialData, product: initialData.product?._id || '' });
      else setFormData({ product: '', quantity: 0, websitePrice: 0, mrp: 0, isOnSale: false, salePrice: 0, isVisible: true });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product) return toast.error("Please select a product");
    setLoading(true);
    try {
      const payload = { ...formData };
      payload.quantity = Number(payload.quantity) || 0;
      payload.websitePrice = Number(payload.websitePrice) || 0;
      await dispatch(updateWebsiteStock(payload)).unwrap();
      toast.success(initialData ? 'Updated successfully' : 'Added successfully');
      onClose();
    } catch (err) { toast.error(typeof err === 'string' ? err : 'Operation failed'); } 
    finally { setLoading(false); }
  };
  
  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Website Stock" : t("addWebStock")} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {!initialData && (
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <label className={labelClass}>{t("product")} *</label>
            <select required value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className={inputClass}>
              <option value="">Choose...</option>{products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>{t("totalQty")}</label><input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Web Price</label><input type="number" value={formData.websitePrice} onChange={e => setFormData({...formData, websitePrice: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>MRP (Crossed Out)</label><input type="number" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} className={inputClass} /></div>
          <div className="col-span-2 pt-2 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="accent-[#E9B10C]" /><span className="text-[10px] font-bold uppercase">{t("visibility")}</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isOnSale} onChange={e => setFormData({...formData, isOnSale: e.target.checked})} className="accent-[#E9B10C]" /><span className="text-[10px] font-bold uppercase">On Sale</span></label>
          </div>
        </div>
        <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex gap-2">{loading ? <Loader2 className="animate-spin" size={14}/> : t("save")}</button></div>
      </form>
    </BaseModal>
  );
};