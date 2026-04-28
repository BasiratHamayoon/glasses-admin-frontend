"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSelector } from "react-redux";

export function SalaryFilter({ filters, setFilters, onApply, onClear }) {
  const { items: shops = [] } = useSelector(state => state.shops?.shops || { items: [] });
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      <select 
        value={filters.shopId || ''} 
        onChange={(e) => handleChange('shopId', e.target.value)} 
        className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm text-neutral-500"
      >
        <option value="">All Shops</option>
        {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      <MultiSelect 
        placeholder="Processing Status"
        options={[
          { label: 'Calculated', value: 'CALCULATED' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Paid', value: 'PAID' }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />

      <MultiSelect 
        placeholder="Payment Status"
        options={[
          { label: 'Pending', value: 'PENDING' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Paid', value: 'PAID' }
        ]}
        selected={filters.paymentStatus || []}
        onChange={(val) => handleChange('paymentStatus', val)}
      />
    </BaseFilter>
  );
}