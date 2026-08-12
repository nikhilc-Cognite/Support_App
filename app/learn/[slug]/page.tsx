import { notFound } from "next/navigation";
import { PlayCircle, Clock, BarChart3 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getLearnItemBySlug, learnItems } from "@/lib/mock-data/learn";

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const item = getLearnItemBySlug(slug);
  return { title: item ? `${item.title} — Learn — Cognite Support` : "Learn" };
}

export default async function LearnDetailPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const item = getLearnItemBySlug(slug);
  if (!item) notFound();

  const more = learnItems.filter((l) => l.slug !== item.slug && l.product === item.product).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: item.title }]} />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge tone="accent">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Badge>
        <Badge tone="neutral">{item.difficulty}</Badge>
        <Badge tone="neutral">{item.product}</Badge>
      </div>
      <h1 className="mt-3 text-2xl font-semibold text-neutral-900">{item.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{item.summary}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{item.durationMinutes} minutes</span>
        <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" />{item.difficulty}</span>
      </div>

      <Card className="mt-8 flex aspect-video flex-col items-center justify-center gap-3 bg-ink-950">
        <PlayCircle className="h-14 w-14 text-white/80" />
        <p className="text-sm text-white/60">
          {typeof item.progress === "number" && item.progress > 0 && item.progress < 100
            ? `Resume at ${item.progress}%`
            : "Start"}
        </p>
      </Card>

      {typeof item.progress === "number" && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-accent-500" style={{ width: `${item.progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">{item.progress}% complete</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button>{item.progress ? "Resume" : "Start"} {item.type}</Button>
        <Button variant="secondary">Download materials</Button>
      </div>

      {more.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">More in {item.product}</h2>
          <div className="mt-3 space-y-2">
            {more.map((m) => (
              <a key={m.slug} href={`/learn/${m.slug}`} className="block rounded-lg border border-neutral-200 bg-neutral-0 p-4 hover:border-accent-300">
                <p className="text-sm font-medium text-neutral-900">{m.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{m.durationMinutes} min · {m.difficulty}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
