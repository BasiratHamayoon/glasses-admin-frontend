"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";

export function LanguageToggle() {
  const { language, changeLanguage, mounted } = useLanguage() || { language: 'en', changeLanguage: () => {}, mounted: true };
  const { colors } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-5" />;
  }

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const goldenColor = colors?.golden?.DEFAULT || "#D4AF37";

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-0.5 rounded-full cursor-pointer border border-transparent hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-1.5 group"
    >
      <Globe 
        className="h-3 w-3 stroke-[1.5]" 
        style={{ color: goldenColor }}
      />
      <span 
        className="uppercase tracking-widest text-black dark:text-white transition-colors duration-300 text-[9px] font-black leading-[14px]"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {language === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}