"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function StockFilter({ filters, setFilters, onApply, onClear }) {
  const { t } = useLanguage();
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={onApply}
    >
      <MultiSelect
        placeholder={t("status") || "Stock Status"}
        options={[
          { label: "In Stock", value: "IN_STOCK" },
          { label: "Low Stock", value: "LOW_STOCK" },
          { label: "Out of Stock", value: "OUT_OF_STOCK" }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange("status", val)}
      />
    </BaseFilter>
  );
}