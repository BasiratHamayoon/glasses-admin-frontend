"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSelector } from "react-redux";

export function EmployeeFilter({ filters, setFilters, onApply, onClear }) {
  // Extracting shops safely from Redux State
  const shops = useSelector(state => state.shops?.shops?.items || []);
  
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter 
      search={filters.search} 
      onSearchChange={(val) => handleChange('search', val)} 
      onClear={onClear} 
      onApply={onApply}
    >
      
      {/* Dynamic Shop Selector */}
      <select 
        value={filters.primaryShop || ''} 
        onChange={(e) => handleChange('primaryShop', e.target.value)} 
        className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] shadow-sm text-neutral-500"
      >
        <option value="">All Shops</option>
        {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      {/* Department Filter */}
      <MultiSelect 
        placeholder="Department"
        options={[
          { label: 'Sales', value: 'SALES' }, 
          { label: 'Optometry', value: 'OPTOMETRY' },
          { label: 'Accounts', value: 'ACCOUNTS' }, 
          { label: 'Management', value: 'MANAGEMENT' }
        ]}
        selected={filters.department || []}
        onChange={(val) => handleChange('department', val)}
      />

      {/* Status Filter (Restricted to Active & Suspended) */}
      <MultiSelect 
        placeholder="Status"
        options={[
          { label: 'Active', value: 'ACTIVE' }, 
          { label: 'Suspended', value: 'SUSPENDED' }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />
      
    </BaseFilter>
  );
}