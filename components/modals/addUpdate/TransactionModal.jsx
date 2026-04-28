"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const TransactionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { items: shops = [] } = useSelector(state => state.shops?.shops || { items: [] });

  const [formData, setFormData] = useState({
    type: "CREDIT", category: "SALE", paymentMethod: "CASH", 
    amount: 0, description: "", shop: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.shop) delete payload.shop; // Remove if Head Office

      await dispatch(createTransaction(payload)).unwrap();
      toast.success('Transaction Created Successfully');
      onClose();
    } catch (err) { 
      const errorMessage = typeof err === 'string' ? err : err?.response?.data?.message || err?.message || 'Failed to create transaction';
      toast.error(errorMessage); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log Manual Transaction" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type *</label>
            <select required value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})} className={inputClass}>
              <option value="CREDIT">Money In (Credit)</option>
              <option value="DEBIT">Money Out (Debit)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select required value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className={inputClass}>
              <option value="SALE">Sale</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="EXPENSE">Expense</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Payment Method *</label>
            <select required value={formData.paymentMethod} onChange={e=>setFormData({...formData, paymentMethod:e.target.value})} className={inputClass}>
              <option value="CASH">Cash</option><option value="CARD">Card</option>
              <option value="UPI">UPI</option><option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Shop (Optional)</label>
            <select value={formData.shop} onChange={e=>setFormData({...formData, shop:e.target.value})} className={inputClass}>
              <option value="">Head Office</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Amount *</label>
            <input type="number" required min="1" value={formData.amount} onChange={e=>setFormData({...formData, amount:Number(e.target.value)})} className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea rows="2" required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className={inputClass} placeholder="Reason for transaction..." />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold border rounded-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Log Transaction'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};