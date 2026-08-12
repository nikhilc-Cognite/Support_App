import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IncidentStatusPill } from "@/components/ui/StatusPill";
import { incidents } from "@/lib/mock-data/status";
import { knowledgeArticles } from "@/lib/mock-data/knowledge";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

const severityTone = { minor: "neutral", major: "warning", critical: "danger" } as const;

export async function generateMetadata({ params }: PageProps<"/status/incidents/[id]">) {
  const { id } = await params;
  const incident = incidents.find((i) => i.id === id);
  return { title: incident ? `${incident.title} — Cognite Status` : "Incident — Cognite Status" };
}

export default async function IncidentDetailPage({ params }: PageProps<"/status/incidents/[id]">) {
  const { id } = await params;
  const incident = incidents.find((i) => i.id === id);
  if (!incident) notFound();

  const relatedArticles = knowledgeArticles.filter((a) => incident.relatedArticleSlugs?.includes(a.slug));
  const timeline = [...incident.updates].reverse();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Status", href: "/status" }, { label: incident.id }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-neutral-400">{incident.id}</p>
          <h1 className="mt-1 text-xl font-semibold text-neutral-900 sm:text-2xl">{incident.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={severityTone[incident.severity]} className="capitalize">{incident.severity}</Badge>
          <IncidentStatusPill status={incident.status} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500">
        <span>Affects {incident.affectedProducts.join(", ")}</span>
        <span>{incident.affectedRegions.join(", ")}</span>
        <span>Started {formatDateTime(incident.startedAt)}</span>
        {incident.resolvedAt && <span>Resolved {formatDateTime(incident.resolvedAt)}</span>}
      </div>

      <Card className="mt-6">
        <p className="text-sm font-semibold text-neutral-900">Customer impact</p>
        <p className="mt-1.5 text-sm text-neutral-600">{incident.customerImpact}</p>
      </Card>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Timeline</h2>
        <ol className="mt-4 space-y-6 border-l border-neutral-200 pl-5">
          {timeline.map((u, i) => (
            <li key={u.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white",
                  i === 0 ? "bg-accent-600" : "bg-neutral-300",
                )}
              />
              <div className="flex flex-wrap items-center gap-2">
                <IncidentStatusPill status={u.status} />
                <span className="text-xs text-neutral-400">{formatDateTime(u.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm text-neutral-700">{u.message}</p>
            </li>
          ))}
        </ol>
      </section>

      {relatedArticles.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Related documentation</h2>
          <ul className="mt-3 space-y-2">
            {relatedArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/knowledge/article/${a.slug}`} className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  {a.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2.5 text-sm text-neutral-700">
          <Bell className="h-4 w-4 text-neutral-400" />
          Get notified when this incident updates
        </div>
        <Button variant="secondary" size="sm">Subscribe</Button>
      </div>
    </div>
  );
}
