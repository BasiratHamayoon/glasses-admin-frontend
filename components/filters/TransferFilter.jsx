"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";

export function TransferFilter({ filters, setFilters, onApply, onClear }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const inputClass = "flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm";

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      
      <MultiSelect 
        placeholder="Transfer Status"
        options={[
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Requested', value: 'REQUESTED' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Shipped', value: 'SHIPPED' },
          { label: 'Received', value: 'RECEIVED' },
          { label: 'Rejected', value: 'REJECTED' }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />

      <MultiSelect 
        placeholder="Transfer Type"
        options={[
          { label: 'Shop to Shop', value: 'SHOP_TO_SHOP' },
          { label: 'Warehouse to Shop', value: 'WAREHOUSE_TO_SHOP' },
          { label: 'Shop to Warehouse', value: 'SHOP_TO_WAREHOUSE' },
          { label: 'Return', value: 'RETURN' }
        ]}
        selected={filters.transferType || []}
        onChange={(val) => handleChange('transferType', val)}
      />

      <input 
        type="date" 
        value={filters.startDate || ''} 
        onChange={(e) => handleChange('startDate', e.target.value)} 
        className={inputClass} 
        placeholder="Start Date"
      />
      <input 
        type="date" 
        value={filters.endDate || ''} 
        onChange={(e) => handleChange('endDate', e.target.value)} 
        className={inputClass} 
        placeholder="End Date"
      />
    </BaseFilter>
  );
}