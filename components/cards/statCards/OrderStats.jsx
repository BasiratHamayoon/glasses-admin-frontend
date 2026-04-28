"use client";
import { BaseCard } from "../BaseCard";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const OrderStats = ({ orders, type }) => {
  const { t } = useLanguage();
  
  const total = orders?.length || 0;
  const statusKey = type === 'pos' ? 'orderStatus' : 'status';

  const pending = orders?.filter(o => ['PENDING', 'pending', 'PROCESSING', 'processing'].includes(o[statusKey])).length || 0;
  const delivered = orders?.filter(o => ['COMPLETED', 'DELIVERED', 'delivered'].includes(o[statusKey])).length || 0;
  const cancelled = orders?.filter(o => ['CANCELLED', 'cancelled'].includes(o[statusKey])).length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BaseCard title={t("totalOrders") || "Total Orders"} value={total} icon={ShoppingBag} />
      <BaseCard title={t("pendingOrders") || "Pending"} value={pending} icon={Clock} />
      <BaseCard title={t("completedOrders") || "Completed/Delivered"} value={delivered} icon={CheckCircle} />
      <BaseCard title={t("cancelledOrders") || "Cancelled"} value={cancelled} icon={XCircle} />
    </div>
  );
};