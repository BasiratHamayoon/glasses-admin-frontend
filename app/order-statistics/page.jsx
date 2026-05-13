"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  fetchSalesSummary,
  fetchShopLeaderboard,
  fetchShopComparison,
  fetchSalesGraphData,
  fetchTopProducts,
} from "@/redux/actions/orderStatsActions";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { SalesKPIStats } from "@/components/cards/statCards/SalesKPIStats";
import { SalesOverviewChart } from "@/components/charts/SalesOverviewChart";
import { SalesLeaderboardTable } from "@/components/tables/SalesLeaderboardTable";
import { SalesComparisonTable } from "@/components/tables/SalesComparisonTable";
import { TopProductsTable } from "@/components/tables/TopProductsTable";

export default function OrderStatisticsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("chart");
  const [graphGroupBy, setGraphGroupBy] = useState("day");

  const hasFetched = useRef(false);
  const activeTabRef = useRef("chart");
  const chartFetched = useRef(false);
  const leaderboardFetched = useRef(false);
  const comparisonFetched = useRef(false);
  const topProductsFetched = useRef(false);

  const orderStats = useSelector((state) => state.orderStats);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchSalesSummary({}));
    dispatch(fetchSalesGraphData({ groupBy: graphGroupBy }));
    chartFetched.current = true;
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    activeTabRef.current = tab;

    if (tab === "chart" && !chartFetched.current) {
      chartFetched.current = true;
      dispatch(fetchSalesGraphData({ groupBy: graphGroupBy }));
    }

    if (tab === "leaderboard" && !leaderboardFetched.current) {
      leaderboardFetched.current = true;
      dispatch(fetchShopLeaderboard({ limit: 10 }));
    }

    if (tab === "comparison" && !comparisonFetched.current) {
      comparisonFetched.current = true;
      dispatch(fetchShopComparison({}));
    }

    if (tab === "topProducts" && !topProductsFetched.current) {
      topProductsFetched.current = true;
      dispatch(fetchTopProducts({ limit: 10 }));
    }
  };

  const handleGraphGroupByChange = (groupBy) => {
    setGraphGroupBy(groupBy);
    dispatch(fetchSalesGraphData({ groupBy }));
  };

  const handleRefresh = () => {
    dispatch(fetchSalesSummary({}));

    if (activeTabRef.current === "chart") {
      dispatch(fetchSalesGraphData({ groupBy: graphGroupBy }));
    }
    if (activeTabRef.current === "leaderboard") {
      dispatch(fetchShopLeaderboard({ limit: 10 }));
    }
    if (activeTabRef.current === "comparison") {
      dispatch(fetchShopComparison({}));
    }
    if (activeTabRef.current === "topProducts") {
      dispatch(fetchTopProducts({ limit: 10 }));
    }

    toast.success(t("dataRefreshed"));
  };

  if (orderStats.summary.loading && !orderStats.summary.data) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <SalesKPIStats summary={orderStats.summary.data} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full sm:w-auto">
          {[
            { id: "chart", label: t("salesChart") },
            { id: "leaderboard", label: t("shopLeaderboard") },
            { id: "comparison", label: t("shopComparison") },
            { id: "topProducts", label: t("topProducts") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-[10px] uppercase font-black tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
        >
          <RefreshCw size={13} />
          {t("refresh")}
        </button>
      </div>

      {activeTab === "chart" && (
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
              {t("salesTrend")}
            </h3>
            <div className="flex bg-neutral-100 dark:bg-[#0a0a0a] p-0.5 rounded-sm border border-neutral-200 dark:border-neutral-800">
              {[
                { id: "day", label: t("daily") },
                { id: "week", label: t("weekly") },
                { id: "month", label: t("monthly") },
                { id: "year", label: t("yearly") },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleGraphGroupByChange(opt.id)}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-black rounded-sm transition-all ${
                    graphGroupBy === opt.id
                      ? "bg-[#E9B10C] text-black shadow-sm"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <SalesOverviewChart
            graphData={orderStats.graphData.data}
            title={t("revenueAndCollection")}
            subtitle={`${t("groupedBy")}: ${t(graphGroupBy)}`}
          />
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
          <SalesLeaderboardTable
            data={orderStats.leaderboard.data}
            loading={orderStats.leaderboard.loading}
          />
        </div>
      )}

      {activeTab === "comparison" && (
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
          <SalesComparisonTable
            data={orderStats.comparison.data}
            loading={orderStats.comparison.loading}
          />
        </div>
      )}

      {activeTab === "topProducts" && (
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
          <TopProductsTable
            data={orderStats.topProducts.data}
            loading={orderStats.topProducts.loading}
          />
        </div>
      )}
    </div>
  );
}