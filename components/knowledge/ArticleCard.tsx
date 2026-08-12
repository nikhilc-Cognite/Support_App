import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KnowledgeArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { BookOpen, Wrench, HelpCircle, AlertOctagon, FileText, CheckCircle2 } from "lucide-react";

const typeConfig = {
  "how-to": { label: "How-to", icon: BookOpen },
  troubleshooting: { label: "Troubleshooting", icon: Wrench },
  faq: { label: "FAQ", icon: HelpCircle },
  "known-issue": { label: "Known Issue", icon: AlertOctagon },
  "release-note": { label: "Release Note", icon: FileText },
};

export function ArticleCard({ article }: { article: KnowledgeArticle }) {
  const { label, icon: Icon } = typeConfig[article.type];
  return (
    <CardLink href={`/knowledge/article/${article.slug}`} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Badge tone={article.type === "known-issue" ? "warning" : "neutral"}>
          <Icon className="mr-1 h-3 w-3" />
          {label}
        </Badge>
        {article.trending && <Badge tone="accent">Trending</Badge>}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold leading-snug text-neutral-900">{article.title}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-neutral-500">{article.summary}</p>
      {typeof article.resolutionCount === "number" && article.resolutionCount > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-success-700 dark:text-success-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Resolved this exact issue {article.resolutionCount} time{article.resolutionCount === 1 ? "" : "s"}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <span>{article.product}</span>
        <span>Updated {formatDate(article.updatedAt)}</span>
      </div>
    </CardLink>
  );
}
