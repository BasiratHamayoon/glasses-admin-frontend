"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkCalculateSalary } from "@/redux/actions/salaryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const CalculateSalaryModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Safe extraction of shops for the dropdown
  const shops = useSelector(state => state.shops?.shops?.items || []);

  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    shopId: "" // Empty means ALL shops
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔥 FIX: Strictly parse to integers for Mongoose/Joi validation
      const payload = {
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10)
      };

      // 🔥 FIX: Only attach shopId if it actually contains a valid MongoDB ObjectId
      if (formData.shopId && formData.shopId.trim() !== "") {
        payload.shopId = formData.shopId;
      }

      console.log("Sending Bulk Calculate Payload:", payload); // Debugging

      const res = await dispatch(bulkCalculateSalary(payload)).unwrap();
      
      toast.success(`Success: ${res.success || 0} Calculated | Failed: ${res.failed || 0}`);
      onSuccess(); // This instantly triggers loadData() to refresh the table!
      onClose();

    } catch (err) { 
      console.error("Calculation Error:", err);
      // 🔥 Safe error extraction for Sonner Toast
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.response?.data?.message 
          || err?.message 
          || 'Calculation failed. Please check backend logs.';
          
      toast.error(errorMessage); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Run Payroll Calculation">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Month *</label>
            <select required value={formData.month} onChange={e=>setFormData({...formData, month: e.target.value})} className={inputClass}>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={labelClass}>Year *</label>
            <input type="number" required min="2000" max="2100" value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})} className={inputClass} />
          </div>
          
          <div className="col-span-2">
            <label className={labelClass}>Target Shop (Optional)</label>
            <select value={formData.shopId} onChange={e=>setFormData({...formData, shopId: e.target.value})} className={inputClass}>
              <option value="">All Shops (Company Wide)</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <p className="text-[9px] text-neutral-500 mt-1">Leave empty to calculate payroll for all employees across the entire company.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm mr-2 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Run Calculation'}
          </button>
        </div>

      </form>
    </BaseModal>
  );
};