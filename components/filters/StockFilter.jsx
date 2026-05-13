"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function StockFilter({ filters, setFilters, onClear }) {
  const { t } = useLanguage();

  const handleChange = (field, value) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={() => {}}
    >
      <MultiSelect
        placeholder={t("stockStatus")}
        options={[
          { label: t("inStock"), value: "IN_STOCK" },
          { label: t("lowStock"), value: "LOW_STOCK" },
          { label: t("outOfStock"), value: "OUT_OF_STOCK" },
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange("status", val)}
      />
    </BaseFilter>
  );
}