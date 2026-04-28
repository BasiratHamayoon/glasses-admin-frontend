"use client";
import { BaseFilter } from "./BaseFilter";
import { useLanguage } from "@/contexts/LanguageContext";

export const AdjustmentFilter = ({ searchTerm, setSearchTerm, selectedTypes, setSelectedTypes }) => {
  const { t } = useLanguage();
  const options = [
    { label: t("pending") || "Pending", value: 'PENDING' },
    { label: t("approved") || "Approved", value: 'APPROVED' },
    { label: t("applied") || "Applied", value: 'APPLIED' },
    { label: t("cancelled") || "Cancelled", value: 'CANCELLED' }
  ];

  const handleToggle = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return <BaseFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} options={options} selectedOptions={selectedTypes} onOptionToggle={handleToggle} />;
};