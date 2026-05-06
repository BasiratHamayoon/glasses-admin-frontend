"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function ShopFilter({ filters, setFilters, onClear }) {
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
        placeholder={t("allStatuses")}
        options={[
          { label: t("active"), value: "ACTIVE" },
          { label: t("closed"), value: "CLOSED" },
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange("status", val)}
      />
      <MultiSelect
        placeholder={t("shopType")}
        options={[
          { label: t("retail"), value: "RETAIL" },
          { label: t("wholesale"), value: "WHOLESALE" },
        ]}
        selected={filters.shopType || []}
        onChange={(val) => handleChange("shopType", val)}
      />
    </BaseFilter>
  );
}