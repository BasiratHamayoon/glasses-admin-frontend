"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignShopStaff } from "@/redux/actions/shopActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AssignStaffModal = ({ isOpen, onClose, shopId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Grab the global employee list so we can select them
  const employees = useSelector(state => state.employees?.items || []);
  
  // Filter only employees who actually have user login accounts created
  const eligibleEmployees = employees.filter(emp => emp.user);

  const [formData, setFormData] = useState({
    employeeId: "", userId: "", role: "CASHIER", isPrimary: true
  });

  const handleEmployeeSelect = (empId) => {
    const selectedEmp = employees.find(e => e._id === empId);
    setFormData({
      ...formData,
      employeeId: selectedEmp?._id || "",
      userId: selectedEmp?.user?._id || "" // Backend requires the User ObjectId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) return toast.error("Selected employee does not have a user account.");
    
    setLoading(true);
    try {
      await dispatch(assignShopStaff({ shopId, data: formData })).unwrap();
      toast.success("Staff assigned to shop successfully!");
      onClose();
    } catch (err) { 
      toast.error(typeof err === 'string' ? err : "Failed to assign staff"); 
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Assign Staff to Shop" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        
        <div>
          <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Select Employee *</label>
          <select required value={formData.employeeId} onChange={e => handleEmployeeSelect(e.target.value)} className={inputClass}>
            <option value="">-- Choose Employee --</option>
            {eligibleEmployees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.designation})</option>
            ))}
          </select>
          <p className="text-[8px] text-neutral-500 mt-1">Only employees with generated Login Accounts appear here.</p>
        </div>
        
        <div>
          <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Shop Role</label>
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass}>
            <option value="MANAGER">Manager</option>
            <option value="CASHIER">Cashier</option>
            <option value="SALES_STAFF">Sales Staff</option>
            <option value="OPTOMETRIST">Optometrist</option>
          </select>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          <button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase font-bold bg-[#E9B10C] text-black rounded-sm flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Assign Staff"}
          </button>
        </div>

      </form>
    </BaseModal>
  );
};