import Link from "next/link";
import { CheckCircle2, AlertTriangle, Bell, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ComponentStatusPill, IncidentStatusPill } from "@/components/ui/StatusPill";
import { statusComponents, incidents, overallStatus, activeIncidents } from "@/lib/mock-data/status";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "System Status — Cognite Support" };

export default function StatusPage() {
  const status = overallStatus();
  const active = activeIncidents();
  const resolvedRecent = incidents.filter((i) => i.status === "resolved").slice(0, 3);

  const groups = Array.from(new Set(statusComponents.map((c) => c.group)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Status" }]} />

      <div
        className={cn(
          "mt-6 flex items-center justify-between gap-4 rounded-lg border p-5",
          status === "operational"
            ? "border-success-50 bg-success-50 dark:border-success-900 dark:bg-success-900/30"
            : "border-warning-50 bg-warning-50 dark:border-warning-900 dark:bg-warning-900/30",
        )}
      >
        <div className="flex items-center gap-3">
          {status === "operational" ? (
            <CheckCircle2 className="h-6 w-6 shrink-0 text-success-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 shrink-0 text-warning-500" />
          )}
          <div>
            <p className={cn("text-lg font-semibold", status === "operational" ? "text-success-700 dark:text-success-300" : "text-warning-700 dark:text-warning-300")}>
              {status === "operational" ? "All Systems Operational" : "Some systems are experiencing issues"}
            </p>
            <p className="mt-0.5 text-sm text-neutral-600">Last checked just now · Updates automatically</p>
          </div>
        </div>
        <div className="hidden shrink-0 sm:block">
          <Button variant="secondary" size="sm" icon={<Bell className="h-4 w-4" />}>
            Subscribe
          </Button>
        </div>
      </div>

      {active.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Active incidents</h2>
          <div className="mt-3 space-y-3">
            {active.map((inc) => (
              <Link key={inc.id} href={`/status/incidents/${inc.id}`} className="block rounded-lg border border-neutral-200 bg-neutral-0 p-4 hover:border-accent-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900">{inc.title}</p>
                  <IncidentStatusPill status={inc.status} />
                </div>
                <p className="mt-1.5 text-sm text-neutral-500">{inc.customerImpact}</p>
                <p className="mt-2 text-xs text-neutral-400">
                  Affects {inc.affectedProducts.join(", ")} · Started {formatDateTime(inc.startedAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Component status</h2>
        <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
          {groups.map((group) => (
            <div key={group} className="px-5 py-3">
              <p className="py-1.5 text-xs font-semibold text-neutral-400">{group}</p>
              {statusComponents
                .filter((c) => c.group === group)
                .map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-800">{c.name}</span>
                    <ComponentStatusPill status={c.status} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Recently resolved</h2>
          <Link href="/status/history" className="flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
            Full history <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {resolvedRecent.map((inc) => (
            <Link key={inc.id} href={`/status/incidents/${inc.id}`} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-0 p-4 hover:border-accent-300">
              <div>
                <p className="text-sm font-medium text-neutral-900">{inc.title}</p>
                <p className="mt-0.5 text-xs text-neutral-400">{formatDateTime(inc.startedAt)}</p>
              </div>
              <span className="text-xs font-medium text-success-600">Resolved</span>
            </Link>
          ))}
        </div>
      </section>

      <Card className="mt-8">
        <p className="text-sm font-semibold text-neutral-900">Scheduled maintenance</p>
        <p className="mt-1.5 text-sm text-neutral-600">
          Database upgrade — US region · Aug 14, 2026, 02:00–03:00 UTC. Brief read-only mode expected during cutover.
        </p>
      </Card>
    </div>
  );
}
