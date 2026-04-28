"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";

export function SearchInput({ defaultExpanded = false, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const inputRef = useRef(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";

  // STRICT STYLING:
  // Dark: Light Gray text, Dark Gray border
  // Light: Black text, Dark Gray border
  const styles = {
    input: isDark 
      ? "bg-transparent border-gray-600 text-gray-200 placeholder:text-gray-500 focus-visible:border-gray-400"
      : "bg-transparent border-gray-400 text-black placeholder:text-gray-500 focus-visible:border-black",
    
    icon: isDark 
      ? "text-gray-400 hover:text-white" 
      : "text-gray-600 hover:text-black",
    
    closeBtn: isDark
      ? "text-gray-400 hover:text-white"
      : "text-gray-600 hover:text-black"
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <div className={`relative flex items-center justify-end ${className}`}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('search')}
              className={`w-full h-9 rounded-none px-0 border-b border-t-0 border-x-0 focus-visible:ring-0 ${styles.input}`}
              onBlur={() => !defaultExpanded && setIsExpanded(false)}
            />
            <button 
                onClick={() => setIsExpanded(false)} 
                className={`ml-2 lg:hidden ${styles.closeBtn}`}
            >
                <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className={`transition-colors p-1 ${styles.icon}`}
          >
            <Search className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}