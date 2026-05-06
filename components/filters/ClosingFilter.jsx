"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSelector } from "react-redux";

export function ClosingFilter({ filters, setFilters, onClear }) {
  const { t } = useLanguage();
  const shops = useSelector(state => state.shops?.shops?.items || []);

  const handleChange = (field, value) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  const fieldClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white min-h-[38px] px-3 py-2";

  return (
    <BaseFilter
      search={filters.search}
      onSearchChange={(val) => handleChange("search", val)}
      onClear={onClear}
      onApply={() => {}}
    >
      <div className="min-w-[160px]">
        <select
          value={filters.shop || ""}
          onChange={(e) => handleChange("shop", e.target.value)}
          className={fieldClass}
        >
          <option value="">{t("allShops")}</option>
          {shops.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="min-w-[160px]">
        <MultiSelect
          placeholder={t("closingStatus")}
          options={[
            { label: t("draft"), value: "DRAFT" },
            { label: t("open"), value: "OPEN" },
            { label: t("submitted"), value: "SUBMITTED" },
            { label: t("verified"), value: "VERIFIED" },
            { label: t("approved"), value: "APPROVED" },
            { label: t("rejected"), value: "REJECTED" },
            { label: t("reopened"), value: "REOPENED" },
          ]}
          selected={filters.status || []}
          onChange={(val) => handleChange("status", val)}
        />
      </div>

      <div className="min-w-[140px]">
        <input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
          className={fieldClass}
          title={t("startDate")}
        />
      </div>

      <div className="min-w-[140px]">
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
          className={fieldClass}
          title={t("endDate")}
        />
      </div>
    </BaseFilter>
  );
}