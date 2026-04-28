"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { ChevronDown, LayoutGrid } from "lucide-react";

export function ItemsPerPage({ value, onChange, options = [8, 12, 16, 24] }) {
  const { language } = useLanguage();
  const { theme, colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const isArabic = language === 'ar';
  const isDark = theme === "dark";
  const goldenColor = colors.golden.DEFAULT;

  const bgColor = isDark ? 'bg-neutral-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const borderColor = isDark ? 'border-neutral-800' : 'border-neutral-200';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border ${borderColor} ${bgColor}
          transition-all duration-300 hover:border-[#D4AF37] shadow-sm
          ${isArabic ? 'flex-row-reverse' : 'flex-row'}
        `}
        style={{ borderColor: isOpen ? goldenColor : borderColor }}
      >
        <LayoutGrid size={16} style={{ color: goldenColor }} />
        <span className={`text-sm font-bold uppercase tracking-wider ${textColor}`}>
          {value} {isArabic ? 'منتجات' : 'items'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} style={{ color: goldenColor }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute ${isArabic ? 'left-0' : 'right-0'} mt-2 min-w-[140px]
              rounded-lg border ${borderColor} ${bgColor} shadow-xl z-50 overflow-hidden
            `}
          >
            {options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ backgroundColor: `${goldenColor}20` }}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-sm font-bold uppercase tracking-wider
                  transition-colors duration-300
                  ${value === option ? `text-[#D4AF37]` : textColor}
                  ${isArabic ? 'text-right' : 'text-left'}
                `}
              >
                {option} {isArabic ? 'منتجات' : 'items'}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}