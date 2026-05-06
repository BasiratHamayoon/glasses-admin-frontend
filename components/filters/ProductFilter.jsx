"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProductFilter({ filters, setFilters, onClear, data = [] }) {
  const { t } = useLanguage();

  const suggestions = Array.from(
    new Set(data.map(item => item.name).filter(Boolean))
  );

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={val => handleChange("search", val)}
      onClear={onClear}
      onApply={() => {}}
      suggestions={suggestions}
    >
      <MultiSelect
        placeholder={t("allStatuses")}
        options={[
          { label: t("active"), value: "ACTIVE" },
          { label: t("inactive"), value: "INACTIVE" },
          { label: t("outOfStock"), value: "OUT_OF_STOCK" },
          { label: t("draft"), value: "DRAFT" },
        ]}
        selected={filters.status || []}
        onChange={val => handleChange("status", val)}
      />
      <MultiSelect
        placeholder={t("priceRange")}
        options={[
          { label: t("under50"), value: "0-50" },
          { label: t("range50to100"), value: "50-100" },
          { label: t("range100to250"), value: "100-250" },
          { label: t("range250to500"), value: "250-500" },
          { label: t("range500to1000"), value: "500-1000" },
          { label: t("above1000"), value: "1000-999999" },
        ]}
        selected={filters.priceRange || []}
        onChange={val => handleChange("priceRange", val)}
      />
    </BaseFilter>
  );
}