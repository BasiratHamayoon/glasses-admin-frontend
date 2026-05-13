"use client";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, XCircle, CheckSquare, Trash2, Printer, Loader2 } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

const statusColors = {
  DRAFT: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
  OPEN: "bg-blue-500/10 text-blue-500",
  SUBMITTED: "bg-amber-500/10 text-amber-500",
  VERIFIED: "bg-purple-500/10 text-purple-500",
  APPROVED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-red-500/10 text-red-500",
  REOPENED: "bg-orange-500/10 text-orange-500",
};

export const ClosingsTable = ({
  data = [],
  loading,
  onApprove,
  onReject,
  onView,
  onBulkApprove,
  onDelete,
  onPrintReceipt,
  receiptLoadingId,
}) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(
      selected.length === data.length && data.length > 0
        ? []
        : data.map((d) => d._id)
    );

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selected.length === data.length && data.length > 0}
          onChange={toggleAll}
          className="w-3 h-3 accent-[#E9B10C] cursor-pointer"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selected.includes(row._id)}
          onChange={() => toggleSelect(row._id)}
          className="w-3 h-3 accent-[#E9B10C] cursor-pointer"
        />
      ),
    },
    {
      header: t("closingNumber"),
      render: (row) => (
        <span className="text-[10px] font-black tracking-wider text-[#E9B10C]">
          {row.closingNumber || row.number || row.referenceNumber || "-"}
        </span>
      ),
    },
    {
      header: t("shop"),
      render: (row) => (
        <span className="text-[11px] font-bold text-black dark:text-white">
          {row.shop?.name || row.shopName || "-"}
        </span>
      ),
    },
    {
      header: t("date"),
      render: (row) => (
        <span className="text-[10px] font-bold text-neutral-500">
          {row.closingDate || row.date || row.createdAt
            ? new Date(
                row.closingDate || row.date || row.createdAt
              ).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      header: t("totalSales"),
      render: (row) => (
        <span className="font-bold text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalSales)}
        </span>
      ),
    },
    {
      header: t("actualCash"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.actualCash)}
        </span>
      ),
    },
    {
      header: t("variance"),
      render: (row) => (
        <div className="flex flex-col">
          <span
            className={`text-[9px] font-black uppercase ${
              row.hasVariance
                ? row.varianceType === "SHORTAGE"
                  ? "text-red-500"
                  : "text-amber-500"
                : "text-green-500"
            }`}
          >
            {row.hasVariance ? row.varianceType : t("none")}
          </span>
          {row.hasVariance && (
            <span className="text-[9px] text-neutral-400 flex items-center gap-0.5">
              ⃁ {formatNum(row.varianceAmount)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
            statusColors[row.status] || "bg-neutral-100 text-neutral-600"
          }`}
        >
          {row.status || "-"}
        </span>
      ),
    },
    {
      header: t("closedBy"),
      render: (row) => (
        <span className="text-[10px] font-bold text-neutral-500">
          {row.closedBy?.name || row.submittedBy?.name || "-"}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => {
        const isReceiptLoading = receiptLoadingId === row._id;

        return (
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => onView(row._id)}
              className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-500 hover:text-blue-500 transition-colors"
              title={t("view")}
            >
              <Eye size={13} />
            </button>

            {onPrintReceipt && (
              <button
                onClick={() => onPrintReceipt(row)}
                disabled={isReceiptLoading}
                className="p-1.5 bg-[#E9B10C]/10 rounded-sm text-[#E9B10C] hover:bg-[#E9B10C]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={t("printReceipt")}
              >
                {isReceiptLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Printer size={13} />
                )}
              </button>
            )}

            {["SUBMITTED", "OPEN"].includes(row.status) && (
              <>
                <button
                  onClick={() => onApprove(row._id)}
                  className="p-1.5 bg-green-500/10 rounded-sm text-green-500 hover:bg-green-500/20 transition-colors"
                  title={t("approve")}
                >
                  <CheckCircle size={13} />
                </button>
                <button
                  onClick={() => onReject(row._id)}
                  className="p-1.5 bg-red-500/10 rounded-sm text-red-500 hover:bg-red-500/20 transition-colors"
                  title={t("reject")}
                >
                  <XCircle size={13} />
                </button>
              </>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(row)}
                className="p-1.5 bg-red-500/10 rounded-sm text-red-500 hover:bg-red-500/20 transition-colors"
                title={t("delete")}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#E9B10C]/10 border border-[#E9B10C]/30 rounded-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C]">
            {selected.length} {t("selected")}
          </span>
          <button
            onClick={() => {
              onBulkApprove(selected);
              setSelected([]);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] uppercase font-black rounded-sm hover:bg-green-500/20 transition-colors"
          >
            <CheckSquare size={12} /> {t("bulkApprove")}
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-[9px] uppercase font-black text-neutral-500 hover:text-red-500 transition-colors ml-auto"
          >
            {t("clearSelection")}
          </button>
        </div>
      )}

      <BaseTable columns={columns} data={data} loading={loading} />
    </div>
  );
};