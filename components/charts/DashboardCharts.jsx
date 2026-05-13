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

export const DashboardOverviewChart = ({ weeklySales }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const isDark = theme === "dark";
  const isArabic = language === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe checks if Redux holds the inner payload object directly or nested
  const dataPayload = weeklySales?.data || weeklySales || {};
  const weeklyData = Array.isArray(dataPayload) ? dataPayload : dataPayload.weeklySales || [];
  const totalCollected = dataPayload.summary?.totalCollected ?? 0;
  const weekStart = dataPayload.weekStart || "";
  const weekEnd = dataPayload.weekEnd || "";

  const chartData = weeklyData.map((item) => ({
    name: item.day || "",
    date: item.date || "",
    collected: item.collected ?? 0,
  }));

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] animate-pulse" />
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4" dir={isArabic ? "rtl" : "ltr"}>
        <div>
          <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
            {t("weeklyCollectionTrend") || "Weekly Collection Trend"}
          </h3>
          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
            {weekStart && weekEnd ? `${weekStart} → ${weekEnd}` : t("weeklyCollected") || "Weekly Collected"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">
            {t("totalCollected") || "Total Collected"}
          </p>
          <p className="text-sm font-black text-[#E9B10C]">
            ⃁ {totalCollected.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[230px] w-full" dir="ltr">
        {chartData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
            <span className="text-[10px] uppercase font-bold text-neutral-400">
              {t("noDataAvailable") || "No Data Available"}
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E9B10C" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#E9B10C" stopOpacity={0} />
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
                formatter={(value) => [`⃁ ${value}`, t("collected") || "Collected"]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.date ? `${label} (${item.date})` : label;
                }}
                cursor={{
                  stroke: isDark ? "#262626" : "#e5e5e5",
                  strokeWidth: 1,
                }}
              />

              <Area
                type="monotone"
                dataKey="collected"
                stroke="#E9B10C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCollected)"
                activeDot={{ r: 5, fill: "#E9B10C", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};