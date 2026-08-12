"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/mock-data/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {docsNav.map((section) => (
        <div key={section.section}>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{section.section}</p>
          <ul className="mt-2 space-y-0.5">
            {section.items.map((item) => {
              const href = `/docs/${item.slug.join("/")}`;
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                      active ? "bg-accent-50 font-medium text-accent-700 dark:bg-accent-900/40 dark:text-accent-300" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
