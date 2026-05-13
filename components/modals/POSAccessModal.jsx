"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { assignShopUser, fetchShopUsers } from "@/redux/actions/posAccessActions";
import { BaseModal } from "@/components/modals/BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const POSAccessModal = ({ isOpen, onClose, shopId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user: "", role: "CASHIER", accessLevel: "LIMITED",
    permissions: { canSell: true, canReturn: false, canRefund: false, canDiscount: false, canAccessCash: false }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(assignShopUser({ ...formData, shop: shopId })).unwrap();
      toast.success("User assigned to POS successfully!");
      await dispatch(fetchShopUsers(shopId));
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to assign user");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] text-black dark:text-white border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none focus:border-[#E9B10C] transition-colors rounded-sm";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Assign POS Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">User ID</label>
          <input type="text" required value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} className={inputClass} placeholder="Enter User ObjectId" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass}>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
              <option value="SALES_STAFF">Sales Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold mb-1.5 text-neutral-500">Access Level</label>
            <select value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value})} className={inputClass}>
              <option value="FULL">Full</option>
              <option value="LIMITED">Limited</option>
              <option value="VIEW_ONLY">View Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          {Object.keys(formData.permissions).map(key => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.permissions[key]} onChange={e => setFormData({...formData, permissions: {...formData.permissions, [key]: e.target.checked}})} className="w-3 h-3 accent-[#E9B10C]" />
              <span className="text-[10px] font-bold uppercase">{key.replace('can', '')}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase font-bold bg-[#E9B10C] text-black rounded-sm">{loading ? <Loader2 size={14} className="animate-spin" /> : "Assign User"}</button></div>
      </form>
    </BaseModal>
  );
};