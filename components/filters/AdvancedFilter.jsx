"use client";
import { Search, Filter, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdvancedFilter({ filters, setFilters, onApply }) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', productType: '', gender: '', status: '', minPrice: '', maxPrice: '' });
  };

  const inputClass = "bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-2 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors w-full";

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter size={14} className="text-[#E9B10C]" />
        <span className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">Advanced Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
        {/* Search */}
        <div className="col-span-1 sm:col-span-2">
          <input type="text" placeholder="Search Name, SKU..." value={filters.search} onChange={(e) => handleChange('search', e.target.value)} className={inputClass} />
        </div>

        {/* Dropdowns matching Backend Schema */}
        <select value={filters.productType} onChange={(e) => handleChange('productType', e.target.value)} className={inputClass}>
          <option value="">All Types</option>
          <option value="FRAME">Frames</option>
          <option value="SUNGLASSES">Sunglasses</option>
          <option value="LENS">Lenses</option>
          <option value="ACCESSORY">Accessories</option>
        </select>

        <select value={filters.gender} onChange={(e) => handleChange('gender', e.target.value)} className={inputClass}>
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="UNISEX">Unisex</option>
          <option value="KIDS">Kids</option>
        </select>

        <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)} className={inputClass}>
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={(e) => handleChange('minPrice', e.target.value)} className={inputClass} />
        <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={(e) => handleChange('maxPrice', e.target.value)} className={inputClass} />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button onClick={clearFilters} className="px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1">
          <X size={12} /> Clear
        </button>
        <button onClick={onApply} className="px-6 py-1.5 text-[9px] uppercase tracking-widest font-black bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm">
          Apply Filters
        </button>
      </div>
    </div>
  );
}