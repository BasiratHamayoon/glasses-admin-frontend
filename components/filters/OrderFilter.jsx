"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";

export function OrderFilter({ filters, setFilters, onApply, onClear }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter 
      search={filters.search} 
      onSearchChange={(val) => handleChange('search', val)} 
      onClear={onClear} 
      onApply={onApply}
    >
      <MultiSelect 
        placeholder="Order Status"
        options={[
          { label: 'Pending', value: 'PENDING' }, 
          { label: 'Processing', value: 'PROCESSING' },
          { label: 'Shipped', value: 'SHIPPED' }, 
          { label: 'Delivered/Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />

      <MultiSelect 
        placeholder="Payment Status"
        options={[
          { label: 'Paid', value: 'PAID' }, 
          { label: 'Pending', value: 'PENDING' },
          { label: 'Failed', value: 'FAILED' }
        ]}
        selected={filters.paymentStatus || []}
        onChange={(val) => handleChange('paymentStatus', val)}
      />
    </BaseFilter>
  );
}