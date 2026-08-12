import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card, CardLink } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ArticleFeedback } from "@/components/ArticleFeedback";
import { Alert } from "@/components/ui/Alert";
import { knowledgeArticles, getArticleBySlug } from "@/lib/mock-data/knowledge";
import { formatDate } from "@/lib/utils";
import { LifeBuoy } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/knowledge/article/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return { title: article ? `${article.title} — Cognite Support` : "Article — Cognite Support" };
}

function extractHeadings(body: string) {
  return body
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));
}

export default async function ArticlePage({ params }: PageProps<"/knowledge/article/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.body);
  const related = knowledgeArticles.filter((a) => article.relatedSlugs.includes(a.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Support Home", href: "/" },
          { label: "Knowledge Base", href: "/knowledge" },
          { label: article.category, href: `/knowledge/${article.category.toLowerCase().replace(/[^a-z]+/g, "-")}` },
          { label: article.title },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={article.type === "known-issue" ? "warning" : "neutral"}>{article.type.replace("-", " ")}</Badge>
            <Badge tone="neutral">{article.product}</Badge>
            {article.trending && <Badge tone="accent">Trending</Badge>}
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">{article.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Last updated {formatDate(article.updatedAt)} · {article.helpfulCount} people found this helpful
          </p>

          {typeof article.resolutionCount === "number" && article.resolutionCount > 0 && (
            <div className="mt-4">
              <Alert tone="success" title={`Verified fix — resolved this exact issue ${article.resolutionCount} time${article.resolutionCount === 1 ? "" : "s"}`}>
                {article.sourceTicketId
                  ? `This article was generated from a resolved support ticket and confirmed working since.`
                  : `Support agents have used this fix to close out matching tickets — it's not just theory.`}
              </Alert>
            </div>
          )}

          <div className="mt-8">
            <MarkdownBody content={article.body} />
          </div>

          <div className="mt-10">
            <ArticleFeedback helpfulCount={article.helpfulCount} notHelpfulCount={article.notHelpfulCount} />
          </div>

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Related articles</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <CardLink key={r.slug} href={`/knowledge/article/${r.slug}`}>
                    <p className="text-sm font-semibold text-neutral-900">{r.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{r.summary}</p>
                  </CardLink>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {headings.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">On this page</p>
                <nav className="mt-2.5 space-y-2 border-l border-neutral-200 pl-3">
                  {headings.map((h) => (
                    <a key={h} href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="block text-sm text-neutral-500 hover:text-accent-600">
                      {h}
                    </a>
                  ))}
                </nav>
              </div>
            )}
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <LifeBuoy className="h-4 w-4 text-accent-600" />
                Still stuck?
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">Ask AI can dig deeper, or create a ticket and we&apos;ll handle it directly.</p>
              <div className="mt-3 flex flex-col gap-2">
                <Button href="/ask-ai" variant="secondary" size="sm">Ask AI</Button>
                <Button href="/tickets/new" size="sm">Create a ticket</Button>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
