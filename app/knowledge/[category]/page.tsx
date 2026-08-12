import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { knowledgeCategories, knowledgeArticles } from "@/lib/mock-data/knowledge";
import { FolderOpen } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/knowledge/[category]">) {
  const { category } = await params;
  const cat = knowledgeCategories.find((c) => c.id === category);
  return { title: cat ? `${cat.name} — Knowledge Base — Cognite Support` : "Knowledge Base" };
}

export default async function CategoryPage({ params }: PageProps<"/knowledge/[category]">) {
  const { category } = await params;
  const cat = knowledgeCategories.find((c) => c.id === category);
  if (!cat) notFound();

  const articles = knowledgeArticles.filter((a) => a.category === cat.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Knowledge Base", href: "/knowledge" }, { label: cat.name }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">{cat.name}</h1>
      <p className="mt-1.5 text-sm text-neutral-500">{cat.product} · {articles.length} articles</p>

      {articles.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState icon={FolderOpen} title="No articles in this category yet" description="Try Ask AI, or browse all Knowledge Base articles." />
        </div>
      )}
    </div>
  );
}
