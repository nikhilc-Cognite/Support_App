"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function position() {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }

    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("touchstart", onPointerDown);
    }, 0);
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 items-center gap-2 rounded-lg p-1 hover:bg-neutral-100"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Avatar initials={currentUser.avatarInitials} size="sm" />
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: coords.top, right: coords.right }}
            className="fixed z-[300] w-64 rounded-lg border border-neutral-200 bg-neutral-0 p-1.5 shadow-[var(--shadow-popover)]"
          >
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
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <LogOut className="h-4 w-4 text-neutral-400" />
              Sign out
            </Link>
          </div>,
          document.body,
        )}
    </>
  );
}
