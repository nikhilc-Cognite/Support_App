import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { incidents } from "@/lib/mock-data/status";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Incident History — Cognite Support" };

const severityTone = { minor: "neutral", major: "warning", critical: "danger" } as const;

export default function IncidentHistoryPage() {
  const sorted = [...incidents].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Status", href: "/status" }, { label: "History" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Incident History</h1>
      <p className="mt-1.5 text-sm text-neutral-500">Every incident from the last 90 days, resolved and ongoing.</p>

      <div className="mt-8 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
        {sorted.map((inc) => (
          <Link key={inc.id} href={`/status/incidents/${inc.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-neutral-50">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-400">{inc.id}</span>
                <Badge tone={severityTone[inc.severity]} className="capitalize">{inc.severity}</Badge>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-neutral-900">{inc.title}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{formatDate(inc.startedAt)} · {inc.affectedProducts.join(", ")}</p>
            </div>
            <span className={inc.status === "resolved" ? "shrink-0 text-xs font-medium text-success-600" : "shrink-0 text-xs font-medium text-warning-600"}>
              {inc.status === "resolved" ? "Resolved" : "Ongoing"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
