"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select"; 
import { useLanguage } from "@/contexts/LanguageContext";

export function ProductFilter({ filters, setFilters, onApply, onClear, data = [] }) {
  const { t } = useLanguage();

  const suggestions = Array.from(new Set(data.map(item => item.name).filter(Boolean)));

  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const inputClass = "flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm placeholder:text-neutral-500 placeholder:font-medium";

  return (
    <BaseFilter 
      search={filters.search} 
      onSearchChange={(val) => handleChange('search', val)} 
      onClear={onClear} 
      onApply={onApply}
      suggestions={suggestions}
    >
      <MultiSelect 
        placeholder={t('allTypes') || 'All Types'}
        options={[
          { label: 'Frames', value: 'FRAME' },
          { label: 'Sunglasses', value: 'SUNGLASSES' },
          { label: 'Lenses', value: 'LENS' },
          { label: 'Accessories', value: 'ACCESSORY' }
        ]}
        selected={filters.productType}
        onChange={(val) => handleChange('productType', val)}
      />

      <MultiSelect 
        placeholder={t('allGenders') || 'All Genders'}
        options={[
          { label: 'Unisex', value: 'UNISEX' },
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Kids', value: 'KIDS' }
        ]}
        selected={filters.gender}
        onChange={(val) => handleChange('gender', val)}
      />

      <MultiSelect 
        placeholder={t('allStatuses') || 'All Statuses'}
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
          { label: 'Draft', value: 'DRAFT' }
        ]}
        selected={filters.status}
        onChange={(val) => handleChange('status', val)}
      />

      <input 
        type="number" 
        placeholder={t('minPrice') || 'Min Price'} 
        value={filters.minPrice} 
        onChange={(e) => handleChange('minPrice', e.target.value)} 
        className={inputClass} 
      />
      <input 
        type="number" 
        placeholder={t('maxPrice') || 'Max Price'} 
        value={filters.maxPrice} 
        onChange={(e) => handleChange('maxPrice', e.target.value)} 
        className={inputClass} 
      />
    </BaseFilter>
  );
}