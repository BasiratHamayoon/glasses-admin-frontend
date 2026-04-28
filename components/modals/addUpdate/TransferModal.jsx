"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransfer } from "@/redux/actions/inventoryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

export const TransferModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // FETCHING REAL DATA FROM REDUX DATABASE STATE
  const { items: shops = [] } = useSelector(state => state.shops || { items: [] });
  const { items: products = [] } = useSelector(state => state.products || { items: [] });

  const [formData, setFormData] = useState({
    transferType: 'SHOP_TO_SHOP',
    fromShop: '',
    toShop: '',
    reason: 'STOCK_REPLENISHMENT',
    priority: 'NORMAL',
    requestNotes: '',
    items: [] // { product, requestedQuantity, notes }
  });

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', requestedQuantity: 1, notes: '' }]
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fromShop === formData.toShop) return toast.error("Source and destination must be different");
    if (formData.items.length === 0) return toast.error("Please add at least one item");

    setLoading(true);
    try {
      await dispatch(createTransfer(formData)).unwrap();
      toast.success('Transfer requested successfully');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create transfer');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Stock Transfer" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        
        {/* Header Config */}
        <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <label className={labelClass}>Transfer Type</label>
            <select required value={formData.transferType} onChange={e => setFormData({...formData, transferType: e.target.value})} className={inputClass}>
              <option value="SHOP_TO_SHOP">Shop to Shop</option>
              <option value="WAREHOUSE_TO_SHOP">Warehouse to Shop</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <select required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className={inputClass}>
              <option value="STOCK_REPLENISHMENT">Stock Replenishment</option>
              <option value="CUSTOMER_REQUEST">Customer Request</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>From Shop (Source)</label>
            <select required value={formData.fromShop} onChange={e => setFormData({...formData, fromShop: e.target.value})} className={inputClass}>
              <option value="">Select Shop...</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>To Shop (Destination)</label>
            <select required value={formData.toShop} onChange={e => setFormData({...formData, toShop: e.target.value})} className={inputClass}>
              <option value="">Select Shop...</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Dynamic Items List */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={labelClass}>Products to Transfer</label>
            <button type="button" onClick={handleAddItem} className="text-[9px] uppercase font-bold text-[#E9B10C] flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
              <Plus size={12} /> Add Product
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
            {formData.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-neutral-50 dark:bg-[#0a0a0a] p-2 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                <div className="flex-1">
                  <select required value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} className={inputClass}>
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <input type="number" required min="1" placeholder="Qty" value={item.requestedQuantity} onChange={e => updateItem(i, 'requestedQuantity', Number(e.target.value))} className={inputClass} />
                </div>
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
          <button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase font-bold bg-[#E9B10C] hover:bg-[#d4a00a] text-black rounded-sm flex items-center gap-2 transition-colors">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Request Transfer'}</button>
        </div>
      </form>
    </BaseModal>
  );
};