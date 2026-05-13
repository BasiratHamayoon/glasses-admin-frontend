"use client";
import { 
  LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

const ChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#111111] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] flex flex-col gap-6 shadow-sm">
      {/* Skeleton Header */}
      <div className="h-3 w-40 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
      {/* Skeleton Chart Area */}
      <div className="flex-1 w-full bg-neutral-100 dark:bg-neutral-900/50 rounded animate-pulse"></div>
    </div>
  );
};

export const DailyTrendChart = ({ data, loading }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  if (loading) return <ChartSkeleton />;
  if (!data || data.length === 0) return <div className="h-[350px] flex items-center justify-center text-[10px] uppercase font-bold text-neutral-500 border border-dashed rounded-sm">{t('noTrendData') || 'No trend data'}</div>;

  const formattedData = data.map(item => ({ 
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
    revenue: item.revenue 
  }));

  return (
    <div className="bg-white dark:bg-[#111111] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] shadow-sm">
      <h3 className="text-[10px] uppercase tracking-widest font-black mb-6 text-neutral-500">{t('dailyRevenueTrend') || 'Daily Revenue Trend'}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          {/* Ultra-light grid lines for premium look */}
          <CartesianGrid stroke={isDark ? '#262626' : '#e5e7eb'} strokeWidth={1} strokeOpacity={0.4} vertical={false} />
          
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: isDark ? '#737373' : '#a3a3a3', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fontSize: 10, fill: isDark ? '#737373' : '#a3a3a3', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={(val) => `SAR ${val}`} dx={-10} />
          
          <RechartsTooltip 
            cursor={{ stroke: isDark ? '#404040' : '#d4d4d8', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: isDark ? '#171717' : '#ffffff', 
              borderColor: isDark ? '#262626' : '#e5e5e5', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '900',
              boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
            }} 
            itemStyle={{ color: '#E9B10C' }} 
            formatter={(value) => [`SAR ${value.toLocaleString()}`, t('revenue') || 'Revenue']} 
          />
          
          <Line 
            type="monotone" 
            dataKey="revenue" 
            name={t('revenue') || 'Revenue'} 
            stroke="#E9B10C" 
            strokeWidth={2} // Thinner, more elegant line
            dot={{ r: 3, fill: isDark ? '#111111' : '#ffffff', stroke: '#E9B10C', strokeWidth: 1.5 }} // Beautiful hollow dots
            activeDot={{ r: 5, fill: '#E9B10C', stroke: isDark ? '#111111' : '#ffffff', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MonthlyComparisonChart = ({ data, loading }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  if (loading) return <ChartSkeleton />;
  if (!data || data.length === 0) return <div className="h-[350px] flex items-center justify-center text-[10px] uppercase font-bold text-neutral-500 border border-dashed rounded-sm">{t('noMonthlyData') || 'No monthly data'}</div>;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedData = data.map(item => ({ 
    name: `${monthNames[item.month - 1]} ${item.year}`, 
    Revenue: item.revenue, 
    Expenses: item.expenses, 
    Profit: item.profit 
  }));

  // Premium colors for the Profit line
  const profitColor = isDark ? '#d4d4d8' : '#475569'; // Silver in dark mode, Slate in light mode

  // Custom legend to strictly control the colors (fixes the black Profit icon on dark mode)
  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-6 pt-6">
        {payload.map((entry, index) => {
          const isProfit = entry.value === 'Profit';
          const iconColor = isProfit ? profitColor : entry.color;
          
          return (
            <li key={`item-${index}`} className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-neutral-600 dark:text-neutral-400">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: iconColor }}></span>
              {t(entry.value.toLowerCase()) || entry.value}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white dark:bg-[#111111] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm h-[350px] shadow-sm">
      <h3 className="text-[10px] uppercase tracking-widest font-black mb-6 text-neutral-500">{t('monthlyPnLComparison') || 'Monthly P&L Comparison'}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          {/* Ultra-light grid lines for premium look */}
          <CartesianGrid stroke={isDark ? '#262626' : '#e5e7eb'} strokeWidth={1} strokeOpacity={0.4} vertical={false} />
          
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? '#737373' : '#a3a3a3', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fontSize: 10, fill: isDark ? '#737373' : '#a3a3a3', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={(val) => `SAR ${val}`} dx={-10} />
          
          <RechartsTooltip 
            cursor={{ fill: isDark ? '#262626' : '#f3f4f6', opacity: 0.4 }}
            formatter={(value) => `SAR ${value.toLocaleString()}`} 
            contentStyle={{ 
              backgroundColor: isDark ? '#171717' : '#ffffff', 
              borderColor: isDark ? '#262626' : '#e5e5e5', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '900',
              boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
            }} 
          />
          
          <Legend content={renderCustomLegend} />
          
          <Bar dataKey="Revenue" fill="#E9B10C" radius={[2, 2, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Expenses" fill="#A3A3A3" radius={[2, 2, 0, 0]} maxBarSize={32} opacity={isDark ? 0.6 : 0.8} />
          <Line 
            type="monotone" 
            dataKey="Profit" 
            stroke={profitColor} 
            strokeWidth={2} // Thinner, more elegant line
            dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? '#111111' : '#ffffff', stroke: profitColor }} // Hollow dots
            activeDot={{ r: 5, fill: profitColor, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};