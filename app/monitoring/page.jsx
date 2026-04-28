"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchFullMonitoring } from "@/redux/actions/monitoringActions";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { MonitorStats, ShopStatusPanel } from "@/components/cards/statCards/MonitoringStats"; 
import { MonitoringPerfTable, MonitoringClosingTable, PendingClosingsList } from "@/components/tables/MonitoringTables";

const slimScrollbarX = "overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full";

const slimScrollbarY = "overflow-y-auto scroll-smooth pr-1 rtl:pr-0 rtl:pl-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [&_*::-webkit-scrollbar]:w-1.5 [&_*::-webkit-scrollbar]:h-1.5 [&_*::-webkit-scrollbar-track]:bg-transparent [&_*::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&_*::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&_*::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&_*::-webkit-scrollbar-thumb]:bg-neutral-700 [&_*::-webkit-scrollbar-thumb]:rounded-full";

export default function MonitoringPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState("ALL");

  const { data, loading } = useSelector(state => state.monitoring);
  
  useEffect(() => {
    dispatch(fetchFullMonitoring());
  }, [dispatch]);

  if (loading || !data?.dashboard) return <PageSkeleton />;

  const { dashboard, performance = [], pendingDues, staffOverview, closingStatus } = data;
  const shops = dashboard.shops || [];

  const getShopPerformance = (id) => performance?.find(p => p._id === id) || {};
  const getShopStaff = (id) => staffOverview?.find(s => s._id === id) || { managers: 0, cashiers: 0, salesStaff: 0, totalStaff: 0 };
  const getShopClosing = (id) => closingStatus?.status?.find(c => c.shop?._id === id) || null;
  const getShopDues = (id) => pendingDues?.wallets?.find(w => w.shop?._id === id) || {};

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      
      <MonitorStats dashboard={dashboard} />

      <div className="w-full border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div 
          key={language} 
          className={`flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm max-w-full ${slimScrollbarX}`}
        >
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm whitespace-nowrap ${
              activeTab === "ALL" ? 'bg-[#E9B10C] text-black shadow-sm' : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {t("allShops") || "Global Overview"}
          </button>
          
          {shops.map(shop => (
            <button
              key={shop._id} 
              onClick={() => setActiveTab(shop._id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === shop._id ? 'bg-[#E9B10C] text-black shadow-sm' : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {shop.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <div className="w-full">
          
          {activeTab === "ALL" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                <div className={`xl:col-span-6 h-[400px] border border-neutral-200 dark:border-neutral-800/60 rounded-sm ${slimScrollbarY}`}>
                  <PendingClosingsList closingStatus={closingStatus} />
                </div>
                
                <div className={`xl:col-span-6 h-[400px] border border-neutral-200 dark:border-neutral-800/60 rounded-sm ${slimScrollbarY}`}>
                  <MonitoringClosingTable closingStatus={closingStatus} />
                </div>
              </div>

              <div className={`h-[350px] border border-neutral-200 dark:border-neutral-800/60 rounded-sm ${slimScrollbarY}`}>
                <MonitoringPerfTable performance={performance} />
              </div>
            </div>
          )}

          {activeTab !== "ALL" && (
            <div className="animate-in fade-in duration-300 space-y-6">
              
              <ShopStatusPanel 
                closing={getShopClosing(activeTab)}
                staff={getShopStaff(activeTab)}
                dues={getShopDues(activeTab)}
                shopName={shops.find(s => s._id === activeTab)?.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm">
                  <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3 text-[#E9B10C]">{t("staffOverview") || "Staff Overview"}</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center"><span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Managers</span><span className="font-black bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 w-8 h-8 rounded-sm flex items-center justify-center text-[10px]">{getShopStaff(activeTab).managers || 0}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Cashiers</span><span className="font-black bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 w-8 h-8 rounded-sm flex items-center justify-center text-[10px]">{getShopStaff(activeTab).cashiers || 0}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Sales Staff</span><span className="font-black bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 w-8 h-8 rounded-sm flex items-center justify-center text-[10px]">{getShopStaff(activeTab).salesStaff || 0}</span></div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-black mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3 text-[#E9B10C]">{t("performanceOverview") || "Performance"}</h3>
                    <div className="space-y-5">
                      <div className="flex justify-between items-end border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
                        <span className="text-[11px] text-neutral-500 font-bold uppercase">Total Sales</span>
                        <span className="text-2xl font-black text-green-500">{getShopPerformance(activeTab).totalSales?.toLocaleString() || 0} SAR</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] text-neutral-500 font-bold uppercase">Transactions</span>
                        <span className="text-lg font-black text-black dark:text-white">{getShopPerformance(activeTab).transactionCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}