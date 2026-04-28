"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Loader2 } from "lucide-react";

export const CancelOrderModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim().length < 5) return;
    onConfirm(reason);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Cancel Order" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500">Reason for Cancellation *</label>
          <textarea 
            required 
            minLength={5}
            rows={4}
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            placeholder="Minimum 5 characters..."
            className="w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-3 text-[11px] font-medium outline-none rounded-sm focus:border-red-500 resize-none"
          />
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Abort</button>
          <button type="submit" disabled={loading || reason.trim().length < 5} className="px-6 py-2 bg-red-500 text-white text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-red-600 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Cancellation'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};