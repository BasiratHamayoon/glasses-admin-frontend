"use client";

export function TableSkeleton() {
  return (
    <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-sm">
      <div className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800 p-4 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="border-b border-neutral-100 dark:border-neutral-900 p-4 flex gap-4">
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}