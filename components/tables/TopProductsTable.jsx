"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTable } from "./BaseTable";
import { Package } from "lucide-react";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

export const TopProductsTable = ({ data, loading }) => {
  const { t } = useLanguage();

  const shops = data?.shops || [];
  const [activeShopId, setActiveShopId] = useState("all");

  useEffect(() => {
    if (shops.length > 0 && activeShopId === "all") {
      setActiveShopId(shops[0]?.shopId || "all");
    }
  }, [shops]);

  const activeShop = shops.find((s) => s.shopId === activeShopId);
  const activeProducts = activeShop?.topProducts || [];

  const columns = [
    {
      header: t("rank"),
      render: (row) => (
        <span
          className={`text-[10px] font-black w-7 h-7 rounded-sm flex items-center justify-center border ${
            row.rank === 1
              ? "bg-[#E9B10C]/10 text-[#E9B10C] border-[#E9B10C]/30"
              : row.rank === 2
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
              : row.rank === 3
              ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
              : "border-transparent text-neutral-400"
          }`}
        >
          {String(row.rank)}
        </span>
      ),
    },
    {
      header: t("product"),
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image?.url ? (
            <img
              src={row.image.url}
              alt={row.productName}
              className="w-9 h-9 object-cover rounded-sm border border-neutral-200 dark:border-neutral-800"
            />
          ) : (
            <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-sm flex items-center justify-center">
              <Package size={14} className="text-neutral-400" />
            </div>
          )}
          <div>
            <div className="text-[11px] font-bold text-black dark:text-white max-w-[180px] truncate">
              {row.productName}
            </div>
            <div className="text-[9px] text-neutral-400 uppercase">
              {row.sku || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("qtySold"),
      render: (row) => (
        <span className="font-black text-black dark:text-white">
          {formatNum(row.totalQuantitySold)}
        </span>
      ),
    },
    {
      header: t("totalRevenue"),
      render: (row) => (
        <span className="font-black text-green-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalRevenue)}
        </span>
      ),
    },
    {
      header: t("totalOrders"),
      render: (row) => (
        <span className="font-bold text-blue-500">
          {formatNum(row.totalOrders)}
        </span>
      ),
    },
    {
      header: t("avgPrice"),
      render: (row) => (
        <span className="font-bold text-[#E9B10C] flex items-center gap-1">
          ⃁ {formatNum(row.avgSellingPrice)}
        </span>
      ),
    },
    {
      header: t("discount"),
      render: (row) => (
        <span className="font-bold text-red-500 flex items-center gap-1">
          ⃁ {formatNum(row.totalDiscount)}
        </span>
      ),
    },
    {
      header: t("revenueShare"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E9B10C] rounded-full"
              style={{ width: `${Math.min(row.revenueSharePercent || 0, 100)}%` }}
            />
          </div>
          <span className="text-[9px] font-black text-neutral-500">
            {row.revenueSharePercent || 0}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Package size={14} className="text-[#E9B10C]" />
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("topProductsByShop")}
        </h3>
      </div>

      {shops.length > 0 && (
        <div className="flex bg-neutral-50 dark:bg-[#0a0a0a] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide gap-1">
          {shops.map((shop) => (
            <button
              key={shop.shopId}
              onClick={() => setActiveShopId(shop.shopId)}
              className={`flex-none px-5 py-2 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeShopId === shop.shopId
                  ? "bg-neutral-800 text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {shop.shopName}
            </button>
          ))}
        </div>
      )}

      {activeShop && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4">
            <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
              {t("shop")}
            </div>
            <div className="text-[12px] font-black text-black dark:text-white">
              {activeShop.shopName}
            </div>
            <div className="text-[9px] text-neutral-400 uppercase">
              {activeShop.shopCode}
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4">
            <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
              {t("totalRevenue")}
            </div>
            <div className="text-[12px] font-black text-green-500 flex items-center gap-1">
              ⃁ {formatNum(activeShop.shopTotalRevenue)}
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4">
            <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
              {t("totalQtySold")}
            </div>
            <div className="text-[12px] font-black text-black dark:text-white">
              {formatNum(activeShop.shopTotalQuantity)}
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-4">
            <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
              {t("totalProducts")}
            </div>
            <div className="text-[12px] font-black text-[#E9B10C]">
              {activeProducts.length}
            </div>
          </div>
        </div>
      )}

      <BaseTable columns={columns} data={activeProducts} loading={loading} />
    </div>
  );
};