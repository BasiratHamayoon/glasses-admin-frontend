"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateCashFlow, generateProfitLoss } from "@/redux/actions/financeActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const GenerateReportModal = ({ isOpen, onClose, reportType, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const shops = useSelector(state => state.shops?.shops?.items || []);

  const [formData, setFormData] = useState({
    shop: "", 
    period: "MONTHLY",
    startDate: "",
    endDate: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 FIX: The backend Joi schema requires startDate and endDate for EVERY request.
    if (!formData.startDate || !formData.endDate) {
      return toast.error("Start Date and End Date are required.");
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return toast.error("Start Date cannot be after End Date.");
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.shop) delete payload.shop; // Remove if "All Shops" is selected

      if (reportType === 'CASH_FLOW') {
        await dispatch(generateCashFlow(payload)).unwrap();
      } else {
        await dispatch(generateProfitLoss(payload)).unwrap();
      }
      
      toast.success(`${reportType.replace('_', ' ')} Report Generated Successfully`);
      onSuccess(); 
      onClose();
    } catch (err) { 
      console.error("Backend Validation Error:", err);
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.response?.data?.message 
          || err?.message 
          || 'Failed to generate report. Check dates.';
          
      toast.error(errorMessage); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Generate ${reportType === 'CASH_FLOW' ? 'Cash Flow' : 'Profit & Loss'} Report`}>
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        
        <div>
          <label className={labelClass}>Select Shop</label>
          <select value={formData.shop} onChange={e => setFormData({...formData, shop: e.target.value})} className={inputClass}>
            <option value="">All Shops (Consolidated Report)</option>
            {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Reporting Period Label</label>
          <select value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className={inputClass}>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom Range</option>
          </select>
        </div>

        {/* 🔥 FIX: Dates are now ALWAYS visible and required */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date *</label>
            <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Date *</label>
            <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Generate'}
          </button>
        </div>

      </form>
    </BaseModal>
  );
};