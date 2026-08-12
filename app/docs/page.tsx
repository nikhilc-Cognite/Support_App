import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CardLink } from "@/components/ui/Card";
import { docsNav } from "@/lib/mock-data/docs";

export const metadata = { title: "Documentation — Cognite Support" };

export default function DocsHomePage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Documentation" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Documentation</h1>
      <p className="mt-1.5 max-w-xl text-sm text-neutral-500">
        Reference material for installing, configuring, and integrating with Cognite — organized by section, versioned by product.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {docsNav.map((section) => (
          <CardLink key={section.section} href={`/docs/${section.items[0].slug.join("/")}`}>
            <p className="text-sm font-semibold text-neutral-900">{section.section}</p>
            <ul className="mt-2 space-y-1">
              {section.items.map((item) => (
                <li key={item.title} className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <ArrowRight className="h-3 w-3 text-neutral-300" />
                  {item.title}
                </li>
              ))}
            </ul>
          </CardLink>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-semibold text-neutral-900">Looking for task-based how-tos instead?</p>
        <p className="mt-1 text-sm text-neutral-500">
          Docs is reference-first. For step-by-step troubleshooting and conceptual guides, visit the{" "}
          <Link href="/knowledge" className="font-medium text-accent-600 hover:text-accent-700">Knowledge Base</Link>.
        </p>
      </div>
    </div>
  );
}
