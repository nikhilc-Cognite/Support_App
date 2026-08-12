import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { TicketListClient } from "@/components/tickets/TicketListClient";
import { tickets } from "@/lib/mock-data/tickets";
import { Plus } from "lucide-react";

export const metadata = { title: "My Tickets — Cognite Support" };

export default function MyTicketsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "My Tickets" }]} />
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">My Tickets</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Everything you and your organization have submitted to Cognite Support.</p>
        </div>
        <Button href="/tickets/new" icon={<Plus className="h-4 w-4" />} className="shrink-0">
          Create a ticket
        </Button>
      </div>

      <div className="mt-8">
        <TicketListClient tickets={tickets} />
      </div>
    </div>
  );
}
