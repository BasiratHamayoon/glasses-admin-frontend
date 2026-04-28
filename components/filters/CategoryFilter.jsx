"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function CategoryFilter({ filters, setFilters, onApply, onClear }) {
  const { t } = useLanguage();

  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const inputClass = "flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm placeholder:text-neutral-500 placeholder:font-medium";

  // Reusable boolean options
  const booleanOptions = [
    { label: "Yes / Active", value: "true" },
    { label: "No / Inactive", value: "false" }
  ];

  return (
    <BaseFilter 
      search={filters.search} 
      onSearchChange={(val) => handleChange('search', val)} 
      onClear={onClear} 
      onApply={onApply}
    >
      <input 
        type="number" 
        placeholder="Category Level (e.g. 0)" 
        value={filters.level} 
        onChange={(e) => handleChange('level', e.target.value)} 
        className={inputClass} 
      />

      <MultiSelect 
        placeholder="Status (All)"
        options={booleanOptions}
        selected={filters.isActive || []}
        onChange={(val) => handleChange('isActive', val)}
      />

      <MultiSelect 
        placeholder="Website Visibility"
        options={booleanOptions}
        selected={filters.showOnWebsite || []}
        onChange={(val) => handleChange('showOnWebsite', val)}
      />

      <MultiSelect 
        placeholder="POS Visibility"
        options={booleanOptions}
        selected={filters.showOnPOS || []}
        onChange={(val) => handleChange('showOnPOS', val)}
      />

      <MultiSelect 
        placeholder="Featured"
        options={booleanOptions}
        selected={filters.isFeatured || []}
        onChange={(val) => handleChange('isFeatured', val)}
      />
    </BaseFilter>
  );
}