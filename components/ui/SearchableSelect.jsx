"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, Search, X, ChevronDown, Check } from "lucide-react";

export function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required,
  labelClass,
  inputClass,
  loading: optLoading,
  excludeId,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const availableOptions = excludeId
    ? options.filter((opt) => opt._id !== excludeId)
    : options;

  const selectedOption = availableOptions.find((opt) => opt._id === value);

  const filtered = availableOptions.filter(
    (opt) =>
      opt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.sku && opt.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opt.code && opt.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 280;

    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4, top: "auto" }
        : { top: rect.bottom + 4, bottom: "auto" }),
    });
  };

  const handleOpen = () => {
    if (optLoading || disabled) return;
    calculatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      return;
    }

    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) calculatePosition();
    };

    const handleResize = () => {
      if (isOpen) calculatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleSelect = (optId) => {
    onChange(optId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}

      <div ref={triggerRef}>
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className={`${inputClass} flex items-center justify-between gap-2 text-left min-h-[34px] ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {optLoading ? (
            <span className="flex items-center gap-2 text-neutral-400">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[10px]">Loading...</span>
            </span>
          ) : (
            <span
              className={
                selectedOption
                  ? "text-black dark:text-white truncate text-[11px] font-bold"
                  : "text-neutral-400 truncate text-[11px]"
              }
            >
              {selectedOption ? selectedOption.name : placeholder || "Choose..."}
            </span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && !optLoading && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === "Enter") handleClear(e); }}
                className="hover:text-red-500 transition-colors p-0.5"
              >
                <X size={12} />
              </span>
            )}
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      </div>

      {required && (
        <input
          type="text"
          value={value || ""}
          onChange={() => {}}
          required
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {isOpen &&
        !optLoading &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-7 pr-7 py-1.5 text-[10px] font-bold bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-700 rounded-sm outline-none focus:border-[#E9B10C]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-5 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                  No results found
                </div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt._id}
                    type="button"
                    onClick={() => handleSelect(opt._id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                      value === opt._id
                        ? "bg-[#E9B10C]/10 text-[#E9B10C]"
                        : "hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-black dark:text-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold truncate">{opt.name}</div>
                      {(opt.sku || opt.code) && (
                        <div className="text-[9px] text-neutral-400 font-medium truncate">
                          {opt.sku || opt.code}
                        </div>
                      )}
                    </div>
                    {value === opt._id && (
                      <Check size={12} className="shrink-0 text-[#E9B10C]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}