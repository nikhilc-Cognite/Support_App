import Link from "next/link";
import type { ReactNode } from "react";
import { CogniteLogo } from "@/components/brand/CogniteLogo";

const columns = [
  {
    title: "Self-Service",
    links: [
      { label: "Documentation", href: "https://docs.cognite.com/", external: true },
      { label: "Learn", href: "https://hub.cognite.com/p/academy", external: true },
      { label: "Ask AI", href: "/ask-ai" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Create a Ticket", href: "/tickets/new" },
      { label: "My Tickets", href: "/tickets" },
      { label: "System Status", href: "https://status.cognite.com/", external: true },
      { label: "Support Hub", href: "/hub" },
      { label: "Community Forum", href: "https://hub.cognite.com/product-user-community-428", external: true },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/account/profile" },
    ],
  },
];

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-accent-600">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="text-sm text-neutral-600 hover:text-accent-600">
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200/70 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center">
              <CogniteLogo heightClassName="h-7" />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} external={link.external}>
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-neutral-400">© 2026 Cognite, Inc. All rights reserved.</p>
          <p className="text-xs text-neutral-400">Powered by the Cognite Support Platform</p>
        </div>
      </div>
    </footer>
  );
}
