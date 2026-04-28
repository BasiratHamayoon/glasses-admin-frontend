"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { navLinks } from "@/data/navLinks";
import { X } from "lucide-react";

export const AdminSidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, isDesktop }) => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const fontFamily = isArabic 
    ? "var(--font-cairo), var(--font-tajawal), system-ui, sans-serif"
    : "system-ui, -apple-system, sans-serif";

  const sidebarWidth = isCollapsed ? 'lg:w-20' : 'w-64';

  const mobileTransform = isMobileOpen 
    ? 'translateX(0)' 
    : `translateX(${isArabic ? '100%' : '-100%'})`;

  const sidebarStyle = !isDesktop ? {
    transform: mobileTransform,
    [isArabic ? 'right' : 'left']: 0 
  } : {
    transform: 'translateX(0)' 
  };

  return (
    <aside 
      key={language} 
      style={sidebarStyle}
      className={`fixed lg:static inset-y-0 z-50 bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800 flex flex-col h-full transition-all duration-300 ease-in-out ${sidebarWidth} ${
        isArabic ? 'right-0 border-l' : 'left-0 border-r'
      }`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-4 pb-0">
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="p-2 text-neutral-500 hover:text-[#E9B10C] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation Area (Customized Scrollbar) */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 transition-colors">
        {navLinks.map((section, idx) => (
          <div key={idx} className={isCollapsed ? "flex flex-col items-center" : ""}>
            
            {/* Section Title */}
            {!isCollapsed ? (
              <h4 
                className={`text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-4 px-3 ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ fontFamily, fontWeight: 900 }}
              >
                {t(section.title)}
              </h4>
            ) : (
              <div className="h-px w-8 bg-neutral-200 dark:bg-neutral-800 my-4" />
            )}

            {/* Section Items */}
            <div className="space-y-1 w-full">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                const borderClass = isActive 
                  ? `bg-[#E9B10C]/10 text-[#E9B10C] font-black ${isArabic ? 'border-r-2' : 'border-l-2'} border-[#E9B10C]`
                  : `text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 ${isArabic ? 'border-r-2' : 'border-l-2'} border-transparent hover:text-black dark:hover:text-white`;

                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    title={isCollapsed ? t(item.name) : ""}
                    className={`flex items-center gap-3 py-2.5 rounded-sm transition-all duration-300 ${
                      isCollapsed ? 'justify-center px-0' : 'px-3'
                    } ${borderClass}`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {!isCollapsed && (
                      <span 
                        className="text-[10px] uppercase tracking-widest whitespace-nowrap"
                        style={{ fontFamily, fontWeight: isActive ? 900 : 700 }}
                      >
                        {t(item.name)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};