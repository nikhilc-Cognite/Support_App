"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { value: string; label: string; count?: number }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
            active === item.value
              ? "text-accent-700 dark:text-accent-300"
              : "text-neutral-500 hover:text-neutral-800",
          )}
        >
          {item.label}
          {typeof item.count === "number" && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                active === item.value ? "bg-accent-50 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300" : "bg-neutral-100 text-neutral-500",
              )}
            >
              {item.count}
            </span>
          )}
          {active === item.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent-600" />
          )}
        </button>
      ))}
    </div>
  );
}
