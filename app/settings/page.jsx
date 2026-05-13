"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, UserCircle, ShieldCheck } from "lucide-react";

import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export default function SettingsPage() {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Premium Header */}
      <div className="flex items-center gap-4 bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm">
        <div className="p-3 bg-[#E9B10C]/10 rounded-sm text-[#E9B10C]">
          <Settings size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">
            {t('settings')}
          </h1>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
            {t('manageSystemPreferences')}
          </p>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex bg-neutral-100 dark:bg-[#111111] p-1.5 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto shadow-sm overflow-x-auto scrollbar-hide max-w-fit gap-1">
        {[
          { id: "profile", label: t("adminProfile") || "Admin Profile", icon: UserCircle }, 
          { id: "security", label: t("security") || "Security & Password", icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-8 py-3 text-[10px] uppercase tracking-widest font-black transition-all duration-300 rounded-sm whitespace-nowrap ${
                isActive 
                  ? 'bg-[#E9B10C] text-black shadow-md scale-100' 
                  : 'bg-transparent text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 scale-95 hover:scale-100'
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 3 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area with smooth transition */}
      <div className="transition-all duration-300 relative">
        {activeTab === "profile" && (
          <div className="animate-in slide-in-from-left-4 fade-in duration-300">
            <ProfileSettings />
          </div>
        )}
        {activeTab === "security" && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <SecuritySettings />
          </div>
        )}
      </div>

    </div>
  );
}