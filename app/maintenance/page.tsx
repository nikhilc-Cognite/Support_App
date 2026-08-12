import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Scheduled Maintenance — Cognite Support" };

export default function MaintenancePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-320px)] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-900/40">
        <Wrench className="h-7 w-7 text-accent-600" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-neutral-900">We&apos;ll be back shortly</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Cognite Support is undergoing scheduled maintenance. Ticket creation and live chat are temporarily paused — your existing tickets are safe and nothing is lost.
      </p>
      <Card className="mt-6 w-full text-left">
        <p className="text-sm font-semibold text-neutral-900">Maintenance window</p>
        <p className="mt-1 text-sm text-neutral-600">Aug 14, 2026 · 02:00–03:00 UTC</p>
        <p className="mt-3 text-sm font-semibold text-neutral-900">Affected</p>
        <p className="mt-1 text-sm text-neutral-600">Support Portal, Ticket Creation. Knowledge Base and Docs remain available (read-only).</p>
      </Card>
      <div className="mt-6 flex gap-3">
        <Button href="/knowledge" variant="secondary">Browse Knowledge Base</Button>
        <Button href="/status">Check Status</Button>
      </div>
      <p className="mt-6 text-xs text-neutral-400">For anything urgent during this window, email support@cognite.com directly.</p>
    </div>
  );
}
