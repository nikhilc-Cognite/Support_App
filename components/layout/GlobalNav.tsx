"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, LifeBuoy, ExternalLink } from "lucide-react";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { IncidentBanner } from "@/components/layout/IncidentBanner";
import { Button } from "@/components/ui/Button";
import { CogniteLogo } from "@/components/brand/CogniteLogo";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Docs", href: "https://docs.cognite.com/", external: true },
  { label: "Learn", href: "https://hub.cognite.com/p/academy", external: true },
  { label: "Status", href: "https://status.cognite.com/", external: true },
];

function NavLink({
  href,
  external,
  className,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function GlobalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[100]">
      <IncidentBanner />
      <header className="border-b border-neutral-200/70 bg-neutral-0/95 shadow-[0_1px_0_0_rgb(11_12_16_/_0.02)] backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center">
            <CogniteLogo heightClassName="h-7" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                external={item.external}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  "text-neutral-500 hover:text-neutral-900",
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Search stays in the middle and cannot overlap the right controls */}
          <div className="mx-auto hidden min-w-0 max-w-md flex-1 md:block">
            <GlobalSearch variant="nav" />
          </div>

          {/* Explicit interactive cluster — always above search */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
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
            <AccountMenu />
            <button
              type="button"
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
                <NavLink
                  key={item.href}
                  href={item.href}
                  external={item.external}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  {item.label}
                  {item.external && <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />}
                </NavLink>
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
                <Button href="/ask-ai" variant="secondary" size="sm" className="flex-1" onClick={() => setMobileOpen(false)}>
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
