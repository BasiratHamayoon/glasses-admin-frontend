"use client";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Trash2, Eye } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export const ProductTable = ({ products, loading, onView, onEdit, onDelete }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: "IMG",
      render: (row) => (
        <div className="w-8 h-8 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          {row.images && row.images.length > 0 ? (
            <SafeImage
              src={row.images[0].url}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[7px] text-neutral-400 flex items-center justify-center w-full h-full font-bold">
              NO IMG
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("name"),
      accessor: "name",
    },
    {
      header: t("sku"),
      accessor: "sku",
    },
    {
      header: t("category"),
      render: (row) => (
        <span className="text-[9px] uppercase tracking-wider font-bold">
          {row.category?.name || "—"}
        </span>
      ),
    },
    {
      header: t("gender"),
      render: (row) => (
        <span className="text-[9px] uppercase tracking-wider font-bold">
          {row.gender || "—"}
        </span>
      ),
    },
    {
      header: t("price"),
      render: (row) => (
        <span className="font-black text-[#E9B10C]">
          {row.sellingPrice} ⃁
        </span>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
            row.isActive || row.status === "ACTIVE"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {row.status || (row.isActive ? "ACTIVE" : "INACTIVE")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => onView(row)}
            title={t("viewProduct")}
            className="text-neutral-500 hover:text-blue-500 transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(row)}
            title={t("edit")}
            className="text-neutral-500 hover:text-[#E9B10C] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
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

  return <BaseTable columns={columns} data={products} loading={loading} />;
};