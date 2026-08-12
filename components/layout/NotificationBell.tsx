"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { notifications, unreadCount } from "@/lib/mock-data/notifications";
import { relativeTime, cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = unreadCount();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-danger-500" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-neutral-200 bg-neutral-0 shadow-[var(--shadow-popover)]">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">Notifications</p>
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-xs font-medium text-accent-600 hover:text-accent-700">
              View all
            </Link>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex gap-3 border-b border-neutral-50 px-4 py-3 last:border-0 hover:bg-neutral-50"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    n.read ? "bg-transparent" : "bg-accent-500",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", n.read ? "text-neutral-600" : "font-semibold text-neutral-900")}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{n.body}</p>
                  <p className="mt-1 text-[11px] text-neutral-400">{relativeTime(n.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
