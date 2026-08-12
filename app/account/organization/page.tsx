import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { currentOrganization } from "@/lib/mock-data/account";
import { formatDate, relativeTime } from "@/lib/utils";
import { UserPlus } from "lucide-react";

export const metadata = { title: "Organization — Cognite Support" };

const roleTone = { Admin: "accent", Member: "neutral", Viewer: "neutral" } as const;

export default function OrganizationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Organization" }]} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{currentOrganization.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Customer since {formatDate(currentOrganization.since)}</p>
        </div>
        <Badge tone="accent">{currentOrganization.supportPlan} Plan</Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total tickets", value: currentOrganization.supportHistory.totalTickets },
          { label: "Open now", value: currentOrganization.supportHistory.openTickets },
          { label: "Avg. resolution", value: `${currentOrganization.supportHistory.avgResolutionHours}h` },
          { label: "CSAT average", value: `${currentOrganization.supportHistory.csatAverage} / 5` },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-xl font-semibold text-neutral-900">{s.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-sm font-semibold text-neutral-900">Product entitlements</p>
        <div className="mt-3 space-y-2">
          {currentOrganization.entitlements.map((e) => (
            <div key={e.product} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3.5 py-2.5">
              <span className="text-sm text-neutral-800">{e.product}</span>
              <Badge tone="neutral">{e.tier}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-900">Authorized users</p>
          <Button size="sm" variant="secondary" icon={<UserPlus className="h-3.5 w-3.5" />}>Invite user</Button>
        </div>
        <div className="mt-4 divide-y divide-neutral-100">
          {currentOrganization.authorizedUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar initials={u.name.split(" ").map((n) => n[0]).join("")} size="sm" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{u.name}</p>
                  <p className="text-xs text-neutral-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">Active {relativeTime(u.lastActive)}</span>
                <Badge tone={roleTone[u.role as keyof typeof roleTone]}>{u.role}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <p className="text-sm font-semibold text-neutral-900">Support Account Manager</p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar initials={currentOrganization.accountManager.avatarInitials} size="md" />
          <div>
            <p className="text-sm font-medium text-neutral-900">{currentOrganization.accountManager.name}</p>
            <p className="text-xs text-neutral-500">{currentOrganization.accountManager.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
