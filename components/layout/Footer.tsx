import Link from "next/link";

const columns = [
  {
    title: "Self-Service",
    links: [
      { label: "Knowledge Base", href: "/knowledge" },
      { label: "Documentation", href: "/docs" },
      { label: "Learn", href: "/learn" },
      { label: "Ask AI", href: "/ask-ai" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Create a Ticket", href: "/tickets/new" },
      { label: "My Tickets", href: "/tickets" },
      { label: "System Status", href: "/status" },
      { label: "Support Hub", href: "/hub" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/account/profile" },
      { label: "Organization", href: "/account/organization" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200/70 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-sm font-bold text-white">C</span>
              <span className="text-[15px] font-semibold text-neutral-900">Cognite Support</span>
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              Answers first, humans always reachable.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-accent-600">
                      {link.label}
                    </Link>
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
