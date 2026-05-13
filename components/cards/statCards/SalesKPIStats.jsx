"use client";

import { BaseCard } from "../BaseCard";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  Percent,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

const GrowthBadge = ({ growth, trend }) => {
  if (growth === undefined || growth === null) return null;
  const isUp = trend === "up" || growth >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest ${
        isUp ? "text-green-500" : "text-red-500"
      }`}
    >
      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(growth)}%
    </span>
  );
};

export const SalesKPIStats = ({ summary }) => {
  const { t } = useLanguage();

  const kpis = summary?.kpis || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      <BaseCard
        title={t("totalRevenue")}
        value={
          <span className="flex items-center gap-1 text-[13px] sm:text-[15px] truncate">
            ⃁ {formatNum(kpis.totalRevenue?.value)}
          </span>
        }
        icon={TrendingUp}
        subtitle={
          <GrowthBadge
            growth={kpis.totalRevenue?.growth}
            trend={kpis.totalRevenue?.trend}
          />
        }
      />
      <BaseCard
        title={t("totalOrders")}
        value={
          <span className="text-[13px] sm:text-[15px] truncate">
            {String(kpis.totalOrders?.value || 0)}
          </span>
        }
        icon={ShoppingCart}
        subtitle={
          <GrowthBadge
            growth={kpis.totalOrders?.growth}
            trend={kpis.totalOrders?.trend}
          />
        }
      />
      <BaseCard
        title={t("uniqueCustomers")}
        value={
          <span className="text-[13px] sm:text-[15px] truncate">
            {String(kpis.uniqueCustomers?.value || 0)}
          </span>
        }
        icon={Users}
        subtitle={
          <GrowthBadge
            growth={kpis.uniqueCustomers?.growth}
            trend={kpis.uniqueCustomers?.trend}
          />
        }
      />
      <BaseCard
        title={t("totalItemsSold")}
        value={
          <span className="text-[13px] sm:text-[15px] truncate">
            {String(kpis.totalItemsSold?.value || 0)}
          </span>
        }
        icon={Package}
      />
      <BaseCard
        title={t("collectionRate")}
        value={
          <span className="text-[13px] sm:text-[15px] truncate">
            {kpis.collectionRate?.value || 0}%
          </span>
        }
        icon={Percent}
      />
      <BaseCard
        title={t("pendingCollection")}
        value={
          <span className="flex items-center gap-1 text-[13px] sm:text-[15px] truncate">
            ⃁ {formatNum(kpis.pendingCollection?.value)}
          </span>
        }
        icon={Wallet}
      />
    </div>
  );
};