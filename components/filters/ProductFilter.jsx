"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProductFilter({ filters, setFilters, onApply, onClear, data = [] }) {
  const { t } = useLanguage();

  const suggestions = Array.from(new Set(data.map(item => item.name).filter(Boolean)));

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={onApply}
      suggestions={suggestions}
    >
      <MultiSelect
        placeholder={t("allTypes") || "Product Type"}
        options={[
          { label: "Frame", value: "FRAME" },
          { label: "Sunglasses", value: "SUNGLASSES" },
          { label: "Lens", value: "LENS" },
          { label: "Accessory", value: "ACCESSORY" }
        ]}
        selected={filters.productType || []}
        onChange={(val) => handleChange("productType", val)}
      />
      <MultiSelect
        placeholder={t("allStatuses") || "Status"}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
          { label: "Out of Stock", value: "OUT_OF_STOCK" },
          { label: "Draft", value: "DRAFT" }
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange("status", val)}
      />
      <MultiSelect
        placeholder={t("priceRange") || "Price Range"}
        options={[
          { label: "Under 50", value: "0-50" },
          { label: "50 - 100", value: "50-100" },
          { label: "100 - 250", value: "100-250" },
          { label: "250 - 500", value: "250-500" },
          { label: "500 - 1000", value: "500-1000" },
          { label: "Above 1000", value: "1000-999999" }
        ]}
        selected={filters.priceRange || []}
        onChange={(val) => handleChange("priceRange", val)}
      />
    </BaseFilter>
  );
}