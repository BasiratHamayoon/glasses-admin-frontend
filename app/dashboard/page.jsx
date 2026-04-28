"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";

import { fetchDashboardStats, fetchWeeklySales, fetchSystemStatus } from "@/redux/actions/dashboardActions";
import { DashboardStats } from "@/components/cards/statCards/DashboardStats";
import { DashboardOverviewChart } from "@/components/charts/DashboardCharts";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const { stats, weeklySales, systemStatus, loading } = useSelector((state) => state.dashboard || {});
  const { user } = useSelector((state) => state.adminAuth || {});

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      dispatch(fetchDashboardStats());
      dispatch(fetchWeeklySales());
      dispatch(fetchSystemStatus());
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [dispatch]);

  if (loading && !stats) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      
      <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-[#E9B10C] tracking-widest uppercase">
            {t("welcomeBack") || "Welcome Back"}, {user?.name || "Admin"}
          </h1>
          <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1 tracking-widest">
            {t("dashboardOverview") || "Here is what's happening across your stores today."}
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-sm shadow-sm">
          {new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <DashboardOverviewChart weeklySales={weeklySales} />
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col h-[350px]">
          <h3 className="text-[11px] uppercase tracking-widest font-black mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            {t("systemStatus") || "System Status"}
          </h3>
          
          <div className="flex-1 space-y-4">
            
            <div className="flex justify-between items-center bg-neutral-50 dark:bg-[#0a0a0a] p-3 rounded-sm">
              <span className="text-[10px] uppercase font-bold text-neutral-500">{t("database") || "Database"}</span>
              <span className={`text-[10px] font-black flex items-center gap-1 ${systemStatus?.database?.isOnline ? 'text-green-500' : 'text-red-500'}`}>
                ● {systemStatus?.database?.isOnline ? t("online") || "Online" : t("offline") || "Offline"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-neutral-50 dark:bg-[#0a0a0a] p-3 rounded-sm">
              <span className="text-[10px] uppercase font-bold text-neutral-500">{t("serverUptime") || "Uptime"}</span>
              <span className="text-[10px] font-black">{systemStatus?.server?.uptime || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center bg-neutral-50 dark:bg-[#0a0a0a] p-3 rounded-sm">
              <span className="text-[10px] uppercase font-bold text-neutral-500">{t("memoryUsage") || "Memory (RSS)"}</span>
              <span className="text-[10px] font-black">{systemStatus?.server?.memoryUsage?.rss || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center bg-neutral-50 dark:bg-[#0a0a0a] p-3 rounded-sm">
              <span className="text-[10px] uppercase font-bold text-neutral-500">{t("userAccounts") || "User Accounts"}</span>
              <span className="text-[10px] font-black">
                {systemStatus?.activeUsers?.active || 0} / {systemStatus?.activeUsers?.total || 0}
              </span>
            </div>

            <div className="mt-auto pt-4 text-center">
              <p className="text-[8px] text-neutral-400 uppercase tracking-widest leading-relaxed">
                {t("moreStatsSoon") || "More detailed analytics will appear here as you process orders."}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}