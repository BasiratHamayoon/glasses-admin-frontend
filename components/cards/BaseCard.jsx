"use client";
export const BaseCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col gap-4 group hover:border-[#E9B10C] transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">{title}</h3>
        {Icon && <Icon size={16} className="text-neutral-400 group-hover:text-[#E9B10C] transition-colors" />}
      </div>
      <div>
        <p className="text-2xl font-black text-black dark:text-white">{value}</p>
        {subtitle && <p className="text-[10px] text-neutral-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};