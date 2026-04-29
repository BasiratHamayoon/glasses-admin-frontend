"use client";
import { BaseFilter } from "./BaseFilter";
import { useSelector } from "react-redux";
import { MultiSelect } from "@/components/ui/multi-select";

export function PurchaseFilter({ filters, setFilters, onApply, onClear }) {
  const shops = useSelector(state => state.shops?.shops?.items || []);

  const shopOptions = shops.map(s => ({
    label: `${s.name} (${s.code || s.shopCode || ""})`,
    value: s._id,
  }));

  const categoryOptions = [
    { label: "Rent", value: "RENT" },
    { label: "Salary", value: "SALARY" },
    { label: "Inventory", value: "INVENTORY" },
    { label: "Marketing", value: "MARKETING" },
    { label: "Other", value: "OTHER" },
  ];

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] font-bold outline-none focus:border-[#E9B10C] transition-colors shadow-sm";

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={onApply}
    >
      <MultiSelect
        placeholder="Filter by Shop"
        options={shopOptions}
        selected={filters.shopId ? [filters.shopId] : []}
        onChange={(val) => handleChange("shopId", val.length > 0 ? val[val.length - 1] : "")}
      />
      <MultiSelect
        placeholder="Filter by Category"
        options={categoryOptions}
        selected={filters.category ? [filters.category] : []}
        onChange={(val) => handleChange("category", val.length > 0 ? val[val.length - 1] : "")}
      />
      <input
        type="date"
        value={filters.startDate || ""}
        onChange={(e) => handleChange("startDate", e.target.value)}
        className={inputClass}
      />
      <input
        type="date"
        value={filters.endDate || ""}
        onChange={(e) => handleChange("endDate", e.target.value)}
        className={inputClass}
      />
    </BaseFilter>
  );
}