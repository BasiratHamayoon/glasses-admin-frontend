"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPrescription } from "@/redux/actions/customerActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const PrescriptionModal = ({ isOpen, onClose, customer }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { items: shops = [] } = useSelector(state => state.shops?.shops || { items: [] });
  const [activeTab, setActiveTab] = useState('eyes');

  const defaultEye = { spherical: 0, cylindrical: 0, axis: 0, add: 0, pd: "" };
  
  const [formData, setFormData] = useState({
    type: "DISTANCE",
    rightEye: { ...defaultEye },
    leftEye: { ...defaultEye },
    pd: "", shop: "", doctorName: "", clinicName: "", notes: ""
  });

  const handleEyeChange = (eye, field, value) => {
    setFormData(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: Number(value) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create a deep copy of formData
      const payload = JSON.parse(JSON.stringify(formData));
      
      // 2. Strip empty shop if external
      if (!payload.shop) delete payload.shop; 

      // 3. Attach Customer ID
      payload.customer = customer._id;

      // 🔥 FIX: Clean up the Eye Objects so empty strings don't crash Joi validation
      const cleanEye = (eyeObj) => {
        Object.keys(eyeObj).forEach(key => {
          // If the user left it completely empty, delete the key entirely
          if (eyeObj[key] === "" || eyeObj[key] === null) {
            delete eyeObj[key];
          } else {
            // Otherwise, ensure it is parsed as a true Number
            eyeObj[key] = Number(eyeObj[key]);
          }
        });
        return Object.keys(eyeObj).length > 0 ? eyeObj : undefined;
      };

      if (payload.rightEye) payload.rightEye = cleanEye(payload.rightEye);
      if (payload.leftEye) payload.leftEye = cleanEye(payload.leftEye);
      
      // Clean overall PD if empty
      if (payload.pd === "" || payload.pd === null) {
        delete payload.pd;
      } else {
        payload.pd = Number(payload.pd);
      }

      await dispatch(createPrescription(payload)).unwrap();
      toast.success("Prescription added successfully");
      onClose();
    } catch (err) { 
      const errorMessage = typeof err === 'string' ? err : err?.response?.data?.message || err?.message || 'Failed to save prescription';
      toast.error(errorMessage); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C]";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  if (!customer) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Add Prescription: ${customer.firstName}`} maxWidth="max-w-2xl">
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4">
        {['eyes', 'details'].map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-[#E9B10C] text-[#E9B10C]' : 'border-transparent text-neutral-500'}`}>
            {tab === 'eyes' ? 'Eye Powers' : 'Clinic Details'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {activeTab === 'eyes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prescription Type</label>
                <select required value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className={inputClass}>
                  <option value="DISTANCE">Distance</option><option value="NEAR">Near / Reading</option><option value="BIFOCAL">Bifocal</option><option value="PROGRESSIVE">Progressive</option><option value="CONTACT_LENS">Contact Lens</option>
                </select>
              </div>
              <div><label className={labelClass}>Total PD (Pupillary Distance)</label><input type="number" value={formData.pd} onChange={e=>setFormData({...formData, pd: Number(e.target.value)})} className={inputClass} /></div>
            </div>

            {/* Right Eye (OD) */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-3">Right Eye (OD)</h4>
              <div className="grid grid-cols-4 gap-2">
                <div><label className={labelClass}>SPH</label><input type="number" step="0.25" value={formData.rightEye.spherical} onChange={e=>handleEyeChange('rightEye', 'spherical', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>CYL</label><input type="number" step="0.25" value={formData.rightEye.cylindrical} onChange={e=>handleEyeChange('rightEye', 'cylindrical', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>AXIS</label><input type="number" value={formData.rightEye.axis} onChange={e=>handleEyeChange('rightEye', 'axis', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>ADD</label><input type="number" step="0.25" value={formData.rightEye.add} onChange={e=>handleEyeChange('rightEye', 'add', e.target.value)} className={inputClass} /></div>
              </div>
            </div>

            {/* Left Eye (OS) */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-3">Left Eye (OS)</h4>
              <div className="grid grid-cols-4 gap-2">
                <div><label className={labelClass}>SPH</label><input type="number" step="0.25" value={formData.leftEye.spherical} onChange={e=>handleEyeChange('leftEye', 'spherical', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>CYL</label><input type="number" step="0.25" value={formData.leftEye.cylindrical} onChange={e=>handleEyeChange('leftEye', 'cylindrical', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>AXIS</label><input type="number" value={formData.leftEye.axis} onChange={e=>handleEyeChange('leftEye', 'axis', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>ADD</label><input type="number" step="0.25" value={formData.leftEye.add} onChange={e=>handleEyeChange('leftEye', 'add', e.target.value)} className={inputClass} /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Doctor Name</label><input type="text" value={formData.doctorName} onChange={e=>setFormData({...formData, doctorName: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Clinic Name</label><input type="text" value={formData.clinicName} onChange={e=>setFormData({...formData, clinicName: e.target.value})} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Examined At Shop</label>
              <select value={formData.shop} onChange={e=>setFormData({...formData, shop: e.target.value})} className={inputClass}>
                <option value="">External Clinic</option>
                {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className={labelClass}>Prescription Notes</label><textarea rows="3" value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className={inputClass} /></div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Prescription'}</button>
        </div>
      </form>
    </BaseModal>
  );
};