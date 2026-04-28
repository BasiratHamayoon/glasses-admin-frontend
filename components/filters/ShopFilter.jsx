"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";

export function ShopFilter({ filters, setFilters, onApply, onClear }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      <MultiSelect 
        placeholder="Shop Type"
        options={[
          { label: 'Retail', value: 'RETAIL' },
          { label: 'Wholesale', value: 'WHOLESALE' },
          { label: 'Franchise', value: 'FRANCHISE' },
          { label: 'Outlet', value: 'OUTLET' },
          { label: 'Kiosk', value: 'KIOSK' },
          { label: 'Warehouse', value: 'WAREHOUSE' }
        ]}
        selected={filters.shopType || []}
        onChange={(val) => handleChange('shopType', val)}
      />
      <MultiSelect 
        placeholder="Status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Suspended', value: 'SUSPENDED' },
          { label: 'Closed', value: 'CLOSED' }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />
      <input type="text" placeholder="City" value={filters.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] shadow-sm placeholder:text-neutral-500 placeholder:font-medium" />
    </BaseFilter>
  );
}