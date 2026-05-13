"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

const editStatusConfig = {
  NONE:     { cls: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",  label: "None"     },
  PENDING:  { cls: "bg-orange-500/10 text-orange-500",                     label: "Pending"  },
  APPROVED: { cls: "bg-blue-500/10 text-blue-500",                         label: "Approved" },
  REJECTED: { cls: "bg-red-500/10 text-red-500",                           label: "Rejected" },
};

const approvalStatusConfig = {
  PENDING:  { cls: "bg-amber-500/10 text-amber-500",  label: "Pending"  },
  APPROVED: { cls: "bg-green-500/10 text-green-500",  label: "Approved" },
  REJECTED: { cls: "bg-red-500/10 text-red-500",      label: "Rejected" },
};

export const PurchaseTable = ({
  data,
  loading,
  onView,
  onApprove,
  onReject,
  showActions = false,
  actionType  = "edit",   // ✅ "edit" | "purchase"
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
        <span className="text-[11px] font-black flex items-center gap-1">
          ⃁ {(row.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Total",
      render: (row) => (
        <span className="text-[11px] font-black text-green-500 flex items-center gap-1">
          ⃁ {(row.totalAmount ?? (row.price || 0) * (row.quantity || 1)).toLocaleString()}
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

    // ✅ Approval Status column (purchase-level)
    {
      header: "Approval",
      render: (row) => {
        const status = row.approvalStatus || "PENDING";
        const { cls, label } = approvalStatusConfig[status] || approvalStatusConfig.PENDING;
        return (
          <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${cls}`}>
            {label}
          </span>
        );
      },
    },

    // ✅ Edit Request Status column
    {
      header: "Edit Request",
      render: (row) => {
        const status = row.editRequest?.status || "NONE";
        const { cls, label } = editStatusConfig[status] || editStatusConfig.NONE;
        return (
          <div className="flex flex-col gap-1">
            <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm w-fit ${cls}`}>
              {label}
            </span>
            {/* Show pending changes preview */}
            {status === "PENDING" && row.editRequest?.pendingChanges?.quantity && (
              <span className="text-[8px] text-orange-400 font-bold">
                Qty → {row.editRequest.pendingChanges.quantity}
              </span>
            )}
            {status === "PENDING" && row.editRequest?.pendingChanges?.price && (
              <span className="text-[8px] text-orange-400 font-bold">
                Price → ⃁{row.editRequest.pendingChanges.price}
              </span>
            )}
          </div>
        );
      },
    },

    {
      header: "Actions",
      render: (row) => {
        const editStatus     = row.editRequest?.status  || "NONE";
        const approvalStatus = row.approvalStatus       || "PENDING";

        // ✅ For purchase-level actions: show when approvalStatus = PENDING
        const showPurchaseActions =
          showActions && actionType === "purchase" && approvalStatus === "PENDING";

        // ✅ For edit-request-level actions: show when editRequest.status = PENDING
        const showEditActions =
          showActions && actionType === "edit" && editStatus === "PENDING";

        return (
          <div className="flex gap-2 items-center">
            {/* View button always shown */}
            <button
              onClick={() => onView(row)}
              title="View Details"
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-sm text-neutral-600 dark:text-neutral-400 transition-colors"
            >
              <Eye size={14} />
            </button>

            {/* ✅ Purchase approve/reject */}
            {showPurchaseActions && (
              <>
                <button
                  onClick={() => onApprove(row)}
                  title="Approve Purchase"
                  className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => onReject(row)}
                  title="Reject Purchase"
                  className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors"
                >
                  <XCircle size={14} />
                </button>
              </>
            )}

            {/* ✅ Edit request approve/reject */}
            {showEditActions && (
              <>
                <button
                  onClick={() => onApprove(row)}
                  title="Approve Edit Request"
                  className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => onReject(row)}
                  title="Reject Edit Request"
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