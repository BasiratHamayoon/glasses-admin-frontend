"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function BaseFilter({ search, onSearchChange, onClear, onApply, children, suggestions = [] }) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(search || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setLocalSearch(search || "");
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalSearch("");
    setShowSuggestions(false);
    onClear();
    setIsExpanded(false);
  };

  const handleApply = (overrideValue) => {
    const val = typeof overrideValue === 'string' ? overrideValue : localSearch;
    setShowSuggestions(false);
    onSearchChange(val);
    onApply(val);
    setIsExpanded(false);
  };

  const handleSuggestionClick = (val) => {
    setLocalSearch(val);
    handleApply(val);
  };

  const filteredSuggestions = localSearch
    ? suggestions.filter(s => s.toLowerCase().includes(localSearch.toLowerCase()) && s.toLowerCase() !== localSearch.toLowerCase()).slice(0, 5)
    : [];

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 mb-6 flex flex-col gap-4 transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="relative flex-1 w-full" ref={wrapperRef}>
          <div className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} text-neutral-400`}>
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder={t('search') || 'Search...'}
            value={localSearch}
            onChange={(e) => {
              const val = e.target.value;
              setLocalSearch(val);
              
              // Only show suggestions if there's text
              if (val.length > 0) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }

              // MAGIC HAPPENS HERE: Immediately trigger the search as the user types
              // If text is removed (val === ""), it will fetch all products automatically
              onSearchChange(val);
              onApply(val); 
            }}
            onFocus={() => localSearch.length > 0 && setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className={`flex h-9 w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-2 text-[11px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm ${isArabic ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'}`}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-lg z-50 overflow-hidden">
              {filteredSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className={`w-full block px-4 py-2.5 text-[11px] font-bold hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 text-[9px] uppercase tracking-widest font-black border border-neutral-200 dark:border-neutral-800 rounded-sm hover:border-[#E9B10C] hover:text-[#E9B10C] transition-colors bg-white dark:bg-[#111111]"
          >
            <Filter size={12} /> {t('advancedFilters') || 'Advanced Filters'}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button onClick={() => handleApply()} className="flex-none h-9 px-6 text-[9px] uppercase tracking-widest font-black bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shadow-sm">
            {t('search') || 'Search'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mb-4">
            {children}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={handleClear} className="h-8 px-4 text-[9px] uppercase tracking-widest font-bold text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors flex items-center gap-1 rounded-sm border border-transparent hover:border-red-200 dark:hover:border-red-800">
              <X size={12} /> {t('clear') || 'Clear'}
            </button>
            <button onClick={() => handleApply()} className="h-8 px-6 text-[9px] uppercase tracking-widest font-black bg-[#E9B10C] text-black hover:bg-[#d4a00a] transition-colors rounded-sm shadow-sm">
              {t('apply') || 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}