"use client";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, XCircle, CheckSquare } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

const statusColors = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  OPEN: "bg-blue-500/10 text-blue-500",
  SUBMITTED: "bg-amber-500/10 text-amber-500",
  VERIFIED: "bg-purple-500/10 text-purple-500",
  APPROVED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-red-500/10 text-red-500",
  REOPENED: "bg-orange-500/10 text-orange-500",
};

export const ClosingsTable = ({
  data,
  loading,
  stats,
  onApprove,
  onReject,
  onView,
  onBulkApprove,
}) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === data.length) setSelected([]);
    else setSelected(data.map((d) => d._id));
  };

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
          {row.closingNumber}
        </span>
      ),
    },
    {
      header: t("shop"),
      render: (row) => (
        <span className="text-[11px] font-bold text-black dark:text-white">
          {row.shop?.name || "-"}
        </span>
      ),
    },
    {
      header: t("date"),
      render: (row) => (
        <span className="text-[10px] font-bold text-neutral-500">
          {row.closingDate ? new Date(row.closingDate).toLocaleDateString() : "-"}
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
      header: t("totalExpenses"),
      render: (row) => (
        <span className="font-bold text-red-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalExpenses)}
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
          {row.status}
        </span>
      ),
    },
    {
      header: t("closedBy"),
      render: (row) => (
        <span className="text-[10px] font-bold text-neutral-500">
          {row.closedBy?.name || "-"}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-1.5 items-center">
          <button
            onClick={() => onView(row._id)}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-500 hover:text-blue-500 transition-colors"
            title={t("view")}
          >
            <Eye size={13} />
          </button>
          {["SUBMITTED", "PENDING", "OPEN"].includes(row.status) && (
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: t("totalClosings"),
              value: stats.totalClosings || 0,
              color: "text-black dark:text-white",
            },
            {
              label: t("totalSales"),
              value: <span className="flex items-center gap-1">⃁ {formatNum(stats.totalSales)}</span>,
              color: "text-green-500",
            },
            {
              label: t("totalExpenses"),
              value: <span className="flex items-center gap-1">⃁ {formatNum(stats.totalExpenses)}</span>,
              color: "text-red-500",
            },
            {
              label: t("totalDiscrepancy"),
              value: <span className="flex items-center gap-1">⃁ {formatNum(stats.totalDiscrepancy)}</span>,
              color: "text-amber-500",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4"
            >
              <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
                {stat.label}
              </div>
              <div className={`text-lg font-black ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#E9B10C]/10 border border-[#E9B10C]/30 rounded-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C]">
            {selected.length} {t("selected")}
          </span>
          <button
            onClick={() => onBulkApprove(selected)}
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