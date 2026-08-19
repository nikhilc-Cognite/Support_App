import Link from "next/link";
import {
  Sparkles,
  LifeBuoy,
  Ticket,
  BookOpen,
  ArrowRight,
  MessagesSquare,
  ExternalLink,
  Workflow,
  Database,
  Hammer,
  Shield,
  Rocket,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { AskAITrigger } from "@/components/ask-ai/AskAITrigger";

const quickActionClass =
  "group flex flex-col gap-2.5 rounded-xl border border-white/20 bg-black/35 p-4 backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-400/50 hover:bg-black/45";

const quickActions = [
  { label: "Create a Ticket", description: "Guided, gets to a human fast", href: "/tickets/new", icon: LifeBuoy, external: false },
  { label: "My Tickets", description: "Track everything you've submitted", href: "/tickets", icon: Ticket, external: false },
  { label: "Browse Docs", description: "Product documentation for CDF", href: "https://docs.cognite.com/", icon: BookOpen, external: true },
];

/** Docs sections — mirrors docs.cognite.com top nav */
const docsSections: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Flows", href: "https://docs.cognite.com/cdf/flows_workspace", icon: Workflow },
  { label: "Data engineering", href: "https://docs.cognite.com/cdf/data_engineering", icon: Database },
  { label: "Build", href: "https://docs.cognite.com/cdf/data_engineering", icon: Hammer },
  { label: "Admin", href: "https://docs.cognite.com/cdf/admin", icon: Shield },
  { label: "Deploy", href: "https://docs.cognite.com/cdf/deploy", icon: Rocket },
  { label: "Develop", href: "https://docs.cognite.com/dev", icon: Code2 },
];

const LEARN_CATALOG = "https://learn.cognite.com/page/cognite-learn-catalog";
const COMMUNITY_FORUM = "https://hub.cognite.com/product-user-community-428";

const learnCourses = [
  {
    title: "Cognite Data Fusion Fundamentals with Data Modeling",
    description: "Your CDF journey starts here. Get onboard!",
    kind: "Learning path" as const,
    badge: "Internal",
    meta: "3 Courses",
  },
  {
    title: "General Onboarding",
    description: "Get started with Cognite — essentials for every new joiner.",
    kind: "Learning path" as const,
    badge: "Internal",
    meta: "5 Courses",
  },
  {
    title: "Onboarding to the Engineering Team",
    description: "Engineering practices, tools, and workflows at Cognite.",
    kind: "Learning path" as const,
    badge: "Internal",
    meta: "9 Courses",
  },
  {
    title: "Solution Architect Onboarding",
    description: "Build confidence designing solutions on Cognite Data Fusion.",
    kind: "Learning path" as const,
    badge: "Internal",
    meta: "8 Courses",
  },
  {
    title: "Master Prerequisite for Project Managers",
    description: "Foundational knowledge every Cognite project manager needs.",
    kind: "Course" as const,
    badge: "Internal",
    meta: "Course",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero — full-bleed Cognite visual */}
      <section className="relative min-h-[min(72vh,640px)] overflow-hidden bg-ink-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-center.png?v=11"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-right"
        />
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
            {quickActions.map((action) =>
              action.external ? (
                <a key={action.href} href={action.href} target="_blank" rel="noopener noreferrer" className={quickActionClass}>
                  <action.icon className="h-5 w-5 text-accent-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">{action.label}</p>
                    <p className="mt-0.5 text-xs text-neutral-300">{action.description}</p>
                  </div>
                </a>
              ) : (
                <Link key={action.href} href={action.href} className={quickActionClass}>
                  <action.icon className="h-5 w-5 text-accent-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">{action.label}</p>
                    <p className="mt-0.5 text-xs text-neutral-300">{action.description}</p>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Docs sections — large clickable tiles matching docs.cognite.com */}
        <section className="py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Browse documentation</h2>
              <p className="mt-1 text-sm text-neutral-500">Jump into a docs section on docs.cognite.com.</p>
            </div>
            <a
              href="https://docs.cognite.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700 sm:flex"
            >
              Open docs <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {docsSections.map((section) => (
              <a
                key={section.label}
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-0 px-4 py-6 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-100 dark:bg-accent-900/40 dark:group-hover:bg-accent-900/60">
                  <section.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-semibold text-neutral-900 group-hover:text-accent-700">{section.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Learn — landscape course cards */}
        <section className="py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Learn</h2>
              <p className="mt-1 text-sm text-neutral-500">Courses and learning paths from Cognite Learn.</p>
            </div>
            <a
              href={LEARN_CATALOG}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-0 px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-[var(--shadow-card)] transition-colors hover:border-accent-300 hover:text-accent-700"
            >
              More options
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {learnCourses.map((course) => (
              <a
                key={course.title}
                href={LEARN_CATALOG}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-[min(280px,80vw)] shrink-0 flex-col rounded-xl border border-neutral-200/80 bg-neutral-0 p-5 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={
                      course.kind === "Learning path"
                        ? "rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-semibold text-accent-700 dark:bg-accent-900/40 dark:text-accent-300"
                        : "rounded-md bg-info-50 px-2 py-0.5 text-[11px] font-semibold text-info-700 dark:bg-info-900/40 dark:text-info-300"
                    }
                  >
                    {course.kind}
                  </span>
                  {course.badge && (
                    <span className="rounded-md bg-warning-50 px-2 py-0.5 text-[11px] font-semibold text-warning-700 dark:bg-warning-900/40 dark:text-warning-300">
                      {course.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-accent-700">
                  {course.title}
                </p>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-neutral-500">{course.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-xs text-neutral-500">{course.meta}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-600">
                    {course.kind === "Learning path" ? "View path" : "View course"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Community */}
        <section className="py-8 pb-16">
          <a
            href={COMMUNITY_FORUM}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-neutral-200/80 bg-neutral-0 p-6 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <MessagesSquare className="h-5 w-5 text-neutral-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                  Community Forum
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 transition-colors group-hover:text-accent-600" />
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Connect with other Cognite customers to share solutions, best practices, and product feedback in our Community Forum.
                </p>
              </div>
            </div>
          </a>
        </section>
      </div>
    </div>
  );
}
