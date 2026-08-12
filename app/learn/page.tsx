import Link from "next/link";
import { GraduationCap, Video, Presentation, BookOpen, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { learnItems } from "@/lib/mock-data/learn";

export const metadata = { title: "Learn — Cognite Support" };

const typeIcon = { course: GraduationCap, video: Video, webinar: Presentation, tutorial: BookOpen };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Learn" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Learn</h1>
      <p className="mt-1.5 max-w-xl text-sm text-neutral-500">
        Courses, tutorials, and webinars to help your team get more out of Cognite — organized by product and difficulty.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learnItems.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <Link key={item.slug} href={`/learn/${item.slug}`} className="block">
              <Card className="flex h-full flex-col transition-all hover:border-accent-300 hover:shadow-[var(--shadow-elevated)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-accent-600">
                    <Icon className="h-3.5 w-3.5" />
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>
                  <Badge tone="neutral">{item.difficulty}</Badge>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-neutral-500">{item.summary}</p>

                {typeof item.progress === "number" && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-accent-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-400">{item.progress}% complete</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                  <span>{item.product}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.durationMinutes} min</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
