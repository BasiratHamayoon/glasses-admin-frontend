"use client";
import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

export function MultiSelect({ options, selected = [], onChange, placeholder }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Close when clicking outside (Standard Shadcn Popover behavior)
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (e, value) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Shadcn Select Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[36px] w-full items-center justify-between rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] px-3 py-1.5 text-[10px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#E9B10C] cursor-pointer transition-colors"
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-neutral-500 font-medium text-[10px] py-0.5">{placeholder}</span>
          ) : (
            selected.map((value) => {
              const label = options.find((opt) => opt.value === value)?.label || value;
              return (
                <span
                  key={value}
                  className="flex items-center gap-1 rounded-sm bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[9px] font-bold text-black dark:text-white"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(e, value)}
                    className="rounded-full outline-none hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                  >
                    <X size={10} className="text-neutral-500 hover:text-red-500" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Shadcn Select Content (Popover) */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 min-w-[8rem] overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] text-black dark:text-white shadow-md animate-in fade-in-80 zoom-in-95">
          <div className="max-h-60 overflow-y-auto p-1 scrollbar-hide">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-[10px] font-bold outline-none hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check size={14} className="text-[#E9B10C]" />}
                  </span>
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}