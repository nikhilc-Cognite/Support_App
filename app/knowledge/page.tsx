import Link from "next/link";
import { ArrowRight, LifeBuoy, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { knowledgeCategories, knowledgeArticles, trendingArticles } from "@/lib/mock-data/knowledge";

export const metadata = { title: "Knowledge Base — Cognite Support" };

export default function KnowledgePage() {
  const verifiedFixCount = knowledgeArticles.filter((a) => (a.resolutionCount ?? 0) > 0).length;
  const totalResolutions = knowledgeArticles.reduce((sum, a) => sum + (a.resolutionCount ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Knowledge Base" }]} />

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Knowledge Base</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            {knowledgeArticles.length} articles across guides, troubleshooting, FAQs, and known issues.
          </p>
        </div>
      </div>

      <Card className="mt-6 flex flex-wrap items-center gap-3 border-accent-100 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/30">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/50">
          <Sparkles className="h-4.5 w-4.5 text-accent-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-accent-900 dark:text-accent-200">Resolution Intelligence</p>
          <p className="text-sm text-accent-800 dark:text-accent-300">
            {verifiedFixCount} articles here carry a &ldquo;Resolved N times&rdquo; badge — real fixes support agents have verified against real tickets, not just written once and left untouched. Together they&apos;ve closed {totalResolutions} tickets before they were ever opened.
          </p>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Categories</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {knowledgeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/knowledge/${cat.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-0 p-4 transition-colors hover:border-accent-300"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{cat.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{cat.product} · {cat.articleCount} articles</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Trending</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingArticles().map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">All articles</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {knowledgeArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <Card className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
        <LifeBuoy className="h-6 w-6 text-neutral-400" />
        <p className="text-sm font-semibold text-neutral-900">Didn&apos;t find what you needed?</p>
        <p className="max-w-sm text-sm text-neutral-500">
          Ask our AI assistant for a direct answer, or create a ticket and we&apos;ll take it from here.
        </p>
        <div className="mt-1 flex gap-2">
          <Button href="/ask-ai" variant="secondary" size="sm">Ask AI</Button>
          <Button href="/tickets/new" size="sm">Create a ticket</Button>
        </div>
      </Card>
    </div>
  );
}
