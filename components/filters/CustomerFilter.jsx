"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";

export function CustomerFilter({ filters, setFilters, onApply, onClear }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      <MultiSelect 
        placeholder="Customer Type"
        options={[{ label: 'Walk-In (POS)', value: 'false' }, { label: 'Online (Website)', value: 'true' }]}
        selected={filters.isWebsiteUser || []}
        onChange={(val) => handleChange('isWebsiteUser', val)}
      />
      <MultiSelect 
        placeholder="Loyalty Tier"
        options={[{ label: 'Bronze', value: 'BRONZE' }, { label: 'Silver', value: 'SILVER' }, { label: 'Gold', value: 'GOLD' }, { label: 'Platinum', value: 'PLATINUM' }]}
        selected={filters.loyaltyTier || []}
        onChange={(val) => handleChange('loyaltyTier', val)}
      />
      <MultiSelect 
        placeholder="Status"
        options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Blocked', value: 'BLOCKED' }]}
        selected={filters.status || []}
        onChange={(val) => handleChange('status', val)}
      />
    </BaseFilter>
  );
}