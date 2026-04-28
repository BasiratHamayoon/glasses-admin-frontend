"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ExpenseModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { items: shops = [] } = useSelector(state => state.shops?.shops || { items: [] });

  const [formData, setFormData] = useState({
    title: "", shop: "", category: "RENT", paymentMethod: "CASH", vendorName: "",
    amount: 0, taxPercentage: 0, description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: [{
          description: formData.title,
          quantity: 1,
          rate: formData.amount,
          amount: formData.amount,
          taxPercentage: formData.taxPercentage
        }]
      };

      // If Head Office (No Shop) is selected, remove the shop key entirely 
      // so Mongoose doesn't try to cast an empty string to an ObjectId.
      if (!payload.shop) {
        delete payload.shop;
      }

      await dispatch(createExpense(payload)).unwrap();
      toast.success('Expense Created Successfully');
      onClose();
    } catch (err) { 
      // Safely extract the string message from the error object to prevent React crashing
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.response?.data?.message 
          || err?.message 
          || 'Failed to create expense';
          
      toast.error(errorMessage); 
    } 
    finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log New Expense" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Title *</label>
            <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className={inputClass} />
          </div>
          
          <div>
            <label className={labelClass}>Shop (Optional)</label>
            <select value={formData.shop} onChange={e=>setFormData({...formData, shop:e.target.value})} className={inputClass}>
              <option value="">Head Office (No Shop)</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select required value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className={inputClass}>
              <option value="RENT">Rent</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="SALARY">Salary</option>
              <option value="INVENTORY">Inventory / Purchases</option>
              <option value="MARKETING">Marketing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Base Amount *</label>
            <input type="number" required min="1" value={formData.amount} onChange={e=>setFormData({...formData, amount:Number(e.target.value)})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tax Percentage (%)</label>
            <input type="number" min="0" value={formData.taxPercentage} onChange={e=>setFormData({...formData, taxPercentage:Number(e.target.value)})} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>
            <select required value={formData.paymentMethod} onChange={e=>setFormData({...formData, paymentMethod:e.target.value})} className={inputClass}>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Vendor Name</label>
            <input type="text" value={formData.vendorName} onChange={e=>setFormData({...formData, vendorName:e.target.value})} className={inputClass} />
          </div>
          
          <div className="col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows="2" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold border rounded-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Create Expense'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};