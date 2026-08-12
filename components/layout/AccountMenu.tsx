"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Ticket, Building2, User, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { currentUser, currentOrganization } from "@/lib/mock-data/account";

const items = [
  { label: "Support Hub", href: "/hub", icon: LayoutDashboard },
  { label: "My Tickets", href: "/tickets", icon: Ticket },
  { label: "Organization", href: "/account/organization", icon: Building2 },
  { label: "Profile", href: "/account/profile", icon: User },
];

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-2 rounded-lg p-1 hover:bg-neutral-100"
        aria-label="Account menu"
      >
        <Avatar initials={currentUser.avatarInitials} size="sm" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-neutral-200 bg-neutral-0 p-1.5 shadow-[var(--shadow-popover)]">
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar initials={currentUser.avatarInitials} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">{currentUser.name}</p>
              <p className="truncate text-xs text-neutral-500">{currentOrganization.name}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-neutral-100" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <item.icon className="h-4 w-4 text-neutral-400" />
              {item.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-neutral-100" />
          <Link href="/login" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            <LogOut className="h-4 w-4 text-neutral-400" />
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}
