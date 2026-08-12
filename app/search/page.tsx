import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { search, SearchResult } from "@/lib/search";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchX } from "lucide-react";

export const metadata = { title: "Search — Cognite Support" };

const groupOrder: SearchResult["group"][] = ["Knowledge", "Documentation", "Known Issues", "My Tickets", "Learn"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const results = search(q);

  const grouped = groupOrder
    .map((group) => ({ group, items: results.filter((r) => r.group === group) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Search" }]} />
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">
        {q ? (
          <>Results for &ldquo;{q}&rdquo;</>
        ) : (
          "Search"
        )}
      </h1>
      {q && <p className="mt-1 text-sm text-neutral-500">{results.length} result{results.length !== 1 ? "s" : ""} across Knowledge, Docs, Status, and your tickets.</p>}

      {q && (
        <Link
          href={`/ask-ai?q=${encodeURIComponent(q)}`}
          className="mt-5 flex items-center gap-3 rounded-lg border border-accent-100 bg-accent-50 px-4 py-3.5 transition-colors hover:bg-accent-100/70 dark:border-accent-800 dark:bg-accent-900/30 dark:hover:bg-accent-900/45"
        >
          <Sparkles className="h-5 w-5 shrink-0 text-accent-600" />
          <span className="flex-1 text-sm text-accent-900 dark:text-accent-200">
            Prefer a direct answer? Ask AI: <span className="font-medium">&ldquo;{q}&rdquo;</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-accent-600" />
        </Link>
      )}

      {!q && (
        <p className="mt-6 text-sm text-neutral-500">Enter a search term in the bar above to search Knowledge, Docs, Status, Learn, and your tickets.</p>
      )}

      {q && results.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={SearchX}
            title="No results found"
            description="Try different keywords, ask our AI assistant directly, or create a ticket if you need help from a person."
            action={
              <div className="flex gap-2">
                <Button href={`/ask-ai?q=${encodeURIComponent(q)}`} variant="secondary" size="sm">Ask AI instead</Button>
                <Button href="/tickets/new" size="sm">Create a ticket</Button>
              </div>
            }
          />
        </div>
      )}

      <div className="mt-8 space-y-8">
        {grouped.map(({ group, items }) => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{group}</p>
            <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
              {items.map((r) => (
                <Link key={r.id + r.group} href={r.href} className="block px-5 py-4 hover:bg-neutral-50">
                  <p className="text-sm font-medium text-neutral-900">{r.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{r.snippet}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
