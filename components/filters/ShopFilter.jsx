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
    </BaseFilter>
  );
}