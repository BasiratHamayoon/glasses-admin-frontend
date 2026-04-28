"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted, colors } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-5" />;
  }

  const isDark = theme === "dark";
  const goldenColor = colors?.golden?.DEFAULT || "#D4AF37";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center cursor-pointer justify-center gap-1.5 px-3 py-0.5 rounded-full border border-transparent hover:border-[#D4AF37] transition-all duration-300 group"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-state"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Sun 
              className="h-3 w-3 stroke-[1.5]" 
              style={{ color: goldenColor }} 
            />
            <span 
              className="uppercase tracking-widest hidden sm:inline-block text-white transition-colors duration-300 text-[9px] font-black leading-[14px]"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Light
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="light-state"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Moon 
              className="h-3 w-3 stroke-[1.5]" 
              style={{ color: goldenColor }} 
            />
            <span 
              className="uppercase tracking-widest hidden sm:inline-block text-black transition-colors duration-300 text-[9px] font-black leading-[14px]"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Dark
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}