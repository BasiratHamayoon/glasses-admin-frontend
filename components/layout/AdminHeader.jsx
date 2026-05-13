"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { adminLogout } from "@/redux/actions/adminAuthActions";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";

// ❌ REMOVE THIS — import logo from "/public/logo.png"
// ✅ NO IMPORT NEEDED — just use /logo.png directly

export const AdminHeader = ({ toggleMobile, isCollapsed, setIsCollapsed }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();

  const isArabic = language === "ar";
  const { user } = useSelector((state) => state.adminAuth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fontFamily = isArabic
    ? "var(--font-cairo), var(--font-tajawal), system-ui, sans-serif"
    : "system-ui, -apple-system, sans-serif";

  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    dispatch(adminLogout());
    router.push("/login");
    setShowLogoutModal(false);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md h-16 flex items-center transition-colors duration-300 flex-shrink-0"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="w-full px-4 md:px-6 flex justify-between items-center">

          {/* LEFT — Toggles + Logo */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Mobile menu */}
            <button
              onClick={toggleMobile}
              className="lg:hidden p-2 text-neutral-600 hover:text-[#E9B10C] dark:text-neutral-400 dark:hover:text-[#E9B10C] transition-colors rounded-sm"
            >
              <Menu size={20} />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-neutral-600 hover:bg-neutral-100 hover:text-[#E9B10C] dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors rounded-sm"
              title={isCollapsed ? t("expand") : t("collapse")}
            >
              {isArabic ? (
                isCollapsed ? (
                  <PanelRightClose size={20} className="rotate-180" />
                ) : (
                  <PanelRightClose size={20} />
                )
              ) : isCollapsed ? (
                <PanelLeftClose size={20} className="rotate-180" />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            {/* ✅ LOGO — plain img tag, no import needed */}
            <div className="flex items-center gap-2 md:gap-3 ml-1 rtl:mr-1">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />

              <span
                className="hidden sm:inline-block px-2 py-1 bg-black text-white dark:bg-white 
                           dark:text-black text-[8px] uppercase tracking-widest font-black 
                           transition-colors duration-300 rounded-sm"
                style={{ fontFamily }}
              >
                {t("adminPanel")}
              </span>
            </div>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <LanguageToggle />
              <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700" />
              <ThemeToggle />
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1 md:mx-2" />

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-left rtl:text-right">
                <span
                  className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white"
                  style={{ fontFamily }}
                >
                  {user?.name || t("loading")}
                </span>
                <span className="text-[9px] text-neutral-500 tracking-wider">
                  {user?.email || "..."}
                </span>
              </div>

              <button
                onClick={handleLogoutClick}
                className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-red-50 hover:border-red-500 hover:text-red-500 dark:hover:bg-red-900/20 text-black dark:text-white transition-all duration-300 shrink-0"
                title={t("logout")}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title={t("confirmLogoutTitle") || "Logout"}
        message={t("confirmLogoutMessage") || "Are you sure you want to log out?"}
        confirmText={t("logout") || "Logout"}
        warningText={t("confirmActionWarning") || "Please confirm your action."}
        confirmClass="bg-red-500 hover:bg-red-600 text-white"
        iconColor="text-red-500"
      />
    </>
  );
};