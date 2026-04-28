"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const MonitoringPerfTable = ({ performance = [] }) => {
  const { t } = useLanguage();
  
  const columns = [
    { header: t("shopName") || "Shop Name", accessor: "shopName" },
    { 
      header: t("totalSales") || "Total Sales", 
      render: (row) => <span className="font-black text-[#E9B10C]">{row.totalSales?.toLocaleString() || 0} SAR</span> 
    },
    { header: t("transactions") || "Transactions", render: (row) => <span className="font-bold">{row.transactionCount || 0}</span> },
    { 
      header: t("avgValue") || "Avg Value", 
      render: (row) => <span className="text-neutral-500 font-medium">{row.avgTransactionValue?.toFixed(2) || 0} SAR</span> 
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("performanceOverview") || "Performance Overview"}
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto">
        {/* Beautiful Empty State */}
        {performance.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center p-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <TrendingUp size={28} strokeWidth={2} />
            </div>
            <h4 className="text-[12px] uppercase font-black tracking-widest text-black dark:text-white mb-2">
              {t("noSalesData") || "No Sales Data Yet"}
            </h4>
            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest max-w-xs leading-relaxed">
              {t("noSalesDesc") || "When shops start recording completed sales, their performance metrics will automatically appear here."}
            </p>
          </div>
        ) : (
          <BaseTable columns={columns} data={performance} />
        )}
      </div>
    </div>
  );
};

export const MonitoringClosingTable = ({ closingStatus }) => {
  const { t } = useLanguage();
  
  const columns = [
    { 
      header: t("shopName") || "Shop", 
      render: (row) => <span className="font-bold text-black dark:text-white">{row.shop?.name || '-'}</span> 
    },
    { 
      header: t("status") || "Status", 
      render: (row) => (
        <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${row.isClosedToday ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.isClosedToday ? (t("closedToday") || "Closed") : (t("pending") || "Pending")}
        </span>
      )
    },
    { 
      header: t("currentBalance") || "Current Balance", 
      render: (row) => <span className="font-bold">{row.currentBalance?.toLocaleString() || 0} SAR</span> 
    },
    { 
      header: t("lastClosingDate") || "Last Closed On", 
      render: (row) => (
        <span className="text-[10px] text-neutral-500 font-medium">
          {row.lastClosingDate ? new Date(row.lastClosingDate).toLocaleDateString() : '-'}
        </span>
      ) 
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("dailyClosing") || "Daily Closing Status"}
        </h3>
        <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700">
          {closingStatus?.closedCount || 0} {t("closed") || "Closed"} / {closingStatus?.pendingCount || 0} {t("pending") || "Pending"}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <BaseTable columns={columns} data={closingStatus?.status || []} />
      </div>
    </div>
  );
};

export const PendingClosingsList = ({ closingStatus }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const pendingList = closingStatus?.status?.filter(s => !s.isClosedToday) || [];

  const handleApprove = (shopName) => toast.success(`${shopName} closing approved!`);
  const handleReject = (shopName) => toast.error(`${shopName} closing rejected.`);

  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("pendingClosings") || "Pending Closings"} ({pendingList.length})
        </h3>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-hide">
        {pendingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] animate-in fade-in duration-500">
             <div className="w-16 h-16 bg-neutral-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-green-500">
              <Check size={28} strokeWidth={3} />
            </div>
            <h4 className="text-[12px] uppercase font-black tracking-widest text-black dark:text-white mb-2">
              {t("allCaughtUp") || "All Caught Up!"}
            </h4>
            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
              {t("noPendingClosings") || "There are no pending shop closings to review."}
            </p>
          </div>
        ) : (
          pendingList.map((entry, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#1a1a1a] gap-4 transition-colors hover:border-[#E9B10C]" 
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-black dark:text-white">
                  {entry.shop?.name || 'Unknown Store'}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium mt-1">
                  {new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="font-black text-xl text-[#E9B10C]">
                {entry.currentBalance?.toLocaleString() || 0} SAR
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button onClick={() => handleApprove(entry.shop?.name)} className="flex-1 sm:flex-none px-4 py-2 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest font-bold bg-black dark:bg-white text-white dark:text-black rounded-sm hover:bg-green-500 hover:text-white transition-colors">
                  <Check size={12} strokeWidth={3} /> {t("approve") || "Approve"}
                </button>
                <button onClick={() => handleReject(entry.shop?.name)} className="flex-1 sm:flex-none px-4 py-2 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                  <X size={12} strokeWidth={3} /> {t("reject") || "Reject"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};