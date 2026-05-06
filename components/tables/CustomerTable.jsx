"use client";
import { BaseTable } from "./BaseTable";
import { Eye, Edit2, FileText, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CustomerTable = ({ data, loading, onView, onEdit, onAddPrescription }) => {
  const { t } = useLanguage();

  const getTierColor = (tier) => {
    const map = {
      PLATINUM: "text-purple-500",
      GOLD: "text-[#E9B10C]",
      SILVER: "text-neutral-400",
      BRONZE: "text-orange-500",
    };
    return map[tier] || "text-orange-500";
  };

  const getStatusColor = (row) => {
    if (row.status === "BLOCKED") return "bg-red-500/10 text-red-500";
    if (row.status === "VIP") return "bg-purple-500/10 text-purple-500";
    if (row.isActive) return "bg-green-500/10 text-green-500";
    return "bg-red-500/10 text-red-500";
  };

  const columns = [
    {
      header: t("customer"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-black text-black dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
            {row.customerId}
          </span>
          {row.tags && row.tags.length > 0 && (
            <div className="flex gap-1 mt-0.5 flex-wrap">
              {row.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[7px] uppercase font-black px-1 py-0.5 bg-[#E9B10C]/10 text-[#E9B10C] rounded-sm tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      header: t("contact"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-black dark:text-white">
            {row.phone}
          </span>
          <span className="text-[9px] text-neutral-500 truncate max-w-[140px]">
            {row.email || t("noEmail")}
          </span>
          {row.isWebsiteUser && (
            <span className="text-[7px] uppercase font-black px-1 py-0.5 bg-blue-500/10 text-blue-500 rounded-sm w-fit tracking-widest">
              {t("webUser")}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("loyaltyAndSpend"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-[9px] font-black uppercase tracking-widest ${getTierColor(row.loyaltyTier)}`}
          >
            {row.loyaltyTier || "BRONZE"}
          </span>
          <span className="text-[9px] text-neutral-500 font-bold">
            {t("pts")}: {row.loyaltyPoints || 0}
          </span>
          <span className="text-[9px] font-black text-black dark:text-white flex items-center gap-0.5">
            ⃁ {(row.totalSpent || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: t("orders"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <ShoppingBag size={10} className="text-[#E9B10C]" />
            <span className="text-[10px] font-black text-black dark:text-white">
              {row.orderCount ?? row.totalOrders ?? 0}
            </span>
          </div>
          {row.orderSummary && (
            <div className="flex gap-1 flex-wrap">
              <span className="text-[7px] font-black px-1 py-0.5 bg-green-500/10 text-green-500 rounded-sm uppercase tracking-widest">
                {row.orderSummary.completed} {t("done")}
              </span>
              {row.orderSummary.pending > 0 && (
                <span className="text-[7px] font-black px-1 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-sm uppercase tracking-widest">
                  {row.orderSummary.pending} {t("pending")}
                </span>
              )}
            </div>
          )}
          {row.lastPurchaseDate && (
            <span className="text-[8px] text-neutral-500">
              {new Date(row.lastPurchaseDate).toLocaleDateString()}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("recentProducts"),
      render: (row) => {
        const recentOrders = row.recentOrders || [];
        const products = recentOrders
          .flatMap((o) =>
            (o.items || []).map(
              (item) => item.productName || item.product?.name || null
            )
          )
          .filter(Boolean);

        if (!products.length) {
          return (
            <span className="text-[9px] font-bold text-neutral-500 uppercase">
              {t("none")}
            </span>
          );
        }

        return (
          <div className="flex flex-col gap-1 max-w-[160px]">
            {products.slice(0, 2).map((p, i) => (
              <span
                key={i}
                className="text-[9px] truncate bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded-sm font-medium"
              >
                {p}
              </span>
            ))}
            {products.length > 2 && (
              <span className="text-[8px] font-bold text-neutral-500">
                +{products.length - 2} {t("more")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: t("creditAndSource"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          {row.creditBalance > 0 && (
            <span className="text-[9px] font-black text-red-500 flex items-center gap-0.5">
              ⃁ {row.creditBalance.toLocaleString()} {t("due")}
            </span>
          )}
          <span className="text-[8px] uppercase font-bold text-neutral-500 tracking-widest">
            {(row.source || "WALK_IN").replace(/_/g, " ")}
          </span>
          {row.registeredShop?.name && (
            <span className="text-[8px] text-neutral-400 font-medium truncate max-w-[100px]">
              {row.registeredShop.name}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("status"),
      render: (row) => (
        <span
          className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${getStatusColor(row)}`}
        >
          {row.status || (row.isActive ? "ACTIVE" : "INACTIVE")}
        </span>
      ),
    },
    {
      header: t("actions"),
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onView(row)}
            title={t("viewProfile")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 hover:text-blue-500 transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(row)}
            title={t("editDetails")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-[#E9B10C] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onAddPrescription(row)}
            title={t("addPrescription")}
            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-purple-500 transition-colors"
          >
            <FileText size={14} />
          </button>
        </div>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};