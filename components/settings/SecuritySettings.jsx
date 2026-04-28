"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { changePassword } from "@/redux/actions/adminAuthActions";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Lock, Key, ShieldAlert } from "lucide-react";

export function SecuritySettings() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      // 🔥 FIX: Send ALL THREE fields because the backend explicitly requires confirmPassword
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword 
      };

      await dispatch(changePassword(payload)).unwrap();
      
      toast.success(t("passwordUpdated") || "Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.response?.data?.message 
          || err?.message 
          || "Failed to change password";
          
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 py-3 px-11 text-[12px] font-bold text-black dark:text-white outline-none rounded-sm focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#0a0a0a] transition-all duration-300 shadow-inner tracking-widest placeholder:tracking-normal`;
  const labelClass = "block text-[9px] uppercase tracking-widest font-black mb-2 text-neutral-500";
  const leftIconClass = `absolute top-[34px] ${isArabic ? 'right-3' : 'left-3'} text-neutral-400 peer-focus:text-black dark:peer-focus:text-white transition-colors duration-300`;
  const rightBtnClass = `absolute top-[34px] ${isArabic ? 'left-3' : 'right-3'} text-neutral-400 hover:text-[#E9B10C] transition-colors duration-300 p-0.5 rounded-sm bg-transparent`;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-8 rounded-sm max-w-3xl shadow-sm" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-neutral-100 dark:border-neutral-800/50">
        <div className="h-16 w-16 bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center justify-center rounded-sm">
          <ShieldAlert size={24} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-widest font-black text-black dark:text-white mb-1">
            {t("changePassword") || "Change Password"}
          </h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
            {t("securityDesc") || "Ensure your account is using a long, random password to stay secure."}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 max-w-md">
          
          {/* Current Password */}
          <div className="relative group">
            <label className={labelClass}>{t("currentPassword") || "Current Password"}</label>
            <input 
              required 
              type={showCurrent ? "text" : "password"} 
              value={formData.currentPassword} 
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
              className={`${inputClass} peer`} 
              placeholder="••••••••"
            />
            <div className={leftIconClass}><Key size={16} strokeWidth={2.5} /></div>
            <button 
              type="button" 
              onClick={() => setShowCurrent(!showCurrent)} 
              className={rightBtnClass}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative group">
            <label className={labelClass}>{t("newPassword") || "New Password"}</label>
            <input 
              required 
              type={showNew ? "text" : "password"} 
              value={formData.newPassword} 
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
              className={`${inputClass} peer`} 
              placeholder="••••••••"
            />
            <div className={leftIconClass}><Lock size={16} strokeWidth={2.5} /></div>
            <button 
              type="button" 
              onClick={() => setShowNew(!showNew)} 
              className={rightBtnClass}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest mt-2 ml-1">
              * {t("passwordRequirements") || "Password must be at least 6 characters long."}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="relative group mt-2">
            <label className={labelClass}>{t("confirmPassword") || "Confirm New Password"}</label>
            <input 
              required 
              type={showConfirm ? "text" : "password"} 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              className={`${inputClass} peer`} 
              placeholder="••••••••"
            />
            <div className={leftIconClass}><ShieldAlert size={16} strokeWidth={2.5} /></div>
            <button 
              type="button" 
              onClick={() => setShowConfirm(!showConfirm)} 
              className={rightBtnClass}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

        </div>

        <div className="flex justify-start sm:justify-end pt-6 mt-8 border-t border-neutral-100 dark:border-neutral-800/50">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-8 py-3 bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase font-black tracking-widest rounded-sm flex justify-center items-center gap-2 transition-all hover:bg-[#E9B10C] hover:text-black dark:hover:text-black hover:shadow-lg hover:shadow-[#E9B10C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={16} /> {t("updatePassword") || "Update Password"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}