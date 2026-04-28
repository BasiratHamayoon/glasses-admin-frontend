"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSalaryStructure, updateSalaryStructure } from "@/redux/actions/salaryActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const SalaryStructureModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const defaultForm = {
    name: "", code: "", description: "", basicSalary: 0,
    workingDaysPerMonth: 26, workingHoursPerDay: 8, isActive: true,
    allowances: { hra: 0, da: 0, ta: 0, medical: 0, special: 0, other: 0 },
    deductions: { pf: 0, esi: 0, professionalTax: 0, tds: 0, other: 0 },
    commissionEnabled: false, commissionType: 'PERCENTAGE', commissionRate: 0,
    overtimeEnabled: false, overtimeRatePerHour: 0
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...defaultForm, ...initialData });
      else setFormData(defaultForm);
      setActiveTab('basic');
    }
  }, [isOpen, initialData]);

  const handleNested = (group, field, value) => {
    setFormData(prev => ({ ...prev, [group]: { ...prev[group], [field]: Number(value) } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (initialData?._id) await dispatch(updateSalaryStructure({ id: initialData._id, data: payload })).unwrap();
      else await dispatch(createSalaryStructure(payload)).unwrap();
      toast.success('Salary structure saved successfully');
      onClose();
    } catch (err) { toast.error(typeof err === 'string' ? err : 'Failed to save structure'); } 
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Salary Structure" : "New Salary Structure"} maxWidth="max-w-2xl">
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4 overflow-x-auto scrollbar-hide">
        {['basic', 'allowances', 'deductions', 'policies'].map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[#E9B10C] text-[#E9B10C]' : 'border-transparent text-neutral-500'}`}>{tab}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelClass}>Structure Name *</label><input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Code (Auto-generated if empty)</label><input type="text" value={formData.code} onChange={e=>setFormData({...formData, code:e.target.value})} className={`${inputClass} uppercase`} /></div>
            <div><label className={labelClass}>Basic Salary *</label><input type="number" required min="0" value={formData.basicSalary} onChange={e=>setFormData({...formData, basicSalary:Number(e.target.value)})} className={inputClass} /></div>
            <div><label className={labelClass}>Working Days/Month</label><input type="number" min="1" max="31" value={formData.workingDaysPerMonth} onChange={e=>setFormData({...formData, workingDaysPerMonth:Number(e.target.value)})} className={inputClass} /></div>
            <div><label className={labelClass}>Working Hours/Day</label><input type="number" min="1" max="24" value={formData.workingHoursPerDay} onChange={e=>setFormData({...formData, workingHoursPerDay:Number(e.target.value)})} className={inputClass} /></div>
            <div className="col-span-2"><label className={labelClass}>Description</label><textarea rows="2" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className={inputClass} /></div>
          </div>
        )}
        {activeTab === 'allowances' && (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(defaultForm.allowances).map(key => (
              <div key={key}><label className={labelClass}>{key.toUpperCase()}</label><input type="number" min="0" value={formData.allowances[key]} onChange={e=>handleNested('allowances', key, e.target.value)} className={inputClass} /></div>
            ))}
          </div>
        )}
        {activeTab === 'deductions' && (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(defaultForm.deductions).map(key => (
              <div key={key}><label className={labelClass}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label><input type="number" min="0" value={formData.deductions[key]} onChange={e=>handleNested('deductions', key, e.target.value)} className={inputClass} /></div>
            ))}
          </div>
        )}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            <div className="p-4 border rounded-sm">
              <label className="flex items-center gap-2 cursor-pointer mb-4"><input type="checkbox" checked={formData.overtimeEnabled} onChange={e=>setFormData({...formData, overtimeEnabled: e.target.checked})} className="accent-[#E9B10C]" /><span className="text-[10px] font-bold uppercase tracking-widest">Enable Overtime Pay</span></label>
              {formData.overtimeEnabled && <div><label className={labelClass}>Overtime Rate (Per Hour)</label><input type="number" min="0" value={formData.overtimeRatePerHour} onChange={e=>setFormData({...formData, overtimeRatePerHour:Number(e.target.value)})} className={inputClass} /></div>}
            </div>
            <div className="p-4 border rounded-sm">
              <label className="flex items-center gap-2 cursor-pointer mb-4"><input type="checkbox" checked={formData.commissionEnabled} onChange={e=>setFormData({...formData, commissionEnabled: e.target.checked})} className="accent-[#E9B10C]" /><span className="text-[10px] font-bold uppercase tracking-widest">Enable Commission</span></label>
              {formData.commissionEnabled && <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Commission Type</label><select value={formData.commissionType} onChange={e=>setFormData({...formData, commissionType:e.target.value})} className={inputClass}><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed</option></select></div><div><label className={labelClass}>Rate / Amount</label><input type="number" min="0" value={formData.commissionRate} onChange={e=>setFormData({...formData, commissionRate:Number(e.target.value)})} className={inputClass} /></div></div>}
            </div>
          </div>
        )}
        <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Structure'}</button></div>
      </form>
    </BaseModal>
  );
};