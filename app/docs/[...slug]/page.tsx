import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MarkdownBody } from "@/components/MarkdownBody";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getDocBySlug, docPages } from "@/lib/mock-data/docs";
import { formatDate } from "@/lib/utils";
import { LifeBuoy, ThumbsUp, ThumbsDown } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/docs/[...slug]">) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  return { title: doc ? `${doc.title} — Docs — Cognite Support` : "Documentation" };
}

export default async function DocArticlePage({ params }: PageProps<"/docs/[...slug]">) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const related = docPages.filter((d) => d.section === doc.section && d.slug.join("/") !== doc.slug.join("/")).slice(0, 3);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Documentation", href: "/docs" }, { label: doc.section }, { label: doc.title }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">{doc.title}</h1>
      <p className="mt-1.5 text-sm text-neutral-500">{doc.summary}</p>
      <p className="mt-1 text-xs text-neutral-400">Last updated {formatDate(doc.updatedAt)}</p>

      <div className="mt-8">
        <MarkdownBody content={doc.body} />
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-medium text-neutral-800">Was this documentation clear?</p>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100">
            <ThumbsUp className="h-3.5 w-3.5" /> Yes
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100">
            <ThumbsDown className="h-3.5 w-3.5" /> No
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Related in {doc.section}</h2>
          <ul className="mt-3 space-y-2">
            {related.map((d) => (
              <li key={d.slug.join("/")}>
                <Link href={`/docs/${d.slug.join("/")}`} className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  {d.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card className="mt-10 flex items-center gap-4">
        <LifeBuoy className="h-5 w-5 shrink-0 text-accent-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">Something not working as documented?</p>
          <p className="text-sm text-neutral-500">Ask AI can check known issues, or create a ticket directly.</p>
        </div>
        <Button href="/tickets/new" size="sm" className="shrink-0">Create a ticket</Button>
      </Card>
    </div>
  );
}
