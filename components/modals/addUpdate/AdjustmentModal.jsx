"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { createAdjustment } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

export const AdjustmentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // FETCHING DYNAMIC DATA FROM REDUX (DATABASE)
  const { items: shops = [] } = useSelector(state => state.shops || { items: [] });
  const { items: products = [] } = useSelector(state => state.products || { items: [] });

  const [formData, setFormData] = useState({
    shop: '',
    adjustmentType: 'PHYSICAL_COUNT',
    reason: '',
    items: [] // { product, adjustedQuantity, reason }
  });

  const handleAddItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { product: '', adjustedQuantity: 0, reason: '' }] }));
  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };
  const removeItem = (index) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) return toast.error("Please add at least one product to adjust");

    setLoading(true);
    try {
      await dispatch(createAdjustment(formData)).unwrap();
      toast.success('Adjustment created successfully');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="New Stock Adjustment" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <label className="block text-[9px] font-bold mb-1.5 uppercase text-neutral-500">Shop</label>
            <select required value={formData.shop} onChange={e => setFormData({...formData, shop: e.target.value})} className={inputClass}>
              <option value="">Select Shop...</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold mb-1.5 uppercase text-neutral-500">Type</label>
            <select required value={formData.adjustmentType} onChange={e => setFormData({...formData, adjustmentType: e.target.value})} className={inputClass}>
              <option value="PHYSICAL_COUNT">Physical Count</option>
              <option value="DAMAGE">Damage</option>
              <option value="THEFT">Theft / Missing</option>
              <option value="EXPIRED">Expired</option>
              <option value="CORRECTION">Correction</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[9px] font-bold mb-1.5 uppercase text-neutral-500">General Reason</label>
            <input type="text" required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className={inputClass} placeholder="e.g. Monthly stock audit" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[9px] font-bold uppercase text-neutral-500">Products to Adjust</label>
            <button type="button" onClick={handleAddItem} className="text-[9px] uppercase font-bold text-[#E9B10C] hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
              <Plus size={12} /> Add Product
            </button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
            {formData.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center bg-neutral-50 dark:bg-[#0a0a0a] p-2 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <select required value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} className={`${inputClass} flex-1`}>
                  <option value="">Select Product...</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                </select>
                <input type="number" required placeholder="New Qty" min="0" value={item.adjustedQuantity} onChange={e => updateItem(i, 'adjustedQuantity', Number(e.target.value))} className={`${inputClass} w-24`} />
                <button type="button" onClick={() => removeItem(i)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.items.length === 0 && (
              <div className="text-center p-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                No products added yet.
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-6 py-2 text-[10px] uppercase font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase font-bold bg-[#E9B10C] hover:bg-[#d4a00a] text-black rounded-sm flex items-center gap-2 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Create Adjustment'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};