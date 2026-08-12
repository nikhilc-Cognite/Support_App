import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { currentUser } from "@/lib/mock-data/account";

export const metadata = { title: "Profile — Cognite Support" };

const prefs: { key: keyof typeof currentUser.notificationPreferences; label: string; description: string }[] = [
  { key: "ticketUpdates", label: "Ticket updates", description: "Replies, status changes, and SLA alerts on your tickets" },
  { key: "incidentUpdates", label: "Incident updates", description: "Active incidents affecting your entitled products" },
  { key: "productAnnouncements", label: "Product announcements", description: "New features and release notes" },
  { key: "knowledgeBaseUpdates", label: "Knowledge base updates", description: "Updates to articles you've previously viewed" },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Profile" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Profile</h1>

      <Card className="mt-6">
        <div className="flex items-center gap-4">
          <Avatar initials={currentUser.avatarInitials} size="lg" />
          <div>
            <p className="text-base font-semibold text-neutral-900">{currentUser.name}</p>
            <p className="text-sm text-neutral-500">{currentUser.title}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue={currentUser.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={currentUser.email} disabled />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button size="sm">Save changes</Button>
        </div>
      </Card>

      <Card className="mt-6">
        <p className="text-sm font-semibold text-neutral-900">Notification preferences</p>
        <div className="mt-4 space-y-4">
          {prefs.map((p) => (
            <label key={p.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-800">{p.label}</p>
                <p className="text-xs text-neutral-500">{p.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={currentUser.notificationPreferences[p.key]}
                className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
