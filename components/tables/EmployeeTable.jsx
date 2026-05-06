"use client";
import { BaseTable } from "./BaseTable";
import { Eye, Edit2, ShieldAlert, CheckCircle, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmployeeTable = ({ data, loading, onView, onEdit, onToggleStatus, onDelete }) => {
  const { t } = useLanguage();

  const columns = [
    {
      header: t("employee"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-black dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
            {row.employeeId}
          </span>
        </div>
      ),
    },
    {
      header: t("roleDept"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-black dark:text-white">
            {row.designation}
          </span>
          <span className="text-[9px] text-[#E9B10C] font-black">{row.department}</span>
        </div>
      ),
    },
    {
      header: t("shop"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-black dark:text-white">
            {row.primaryShop?.name || t("headOffice")}
          </span>
          {row.primaryShop && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              {row.primaryShop.shopCode || `ID: ${row.primaryShop._id?.slice(-6)}`}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("shift"),
      render: (row) => (
        <div className="flex flex-col">
          {row.defaultShift ? (
            <>
              <span className="text-[10px] font-bold text-black dark:text-white uppercase">
                {row.defaultShift.name}
              </span>
              <span className="text-[9px] text-neutral-500 font-black tracking-widest">
                {row.defaultShift.startTime} - {row.defaultShift.endTime}
              </span>
            </>
          ) : (
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
              {t("unassigned")}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("loginAcc"),
      render: (row) => (
        <span className={`text-[10px] font-black ${row.user ? "text-green-500" : "text-neutral-400"}`}>
          {row.user ? t("yes") : t("no")}
        </span>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
            row.status === "ACTIVE"
              ? "bg-green-500/10 text-green-500"
              : row.status === "ON_LEAVE"
              ? "bg-blue-500/10 text-blue-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {row.status?.replace("_", " ")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-1.5 items-center">
          <button
            onClick={() => onView(row)}
            title={t("view")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-blue-500 transition-colors"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => onEdit(row)}
            title={t("edit")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] hover:text-[#d4a00a] transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onToggleStatus(row, row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}
            title={row.status === "ACTIVE" ? t("suspend") : t("activate")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm transition-colors"
          >
            {row.status === "ACTIVE" ? (
              <ShieldAlert size={13} className="text-orange-500" />
            ) : (
              <CheckCircle size={13} className="text-green-500" />
            )}
          </button>
          <button
            onClick={() => onDelete(row)}
            title={t("delete")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};