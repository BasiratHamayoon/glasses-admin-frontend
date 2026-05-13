"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export const LookupFilter = ({ filters, setFilters, onClear, data = [] }) => {
  const { t } = useLanguage();

  const suggestions = Array.from(new Set(data.map((item) => item.name).filter(Boolean)));

  const handleChange = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={() => {}}
      suggestions={suggestions}
    >
      <MultiSelect
        placeholder={t("allStatuses")}
        options={[
          { label: t("active"), value: "true" },
          { label: t("inactive"), value: "false" },
        ]}
        selected={filters.isActive || []}
        onChange={(val) => handleChange("isActive", val)}
      />
    </BaseFilter>
  );
};