"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

export const SalesOverviewChart = ({ graphData, title, subtitle }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const isDark = theme === "dark";
  const isArabic = language === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  const overall = graphData?.overall || {};
  const raw = overall.raw || [];

  const chartData = raw.map((item) => ({
    name: item.label || "",
    revenue: item.revenue || 0,
    orders: item.orders || 0,
    paid: item.paid || 0,
    due: item.due || 0,
  }));

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] animate-pulse" />
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] shadow-sm flex flex-col justify-between">
      <div
        className="flex justify-between items-start mb-4 gap-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div>
          <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
            {title || t("salesTrend")}
          </h3>
          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
            {subtitle || t("revenueOverTime")}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">
            {t("totalRevenue")}
          </p>
          <p className="text-sm font-black text-[#E9B10C]">
            ⃁ {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-[230px] w-full" dir="ltr">
        {chartData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
            <span className="text-[10px] uppercase font-bold text-neutral-400">
              {t("noDataAvailable")}
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E9B10C" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#E9B10C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 10,
                  fill: isDark ? "#737373" : "#a3a3a3",
                  fontWeight: "bold",
                }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />

              <YAxis
                tick={{
                  fontSize: 10,
                  fill: isDark ? "#737373" : "#a3a3a3",
                  fontWeight: "bold",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `⃁${val}`}
              />

              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? "#111111" : "#ffffff",
                  borderColor: isDark ? "#262626" : "#e5e5e5",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => [
                  `⃁ ${value.toLocaleString()}`,
                  name === "revenue"
                    ? t("revenue")
                    : name === "paid"
                    ? t("paid")
                    : name,
                ]}
                cursor={{
                  stroke: isDark ? "#262626" : "#e5e5e5",
                  strokeWidth: 1,
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E9B10C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 5, fill: "#E9B10C", strokeWidth: 0 }}
              />

              <Area
                type="monotone"
                dataKey="paid"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPaid)"
                activeDot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};