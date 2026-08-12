import Link from "next/link";
import { ArrowRight, Ticket as TicketIcon, GraduationCap, Star } from "lucide-react";
import { Card, CardLink } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TicketStatusPill, PriorityPill } from "@/components/ui/StatusPill";
import { StatusSummaryCard } from "@/components/status/StatusSummaryCard";
import { Avatar } from "@/components/ui/Avatar";
import { tickets } from "@/lib/mock-data/tickets";
import { currentUser, currentOrganization } from "@/lib/mock-data/account";
import { learnItems } from "@/lib/mock-data/learn";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Support Hub — Cognite Support" };

export default function HubPage() {
  const openTickets = tickets.filter((t) => !["resolved", "closed"].includes(t.status));
  const needsConfirmation = tickets.filter((t) => t.status === "solution_provided");
  const inProgressLearn = learnItems.filter((l) => typeof l.progress === "number" && l.progress > 0 && l.progress < 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="mt-1.5 text-sm text-neutral-500">{currentOrganization.name} · {currentOrganization.supportPlan} Support Plan</p>
        </div>
        <Button href="/tickets/new">Create a ticket</Button>
      </div>

      {needsConfirmation.length > 0 && (
        <Card className="mt-6 border-accent-200 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/30">
          <p className="text-sm font-semibold text-accent-900 dark:text-accent-200">
            {needsConfirmation.length} ticket{needsConfirmation.length > 1 ? "s" : ""} waiting on your confirmation
          </p>
          <div className="mt-2 space-y-1.5">
            {needsConfirmation.map((t) => (
              <Link key={t.id} href={`/tickets/${t.id}`} className="block text-sm font-medium text-accent-700 hover:text-accent-800 dark:text-accent-300 dark:hover:text-accent-200">
                #{t.id} — {t.subject} →
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Open tickets", value: openTickets.length },
          { label: "Total tickets (90d)", value: currentOrganization.supportHistory.totalTickets },
          { label: "Avg. resolution", value: `${currentOrganization.supportHistory.avgResolutionHours}h` },
          { label: "CSAT average", value: `${currentOrganization.supportHistory.csatAverage} / 5` },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">My open tickets</h2>
            <Link href="/tickets" className="flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
            {openTickets.length > 0 ? (
              openTickets.map((t) => (
                <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-neutral-50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">#{t.id}</span>
                      <PriorityPill priority={t.priority} />
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-neutral-900">{t.subject}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">Updated {relativeTime(t.updatedAt)}</p>
                  </div>
                  <TicketStatusPill status={t.status} />
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <TicketIcon className="h-6 w-6 text-neutral-300" />
                <p className="text-sm text-neutral-500">No open tickets — you&apos;re all caught up.</p>
              </div>
            )}
          </div>

          {inProgressLearn.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Continue learning</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {inProgressLearn.map((l) => (
                  <CardLink key={l.slug} href={`/learn/${l.slug}`}>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-accent-600">
                      <GraduationCap className="h-3.5 w-3.5" /> Course
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-neutral-900">{l.title}</p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-accent-500" style={{ width: `${l.progress}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-400">{l.progress}% complete</p>
                  </CardLink>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <StatusSummaryCard />

          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Your support contact</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar initials={currentOrganization.accountManager.avatarInitials} size="md" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">{currentOrganization.accountManager.name}</p>
                <p className="text-xs text-neutral-500">Support Account Manager</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <Star className="h-3.5 w-3.5" /> Support plan
            </div>
            <p className="mt-2 text-sm font-semibold text-neutral-900">{currentOrganization.supportPlan}</p>
            <p className="mt-1 text-xs text-neutral-500">Customer since {new Date(currentOrganization.since).getFullYear()}</p>
            <Link href="/account/organization" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
              View organization <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
