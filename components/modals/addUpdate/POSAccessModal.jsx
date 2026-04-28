"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { assignShopUser } from "@/redux/actions/shopActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const POSAccessModal = ({ isOpen, onClose, shopId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user: "", role: "CASHIER", accessLevel: "LIMITED",
    permissions: { canSell: true, canReturn: false, canDiscount: false, canDoDailyClosing: false }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(assignShopUser({ ...formData, shop: shopId })).unwrap();
      toast.success("Staff assigned to POS successfully!");
      onClose();
    } catch (err) { 
      toast.error(typeof err === 'string' ? err : err?.response?.data?.message || "Failed to assign staff"); 
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Assign POS Staff" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        
        <div>
          <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">User ObjectId *</label>
          <input type="text" required value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} className={inputClass} placeholder="Paste User ID here" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Shop Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass}>
              <option value="MANAGER">Manager</option><option value="CASHIER">Cashier</option><option value="SALES_STAFF">Sales Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Access Level</label>
            <select value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value})} className={inputClass}>
              <option value="FULL">Full Access</option><option value="LIMITED">Limited</option><option value="VIEW_ONLY">View Only</option>
            </select>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-2">
          <label className="block text-[9px] uppercase font-bold mb-3 text-neutral-500">Terminal Permissions</label>
          <div className="grid grid-cols-2 gap-y-4">
            {Object.keys(formData.permissions).map(key => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.permissions[key]} onChange={e => setFormData({...formData, permissions: {...formData.permissions, [key]: e.target.checked}})} className="w-3 h-3 accent-[#E9B10C]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{key.replace('can', '')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase font-bold bg-[#E9B10C] text-black rounded-sm flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Assign User"}
          </button>
        </div>

      </form>
    </BaseModal>
  );
};