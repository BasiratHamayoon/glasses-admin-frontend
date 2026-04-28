"use client";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardOverviewChart = ({ weeklySales }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  // Map the backend data to match the format expected by Recharts
  const chartData = weeklySales?.map(item => ({
    name: item.day,
    sales: item.revenue
  })) || [];

  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div>
          <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
            {t("weeklySalesTrend") || "Weekly Sales Trend"}
          </h3>
          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
            {t("revenueOver7Days") || "Revenue over the last 7 days"}
          </p>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 min-h-0 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E9B10C" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#E9B10C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: isDark ? '#525252' : '#a3a3a3', fontWeight: 'bold' }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            
            <YAxis 
              tick={{ fontSize: 10, fill: isDark ? '#525252' : '#a3a3a3', fontWeight: 'bold' }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `$${val}`} 
            />
            
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#111111' : '#ffffff', 
                borderColor: isDark ? '#262626' : '#e5e5e5', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: '900',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
              itemStyle={{ color: '#E9B10C' }}
              cursor={{ stroke: isDark ? '#262626' : '#e5e5e5', strokeWidth: 1 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#E9B10C" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorSales)" 
              activeDot={{ r: 5, fill: '#E9B10C', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};