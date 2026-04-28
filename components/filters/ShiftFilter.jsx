"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSelector } from "react-redux";

export function ShiftFilter({ filters, setFilters, onApply, onClear }) {
  const shops = useSelector(state => state.shops?.shops?.items || []);
  
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      
      {/* Filter by Shop (Or Universal Shifts) */}
      <select 
        value={filters.shop || ''} 
        onChange={(e) => handleChange('shop', e.target.value)} 
        className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] shadow-sm text-neutral-500"
      >
        <option value="">All Locations</option>
        <option value="null">Universal (No Shop)</option>
        {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      {/* Filter by Shift Status */}
      <MultiSelect 
        placeholder="Status"
        options={[
          { label: 'Active', value: 'true' }, 
          { label: 'Inactive', value: 'false' }
        ]}
        selected={filters.isActive || []}
        onChange={(val) => handleChange('isActive', val)}
      />
      
    </BaseFilter>
  );
}