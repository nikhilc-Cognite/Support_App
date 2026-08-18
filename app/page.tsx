import Link from "next/link";
import {
  Sparkles,
  LifeBuoy,
  Ticket,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  MessagesSquare,
  Layers,
  BarChart3,
} from "lucide-react";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { StatusSummaryCard } from "@/components/status/StatusSummaryCard";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { AskAITrigger } from "@/components/ask-ai/AskAITrigger";
import { Card, CardLink } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trendingArticles, recentlyUpdatedArticles } from "@/lib/mock-data/knowledge";
import { learnItems } from "@/lib/mock-data/learn";
import { formatDate } from "@/lib/utils";

const quickActionClass =
  "group flex flex-col gap-2.5 rounded-xl border border-white/20 bg-black/35 p-4 backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-400/50 hover:bg-black/45";

const quickActions = [
  { label: "Create a Ticket", description: "Guided, gets to a human fast", href: "/tickets/new", icon: LifeBuoy },
  { label: "My Tickets", description: "Track everything you've submitted", href: "/tickets", icon: Ticket },
  { label: "Browse Knowledge", description: "Guides, FAQs, troubleshooting", href: "/knowledge", icon: BookOpen },
];

const products = [
  { name: "Cognite Platform", description: "Identity, workflow, and core APIs", href: "/knowledge?product=platform", icon: Layers },
  { name: "Cognite Analytics", description: "Dashboards, reporting, and data pipelines", href: "/knowledge?product=analytics", icon: BarChart3 },
];

export default function HomePage() {
  const trending = trendingArticles();
  const recent = recentlyUpdatedArticles(3);

  return (
    <div>
      {/* Hero — full-bleed Cognite visual */}
      <section className="relative min-h-[min(72vh,640px)] overflow-hidden bg-ink-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-center.png?v=5"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Light scrim — keeps type readable without hiding the brand visual */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(11 12 16 / 0.25) 0%, rgb(11 12 16 / 0.15) 45%, rgb(11 12 16 / 0.45) 100%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[min(72vh,640px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgb(0_0_0_/_0.45)] sm:text-5xl">
              How can we help?
            </h1>
          </div>
          <div className="mx-auto mt-9 flex w-full justify-center">
            <GlobalSearch variant="hero" />
          </div>
          <div className="mx-auto mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <AskAITrigger mode="float" className={quickActionClass}>
              <Sparkles className="h-5 w-5 text-accent-400" />
              <div>
                <p className="text-sm font-semibold text-white">Ask AI</p>
                <p className="mt-0.5 text-xs text-neutral-300">Conversational answers, cited sources</p>
              </div>
            </AskAITrigger>
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className={quickActionClass}>
                <action.icon className="h-5 w-5 text-accent-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-300">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Status + emergency guidance */}
        <section className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-2">
          <StatusSummaryCard />
          <Card className="flex items-center justify-between gap-4 border-neutral-200 bg-neutral-0">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 text-danger-500" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Production down or a critical business impact?</p>
                <p className="mt-0.5 text-xs text-neutral-500">Mark severity as Critical in the ticket form to route directly to on-call.</p>
              </div>
            </div>
            <Button href="/tickets/new" variant="secondary" size="sm" className="shrink-0">
              Report now
            </Button>
          </Card>
        </section>

        {/* Trending / popular articles */}
        <section className="py-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Popular right now</h2>
              <p className="mt-1 text-sm text-neutral-500">The articles most customers are finding helpful this week.</p>
            </div>
            <Link href="/knowledge" className="hidden items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700 sm:flex">
              Browse all Knowledge <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="py-8">
          <h2 className="text-lg font-semibold text-neutral-900">Browse by product</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <CardLink key={p.href} href={p.href} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-50 dark:bg-accent-900/40">
                  <p.icon className="h-5 w-5 text-accent-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">{p.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300" />
              </CardLink>
            ))}
          </div>
        </section>

        {/* Recommended docs + Learn side by side */}
        <section className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Recently updated documentation</h2>
              <Link href="/knowledge" className="text-sm font-medium text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            <div className="mt-5 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
              {recent.map((a) => (
                <Link key={a.slug} href={`/knowledge/article/${a.slug}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-neutral-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">{a.title}</p>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">{a.category} · Updated {formatDate(a.updatedAt)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Learn</h2>
              <Link href="/learn" className="text-sm font-medium text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {learnItems.slice(0, 2).map((l) => (
                <CardLink key={l.slug} href={`/learn/${l.slug}`} padding={false} className="p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-accent-600">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {l.type === "course" ? "Course" : l.type === "webinar" ? "Webinar" : l.type === "video" ? "Video" : "Tutorial"}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-neutral-900">{l.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{l.durationMinutes} min · {l.difficulty}</p>
                </CardLink>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements + Community */}
        <section className="grid grid-cols-1 gap-4 py-8 pb-16 lg:grid-cols-2">
          <Card>
            <p className="text-sm font-semibold text-neutral-900">Support announcements</p>
            <ul className="mt-3 space-y-3">
              <li className="text-sm text-neutral-600">
                <span className="font-medium text-neutral-900">New:</span> Bulk API endpoints now available — reduce call volume for large sync jobs.
              </li>
              <li className="text-sm text-neutral-600">
                <span className="font-medium text-neutral-900">Scheduled maintenance:</span> Aug 14, 02:00–03:00 UTC, US region database upgrade.
              </li>
            </ul>
            <Link href="/notifications" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
              View all notifications <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
          <Card className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <MessagesSquare className="h-5 w-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Community Forum</p>
              <p className="mt-1 text-sm text-neutral-500">
                Connect with other Cognite customers to share solutions, best practices, and product feedback in our Community Forum.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
