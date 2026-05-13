"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateProfile } from "@/redux/actions/adminAuthActions";
import { toast } from "sonner";
import { Loader2, User, Mail, Save } from "lucide-react";

export function ProfileSettings() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const { user, isLoading } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    name: "", email: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success(t("profileUpdated") || "Profile updated successfully!");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || "Failed to update profile");
    }
  };

  const inputClass = `w-full bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 py-3 ${isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-[12px] font-bold text-black dark:text-white outline-none rounded-sm focus:border-[#E9B10C] focus:bg-white dark:focus:bg-[#0a0a0a] transition-all duration-300 shadow-inner`;
  const labelClass = "block text-[9px] uppercase tracking-widest font-black mb-2 text-neutral-500";
  const iconWrapperClass = `absolute top-[34px] ${isArabic ? 'right-3' : 'left-3'} text-neutral-400 peer-focus:text-[#E9B10C] transition-colors duration-300`;

  // Get initials for the avatar
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "AD";

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-8 rounded-sm max-w-3xl shadow-sm" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Section Header with Avatar Placeholder */}
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-neutral-100 dark:border-neutral-800/50">
        <div className="h-16 w-16 bg-[#E9B10C]/10 border border-[#E9B10C]/30 text-[#E9B10C] flex items-center justify-center rounded-sm text-xl font-black tracking-widest">
          {getInitials(formData.name)}
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-widest font-black text-black dark:text-white mb-1">
            {t("updateProfile") || "Update Profile"}
          </h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
            {t("profileDesc") || "Manage your personal information and contact details."}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name Input */}
          <div className="relative group">
            <label className={labelClass}>{t("name") || "Full Name"}</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className={`${inputClass} peer`} 
              placeholder="John Doe"
            />
            <div className={iconWrapperClass}>
              <User size={16} strokeWidth={2.5} />
            </div>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <label className={labelClass}>{t("email") || "Email Address"}</label>
            <input 
              required 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className={`${inputClass} peer`} 
              placeholder="admin@store.com"
            />
            <div className={iconWrapperClass}>
              <Mail size={16} strokeWidth={2.5} />
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-6 mt-8 border-t border-neutral-100 dark:border-neutral-800/50">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="px-8 py-3 bg-[#E9B10C] text-black text-[10px] uppercase font-black tracking-widest rounded-sm flex items-center gap-2 transition-all hover:bg-[#d4a00a] hover:shadow-lg hover:shadow-[#E9B10C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> {t("saveChanges") || "Save Changes"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}