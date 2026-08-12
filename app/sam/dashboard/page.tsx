import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TicketVolumeChart, SlaPerformanceChart } from "@/components/sam/SamCharts";
import { samAccounts, recurringIssues, knowledgeUsage, resolutionIntelligence } from "@/lib/mock-data/sam";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "SAM Dashboard — Cognite Support" };

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: "text-success-500", down: "text-danger-500", flat: "text-neutral-400" };

function healthTone(score: number) {
  if (score >= 80) return "text-success-700 bg-success-50 dark:text-success-300 dark:bg-success-900/50";
  if (score >= 60) return "text-warning-700 bg-warning-50 dark:text-warning-300 dark:bg-warning-900/50";
  return "text-danger-700 bg-danger-50 dark:text-danger-300 dark:bg-danger-900/50";
}

export default function SamDashboardPage() {
  const totalCritical = samAccounts.reduce((sum, a) => sum + a.criticalTickets, 0);
  const totalAtRisk = samAccounts.reduce((sum, a) => sum + a.slaAtRisk, 0);
  const avgCsat = (samAccounts.reduce((sum, a) => sum + a.csat, 0) / samAccounts.length).toFixed(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "SAM Dashboard" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Account Portfolio</h1>
      <p className="mt-1.5 text-sm text-neutral-500">Health, risk, and trends across your named accounts.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Accounts managed", value: samAccounts.length },
          { label: "Critical tickets open", value: totalCritical },
          { label: "SLA at risk", value: totalAtRisk },
          { label: "Avg. CSAT", value: `${avgCsat} / 5` },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-2xl font-semibold text-neutral-900">{s.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Accounts</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
                <th className="px-5 py-3 font-medium">Account</th>
                <th className="px-5 py-3 font-medium">Health</th>
                <th className="px-5 py-3 font-medium">Open</th>
                <th className="px-5 py-3 font-medium">Critical</th>
                <th className="px-5 py-3 font-medium">SLA at risk</th>
                <th className="px-5 py-3 font-medium">CSAT</th>
                <th className="px-5 py-3 font-medium">Reopened rate</th>
              </tr>
            </thead>
            <tbody>
              {samAccounts.map((a) => {
                const TrendIcon = trendIcon[a.healthTrend];
                return (
                  <tr key={a.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3.5 font-medium text-neutral-900">
                      {a.name}
                      <Badge tone="neutral" className="ml-2">{a.plan}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", healthTone(a.healthScore))}>
                        {a.healthScore}
                        <TrendIcon className={cn("h-3 w-3", trendColor[a.healthTrend])} />
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-700">{a.openTickets}</td>
                    <td className="px-5 py-3.5">
                      {a.criticalTickets > 0 ? (
                        <span className="flex items-center gap-1 font-medium text-danger-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> {a.criticalTickets}
                        </span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-700">{a.slaAtRisk}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{a.csat}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{a.reopenedRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-neutral-900">Ticket volume — opened vs. resolved</p>
          <div className="mt-2"><TicketVolumeChart /></div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-neutral-900">SLA performance trend</p>
          <div className="mt-2"><SlaPerformanceChart /></div>
        </Card>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-neutral-900">Recurring issues (last 30 days)</p>
          <div className="mt-3 space-y-2.5">
            {recurringIssues.map((r) => (
              <div key={r.issue} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-800">{r.issue}</p>
                  <p className="text-xs text-neutral-400">{r.product}</p>
                </div>
                <Badge tone="neutral">{r.count} tickets</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-neutral-900">Self-service &amp; AI usage</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Knowledge Base deflection rate</span>
              <span className="text-sm font-semibold text-neutral-900">{knowledgeUsage.deflectionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Ask AI resolution rate</span>
              <span className="text-sm font-semibold text-neutral-900">{knowledgeUsage.aiResolutionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Avg. articles viewed per ticket</span>
              <span className="text-sm font-semibold text-neutral-900">{knowledgeUsage.articlesViewedPerTicket}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <Card className="border-accent-100 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-600" />
            <p className="text-sm font-semibold text-accent-900 dark:text-accent-200">Resolution Intelligence impact this month</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xl font-semibold text-neutral-900">{resolutionIntelligence.articlesPromotedThisMonth}</p>
              <p className="mt-0.5 text-xs text-neutral-500">Tickets promoted to KB</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">{resolutionIntelligence.estimatedTicketsDeflected}</p>
              <p className="mt-0.5 text-xs text-neutral-500">Repeat tickets deflected</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">{resolutionIntelligence.avgAgentAuthoringTimeSavedMinutes} min</p>
              <p className="mt-0.5 text-xs text-neutral-500">Avg. authoring time saved / article</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">{resolutionIntelligence.verifiedFixResolutions}</p>
              <p className="mt-0.5 text-xs text-neutral-500">Verified-fix resolutions to date</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
