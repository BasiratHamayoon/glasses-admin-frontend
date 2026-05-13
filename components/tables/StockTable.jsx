"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BaseTable } from "./BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "sonner";
import { deleteStock, deleteWebsiteStock } from "@/redux/actions/inventoryActions";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";

export const StockTable = ({ data, loading, onView, onEdit, isWebsite = false, onRefresh }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    loading: false,
  });

  const handleDeleteRequest = (item) => {
    setDeleteModal({ isOpen: true, item, loading: false });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      if (isWebsite) {
        await dispatch(deleteWebsiteStock(deleteModal.item._id)).unwrap();
      } else {
        await dispatch(deleteStock(deleteModal.item._id)).unwrap();
      }
      toast.success(t("stockDeleted"));
      setDeleteModal({ isOpen: false, item: null, loading: false });
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const columns = [
    {
      header: t("product"),
      render: (row) => {
        const primaryImg =
          row.product?.images?.find(img => img.isPrimary)?.url ||
          row.product?.images?.[0]?.url;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
              <SafeImage
                src={primaryImg}
                alt={row.product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold truncate max-w-[150px] text-black dark:text-white">
                {row.product?.name}
              </span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                {row.product?.sku}
              </span>
            </div>
          </div>
        );
      },
    },
    ...(!isWebsite
      ? [{
          header: t("shop"),
          render: (row) => (
            <span className="text-[10px] font-bold text-black dark:text-white">
              {row.shop?.name || "-"}
            </span>
          ),
        }]
      : []
    ),
    {
      header: t("price"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {(isWebsite ? row.websitePrice : row.sellingPrice || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: t("availableQty"),
      render: (row) => (
        <span className="font-black text-[11px] text-black dark:text-white">
          {row.availableQuantity || 0}
        </span>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
            row.status === "IN_STOCK"
              ? "bg-green-500/10 text-green-500"
              : row.status === "LOW_STOCK"
              ? "bg-orange-500/10 text-orange-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {row.status?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onView(row)}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors hover:text-blue-500"
            title={t("view")}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors hover:text-[#d4a00a]"
            title={t("edit")}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleDeleteRequest(row)}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors hover:text-red-500"
            title={t("delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <BaseTable columns={columns} data={data} loading={loading} />
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, loading: false })}
        onConfirm={handleConfirmDelete}
        loading={deleteModal.loading}
        message={`${t("deleteConfirm")} ${deleteModal.item?.product?.name || ""}?`}
      />
    </>
  );
};