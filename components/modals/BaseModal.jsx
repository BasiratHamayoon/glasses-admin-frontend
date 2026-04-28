"use client";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export const BaseModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          dir={isArabic ? 'rtl' : 'ltr'}
          // 🔥 Applied the dynamic maxWidth here
          className={`relative w-full ${maxWidth} bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-[12px] uppercase tracking-widest font-black text-black dark:text-white">{title}</h3>
            <button onClick={onClose} className="text-neutral-500 hover:text-[#E9B10C] transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};