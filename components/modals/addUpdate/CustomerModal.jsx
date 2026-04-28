"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createCustomer, updateCustomer } from "@/redux/actions/customerActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const CustomerModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "", gender: "MALE", source: "WALK_IN"
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...initialData, email: initialData.email || "" });
      else setFormData({ firstName: "", lastName: "", phone: "", email: "", gender: "MALE", source: "WALK_IN" });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.email) delete payload.email; // Clean empty emails
      payload.phone = payload.phone.replace(/\D/g, ''); // Clean phone

      if (initialData?._id) await dispatch(updateCustomer({ id: initialData._id, data: payload })).unwrap();
      else await dispatch(createCustomer(payload)).unwrap();
      
      toast.success(initialData ? "Customer updated" : "Customer created");
      onClose();
    } catch (err) { toast.error(typeof err === 'string' ? err : 'Operation failed'); } 
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Customer" : "Add Customer"} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>First Name *</label><input type="text" required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Last Name</label><input type="text" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Phone Number *</label><input type="text" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Email Address</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className={inputClass}>
              <option value="MALE">Male</option><option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Source</label>
            <select value={formData.source} onChange={e=>setFormData({...formData, source: e.target.value})} className={inputClass}>
              <option value="WALK_IN">Walk-In</option><option value="WEBSITE">Website</option><option value="REFERRAL">Referral</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800"><button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm flex gap-2">{loading ? <Loader2 className="animate-spin" size={14}/> : 'Save Customer'}</button></div>
      </form>
    </BaseModal>
  );
};