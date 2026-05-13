"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/LanguageContext";

export function TransferFilter({ filters, setFilters, onClear }) {
  const { t } = useLanguage();
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange("search", val)} onClear={onClear} onApply={() => {}}>
      <MultiSelect
        placeholder={t("transferStatus")}
        options={[
          { label: t("draft"), value: "DRAFT" },
          { label: t("requested"), value: "REQUESTED" },
          { label: t("approved"), value: "APPROVED" },
          { label: t("rejected"), value: "REJECTED" },
          { label: t("partiallyApproved"), value: "PARTIALLY_APPROVED" },
          { label: t("shipped"), value: "SHIPPED" },
          { label: t("received"), value: "RECEIVED" },
          { label: t("cancelled"), value: "CANCELLED" },
        ]}
        selected={filters.status || []}
        onChange={(val) => handleChange("status", val)}
      />
      <MultiSelect
        placeholder={t("transferType")}
        options={[
          { label: t("shopToShop"), value: "SHOP_TO_SHOP" },
          { label: t("warehouseToShop"), value: "WAREHOUSE_TO_SHOP" },
          { label: t("shopToWarehouse"), value: "SHOP_TO_WAREHOUSE" },
          { label: t("return"), value: "RETURN" },
        ]}
        selected={filters.transferType || []}
        onChange={(val) => handleChange("transferType", val)}
      />
    </BaseFilter>
  );
}