"use client";
import { BaseFilter } from "./BaseFilter";

export function CategoryFilter({ filters, setFilters, onApply, onClear }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange('search', val)}
      onClear={onClear}
      onApply={onApply}
      hideFilterButton={true}
    />
  );
}