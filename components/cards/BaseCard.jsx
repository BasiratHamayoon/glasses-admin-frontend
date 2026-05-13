"use client";
export const BaseCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm flex flex-col gap-3 sm:gap-4 group hover:border-[#E9B10C] transition-colors duration-300">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 leading-relaxed">
          {title}
        </h3>
        {Icon && (
          <Icon
            size={16}
            className="text-neutral-400 group-hover:text-[#E9B10C] transition-colors shrink-0"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-lg sm:text-xl md:text-2xl font-black text-black dark:text-white truncate">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] text-neutral-500 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};