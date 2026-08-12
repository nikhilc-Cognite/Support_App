import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200/80 bg-neutral-0 shadow-[var(--shadow-card)]",
        padding && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardLink({
  href,
  children,
  className,
  padding = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl border border-neutral-200/80 bg-neutral-0 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[var(--shadow-elevated)]",
        padding && "p-6",
        className,
      )}
    >
      {children}
    </Link>
  );
}
