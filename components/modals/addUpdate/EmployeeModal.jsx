"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, createEmployeeWithUser, updateEmployee } from "@/redux/actions/employeeActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const EmployeeModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Extract Shops and Shifts from Redux state for the dropdowns
  const shops = useSelector(state => state.shops?.shops?.items || []);
  const shifts = useSelector(state => state.employees?.shifts?.items || []);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    designation: "", department: "SALES", primaryShop: "", 
    defaultShift: "", // 🔥 ADDED SHIFT STATE
    createAccount: false, password: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          firstName: initialData.firstName, 
          lastName: initialData.lastName || "",
          phone: initialData.phone, 
          email: initialData.email || "",
          designation: initialData.designation, 
          department: initialData.department,
          primaryShop: initialData.primaryShop?._id || "",
          defaultShift: initialData.defaultShift?._id || "", // 🔥 PRE-FILL SHIFT
          createAccount: false, password: ""
        });
      } else {
        setFormData({
          firstName: "", lastName: "", phone: "", email: "", designation: "", 
          department: "SALES", primaryShop: "", defaultShift: "", 
          createAccount: false, password: ""
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      
      // Clean empty ObjectIds so Mongoose doesn't crash
      if (!payload.primaryShop) delete payload.primaryShop;
      if (!payload.defaultShift) delete payload.defaultShift; // 🔥 CLEAN SHIFT
      if (!payload.lastName) delete payload.lastName;

      // Clean phone numbers for Joi validation (numbers only)
      if (payload.phone) payload.phone = payload.phone.replace(/\D/g, '');

      if (initialData?._id) {
        await dispatch(updateEmployee({ id: initialData._id, data: payload })).unwrap();
        toast.success("Employee updated successfully");
      } else {
        if (formData.createAccount) {
          if (!formData.email || !formData.password) return toast.error("Email & Password required for Login Account");
          await dispatch(createEmployeeWithUser(payload)).unwrap();
          toast.success("Employee & System Account created successfully");
        } else {
          await dispatch(createEmployee(payload)).unwrap();
          toast.success("Employee created successfully");
        }
      }
      onClose();
    } catch (err) { 
      const errorMessage = typeof err === 'string' ? err : err?.response?.data?.message || err?.message || 'Operation failed';
      toast.error(errorMessage); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-medium outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Employee" : "Add Employee"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        
        {/* Basic Info */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Personal & Contact</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>First Name *</label><input type="text" required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Last Name</label><input type="text" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Phone *</label><input type="text" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Email Address</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
          </div>
        </div>

        {/* Work Info */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Employment Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Job Title / Designation *</label><input type="text" required placeholder="e.g. Senior Cashier" value={formData.designation} onChange={e=>setFormData({...formData, designation: e.target.value})} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Department</label>
              <select value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} className={inputClass}>
                <option value="SALES">Sales</option><option value="OPTOMETRY">Optometry</option><option value="OPERATIONS">Operations</option><option value="ACCOUNTS">Accounts</option><option value="MANAGEMENT">Management</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Primary Shop Assignment</label>
              <select value={formData.primaryShop} onChange={e=>setFormData({...formData, primaryShop: e.target.value})} className={inputClass}>
                <option value="">Head Office / Unassigned</option>
                {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            {/* 🔥 ADDED SHIFT DROPDOWN */}
            <div>
              <label className={labelClass}>Assign Shift</label>
              <select value={formData.defaultShift} onChange={e=>setFormData({...formData, defaultShift: e.target.value})} className={inputClass}>
                <option value="">No Specific Shift</option>
                {shifts.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* System Access (Only on Create) */}
        {!initialData && (
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input type="checkbox" checked={formData.createAccount} onChange={e=>setFormData({...formData, createAccount: e.target.checked})} className="accent-[#E9B10C] w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Create System Login Account</span>
            </label>
            {formData.createAccount && (
              <div className="grid grid-cols-1">
                <label className={labelClass}>Assign Password *</label>
                <input type="password" required={formData.createAccount} minLength={6} value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className={inputClass} placeholder="Minimum 6 characters" />
                <span className="text-[8px] text-neutral-500 mt-1">They will log in using the Email Address provided above.</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Employee'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};