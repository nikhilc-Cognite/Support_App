import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TicketDetailClient } from "@/components/tickets/TicketDetailClient";
import { getTicketById } from "@/lib/mock-data/tickets";

export async function generateMetadata({ params }: PageProps<"/tickets/[id]">) {
  const { id } = await params;
  const ticket = getTicketById(id);
  return { title: ticket ? `#${ticket.id} — ${ticket.subject} — Cognite Support` : "Ticket — Cognite Support" };
}

export default async function TicketDetailPage({ params }: PageProps<"/tickets/[id]">) {
  const { id } = await params;
  const ticket = getTicketById(id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "My Tickets", href: "/tickets" }, { label: `#${ticket.id}` }]} />
      <div className="mt-6">
        <TicketDetailClient ticket={ticket} />
      </div>
    </div>
  );
}
