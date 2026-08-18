import Link from "next/link";
import { BookOpen, FileText, AlertOctagon, CheckCircle2, ExternalLink } from "lucide-react";

const icons = { Knowledge: BookOpen, Docs: FileText, "Known Issue": AlertOctagon };

export function SourceCard({
  title,
  href,
  type,
  resolutionCount,
}: {
  title: string;
  href: string;
  type: "Knowledge" | "Docs" | "Known Issue";
  resolutionCount?: number;
}) {
  const Icon = icons[type];
  const external = /^https?:\/\//i.test(href);
  const className =
    "flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-sm transition-colors hover:border-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/30";

  const body = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-accent-600" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-800">{title}</p>
        {typeof resolutionCount === "number" && resolutionCount > 0 && (
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-success-700 dark:text-success-300">
            <CheckCircle2 className="h-3 w-3" />
            Resolved {resolutionCount} time{resolutionCount === 1 ? "" : "s"}
          </p>
        )}
        {external && <p className="mt-0.5 truncate text-[11px] text-neutral-400">{href.replace(/^https?:\/\//, "")}</p>}
      </div>
      {external ? (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
      ) : (
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-neutral-400">{type}</span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
