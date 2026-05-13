"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// 12 Months of Simulated Data 
// (Replace this with API data once your backend adds a monthly aggregation endpoint)
const mockData = [
  { name: "Jan", stockIn: 4200, stockOut: 2400 },
  { name: "Feb", stockIn: 3800, stockOut: 2100 },
  { name: "Mar", stockIn: 5100, stockOut: 4800 },
  { name: "Apr", stockIn: 4700, stockOut: 3900 },
  { name: "May", stockIn: 5800, stockOut: 4200 },
  { name: "Jun", stockIn: 6300, stockOut: 5100 },
  { name: "Jul", stockIn: 5900, stockOut: 4800 },
  { name: "Aug", stockIn: 7200, stockOut: 6100 },
  { name: "Sep", stockIn: 8100, stockOut: 7500 },
  { name: "Oct", stockIn: 6800, stockOut: 6200 },
  { name: "Nov", stockIn: 9500, stockOut: 8900 },
  { name: "Dec", stockIn: 11200, stockOut: 9800 },
];

export const StockMovementChart = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm w-full h-[450px] flex flex-col shadow-sm">
      
      {/* Chart Header */}
      <div className="mb-6 flex justify-between items-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <h3 className="text-[11px] uppercase tracking-widest font-black text-black dark:text-white">
          {t("stockMovement") || "Stock Movement (12 Months)"}
        </h3>
        
        {/* Legend */}
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#E9B10C] shadow-[0_0_8px_#E9B10C]"></div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Stock In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-600"></div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Stock Out</span>
          </div>
        </div>
      </div>
      
      {/* Chart Body */}
      <div className="flex-1 w-full h-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            
            <defs>
              <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E9B10C" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#E9B10C" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#525252" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#525252" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.15} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }} dy={15} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }} dx={-10} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '4px', fontSize: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ fontWeight: 'black', padding: '2px 0' }}
              cursor={{ stroke: '#E9B10C', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#E9B10C" strokeWidth={3} fillOpacity={1} fill="url(#colorStockIn)" activeDot={{ r: 6, fill: '#E9B10C', stroke: '#111', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#525252" strokeWidth={3} fillOpacity={1} fill="url(#colorStockOut)" activeDot={{ r: 6, fill: '#525252', stroke: '#111', strokeWidth: 2 }} />
          
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};