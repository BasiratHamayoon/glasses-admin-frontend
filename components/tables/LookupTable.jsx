"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export const LookupTable = ({ items, loading, onEdit, onDelete, onToggle, extraColumns = [] }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("sortOrder"),
      render: (row) => (
        <span className="text-[10px] font-black text-neutral-400">#{row.sortOrder ?? 0}</span>
      ),
    },
    {
      header: t("name"),
      render: (row) => (
        <span className="text-[11px] font-bold text-black dark:text-white">{row.name}</span>
      ),
    },
    {
      header: t("value"),
      render: (row) => (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[9px] uppercase tracking-widest font-black rounded-sm text-black dark:text-white">
          {row.value}
        </span>
      ),
    },
    {
      header: t("description"),
      render: (row) => (
        <span className="text-[10px] text-neutral-500 max-w-[200px] truncate block">
          {row.description || "—"}
        </span>
      ),
    },
    ...extraColumns,
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
            row.isActive
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {row.isActive ? t("active") : t("inactive")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => onToggle(row)}
            title={t("toggleStatus")}
            className="text-neutral-500 hover:text-blue-500 transition-colors"
          >
            {row.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
          </button>
          <button
            onClick={() => onEdit(row)}
            title={t("edit")}
            className="text-neutral-500 hover:text-[#E9B10C] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(row)}
            title={t("delete")}
            className="text-neutral-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return <BaseTable columns={columns} data={items} loading={loading} />;
};