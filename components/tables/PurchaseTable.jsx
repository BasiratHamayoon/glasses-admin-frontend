"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

const editStatusBadge = {
  NONE:     "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
  PENDING:  "bg-orange-500/10 text-orange-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  REJECTED: "bg-red-500/10 text-red-500",
};

export const PurchaseTable = ({
  data,
  loading,
  onView,
  onApprove,
  onReject,
  showActions = false, // true for pending-requests tab
}) => {
  const columns = [
    {
      header: "Purchase ID",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">
            {row.purchaseNumber}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase">
            {row.purchaseDate
              ? format(new Date(row.purchaseDate), "dd MMM yyyy")
              : "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Shop",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider font-black text-neutral-800 dark:text-neutral-200">
            {row.shop?.name || "—"}
          </span>
          {row.shop?.code && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
              {row.shop.code}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Item",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black">{row.itemName}</span>
          {row.productRef?.sku && (
            <span className="text-[8px] text-neutral-500 uppercase">
              SKU: {row.productRef.sku}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Category",
      render: (row) => (
        <span className="text-[9px] uppercase tracking-wider font-bold">
          {row.category?.name || row.customCategory || "—"}
        </span>
      ),
    },
    {
      header: "Qty",
      render: (row) => (
        <span className="text-[11px] font-black">{row.quantity}</span>
      ),
    },
    {
      header: "Unit Price",
      render: (row) => (
        <span className="text-[11px] font-black">
          SAR {row.price?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Total",
      render: (row) => (
        <span className="text-[11px] font-black text-[#E9B10C]">
          SAR {((row.price || 0) * (row.quantity || 1)).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Supplier",
      render: (row) => (
        <span className="text-[9px] uppercase text-neutral-500">
          {row.supplierShopName || "—"}
        </span>
      ),
    },
    {
      header: "Edit Status",
      render: (row) => {
        const status = row.editRequest?.status || "NONE";
        return (
          <span
            className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
              editStatusBadge[status]
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => {
        const editStatus = row.editRequest?.status || "NONE";
        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onView(row)}
              title="View Details"
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"
            >
              <Eye size={14} />
            </button>
            {showActions && editStatus === "PENDING" && (
              <>
                <button
                  onClick={() => onApprove(row)}
                  title="Approve Edit"
                  className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => onReject(row)}
                  title="Reject Edit"
                  className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors"
                >
                  <XCircle size={14} />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};