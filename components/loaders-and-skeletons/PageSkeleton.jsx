"use client";
import { TableSkeleton } from "./TableSkeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm h-[104px]">
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
              <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* Tabs & Button Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="h-10 w-full sm:w-64 bg-neutral-200 dark:bg-[#111111] rounded-sm"></div>
        <div className="h-10 w-full sm:w-32 bg-neutral-200 dark:bg-[#111111] rounded-sm"></div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm">
        <div className="h-10 w-full sm:w-64 bg-neutral-100 dark:bg-[#1a1a1a] rounded-sm mb-6"></div>
        <TableSkeleton />
      </div>
    </div>
  );
}