"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShift, updateShift } from "@/redux/actions/employeeActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ShiftModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const shops = useSelector(state => state.shops?.shops?.items || []);

  const [formData, setFormData] = useState({
    name: "", code: "", description: "", shop: "",
    startTime: "", endTime: "", breakDuration: 60,
    lateGracePeriod: 15, earlyLeaveGracePeriod: 15, halfDayHours: 4,
    overtimeEnabled: false, overtimeRate: 1.5, minOvertimeHours: 1,
    applicableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...formData, ...initialData, shop: initialData.shop?._id || "" });
      else setFormData({ ...formData, name: "", code: "", startTime: "", endTime: "", shop: "" });
    }
  }, [isOpen, initialData]);

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      applicableDays: prev.applicableDays.includes(day)
        ? prev.applicableDays.filter(d => d !== day)
        : [...prev.applicableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.shop) delete payload.shop; // Universal shift if no shop
      if (!payload.code) delete payload.code; // Backend auto-generates if empty

      if (initialData?._id) {
        await dispatch(updateShift({ id: initialData._id, data: payload })).unwrap();
        toast.success("Shift updated successfully");
      } else {
        await dispatch(createShift(payload)).unwrap();
        toast.success("Shift created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Failed to save shift");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Shift" : "Create Shift"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className={labelClass}>Shift Name *</label><input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="e.g. Morning Shift" /></div>
          
          <div><label className={labelClass}>Start Time *</label><input type="time" required value={formData.startTime} onChange={e=>setFormData({...formData, startTime: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>End Time *</label><input type="time" required value={formData.endTime} onChange={e=>setFormData({...formData, endTime: e.target.value})} className={inputClass} /></div>
          
          <div><label className={labelClass}>Break Duration (Mins)</label><input type="number" min="0" value={formData.breakDuration} onChange={e=>setFormData({...formData, breakDuration: Number(e.target.value)})} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Assign to Shop</label>
            <select value={formData.shop} onChange={e=>setFormData({...formData, shop: e.target.value})} className={inputClass}>
              <option value="">Universal (All Shops)</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <label className={labelClass}>Applicable Days</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
              <button type="button" key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm border transition-colors ${formData.applicableDays.includes(day) ? 'bg-[#E9B10C] text-black border-[#E9B10C]' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'}`}>
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold border rounded-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Shift'}</button>
        </div>
      </form>
    </BaseModal>
  );
};