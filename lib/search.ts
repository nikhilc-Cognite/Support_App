import { knowledgeArticles } from "@/lib/mock-data/knowledge";
import { docPages } from "@/lib/mock-data/docs";
import { tickets } from "@/lib/mock-data/tickets";
import { incidents } from "@/lib/mock-data/status";
import { learnItems } from "@/lib/mock-data/learn";

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  href: string;
  group: "Knowledge" | "Documentation" | "My Tickets" | "Known Issues" | "Learn";
}

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  for (const a of knowledgeArticles) {
    if (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
      results.push({ id: a.slug, title: a.title, snippet: a.summary, href: `/knowledge/article/${a.slug}`, group: "Knowledge" });
    }
  }

  for (const d of docPages) {
    if (d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)) {
      results.push({ id: d.slug.join("/"), title: d.title, snippet: d.summary, href: `/docs/${d.slug.join("/")}`, group: "Documentation" });
    }
  }

  for (const t of tickets) {
    if (t.subject.toLowerCase().includes(q) || t.id.includes(q)) {
      results.push({ id: t.id, title: `#${t.id} — ${t.subject}`, snippet: `${t.product.name} · ${t.assignedTeam}`, href: `/tickets/${t.id}`, group: "My Tickets" });
    }
  }

  for (const inc of incidents) {
    if (inc.title.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q)) {
      results.push({ id: inc.id, title: `${inc.id} — ${inc.title}`, snippet: inc.customerImpact, href: `/status/incidents/${inc.id}`, group: "Known Issues" });
    }
  }

  for (const l of learnItems) {
    if (l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q)) {
      results.push({ id: l.slug, title: l.title, snippet: l.summary, href: `/learn/${l.slug}`, group: "Learn" });
    }
  }

  return results;
}
