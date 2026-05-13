"use client";
import { BaseCard } from "../BaseCard";
import { Users, Store, Box, ShoppingCart, Wallet, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardStats = ({ stats }) => {
  const { t } = useLanguage();

  const users = stats?.users || {};
  const shops = stats?.shops || {};
  const products = stats?.products || {};
  const orders = stats?.orders || {};

  const todaySales = stats?.sales?.today || {};
  const monthSales = stats?.sales?.thisMonth || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard
        title={t("totalSystemUsers") || "Total System Users"}
        value={users.total ?? 0}
        icon={Users}
        subtitle={`${users.active ?? 0} ${t("active") || "Active"} · ${users.inactive ?? 0} ${t("inactive") || "Inactive"}`}
      />

      <BaseCard
        title={t("totalShops") || "Total Shops"}
        value={shops.total ?? 0}
        icon={Store}
        subtitle={`${shops.active ?? 0} ${t("active") || "Active"}`}
      />

      <BaseCard
        title={t("totalProducts") || "Total Products"}
        value={products.total ?? 0}
        icon={Box}
      />

      <BaseCard
        title={t("totalOrders") || "Total Orders"}
        value={orders.total ?? 0}
        icon={ShoppingCart}
        subtitle={`${orders.today ?? 0} ${t("today") || "Today"} · ${orders.thisMonth ?? 0} ${t("thisMonth") || "This Month"}`}
      />

      

      <BaseCard
        title={t("monthlyCollected") || "Monthly Collected"}
        value={`⃁ ${(monthSales.collected ?? 0).toLocaleString()}`}
        icon={Wallet}
        subtitle={`${monthSales.orders ?? 0} ${t("orders") || "Orders"}`}
      />

      <BaseCard
        title={t("due") || "Due"}
        value={`⃁ ${(monthSales.due ?? 0).toLocaleString()}`}
        icon={Clock}
        subtitle={t("pendingCollection") || "Pending Collection"}
      />
    </div>
  );
};