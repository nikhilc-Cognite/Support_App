import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-neutral-500">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-300" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-accent-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-800 font-medium truncate max-w-[240px]">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
