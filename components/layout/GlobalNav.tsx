"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, LifeBuoy } from "lucide-react";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { IncidentBanner } from "@/components/layout/IncidentBanner";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Knowledge", href: "/knowledge" },
  { label: "Docs", href: "/docs" },
  { label: "Learn", href: "/learn" },
  { label: "Status", href: "/status" },
];

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40">
      <IncidentBanner />
      <header className="border-b border-neutral-200/70 bg-neutral-0/80 shadow-[0_1px_0_0_rgb(11_12_16_/_0.02)] backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-7 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-sm font-bold text-white">
              C
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
              Cognite <span className="font-normal text-neutral-400">Support</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-accent-600" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-1 justify-center md:flex">
            <GlobalSearch variant="nav" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <Button href="/ask-ai" variant="ghost" size="sm" icon={<Sparkles className="h-4 w-4 text-accent-600" />}>
                Ask AI
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button href="/tickets/new" size="sm" icon={<LifeBuoy className="h-4 w-4" />}>
                Get Help
              </Button>
            </div>
            <ThemeToggle />
            <NotificationBell />
            <div className="hidden sm:block">
              <AccountMenu />
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="border-t border-neutral-100 px-4 py-2.5 md:hidden">
          <GlobalSearch variant="nav" />
        </div>

        {mobileOpen && (
          <div className="border-t border-neutral-200 bg-neutral-0 px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-0.5">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1.5 h-px bg-neutral-100" />
              <Link href="/hub" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Support Hub
              </Link>
              <Link href="/tickets" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                My Tickets
              </Link>
              <Link href="/account/organization" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Organization
              </Link>
              <Link href="/account/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Profile
              </Link>
              <div className="my-1.5 h-px bg-neutral-100" />
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-sm font-medium text-neutral-700">Theme</span>
                <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50" />
              </div>
              <div className="my-1.5 h-px bg-neutral-100" />
              <div className="flex gap-2 px-1 pt-1">
                <Button href="/ask-ai" variant="secondary" size="sm" className="flex-1">
                  Ask AI
                </Button>
                <Button href="/tickets/new" size="sm" className="flex-1">
                  Get Help
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
