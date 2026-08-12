import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CreateTicketWizard } from "@/components/tickets/CreateTicketWizard";

export const metadata = { title: "Create a Ticket — Cognite Support" };

export default function CreateTicketPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "My Tickets", href: "/tickets" }, { label: "Create a Ticket" }]} />
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Create a Ticket</h1>
      <p className="mt-1.5 text-sm text-neutral-500">A few quick steps gets this to the right team, with everything they need on the first read.</p>

      <div className="mt-8">
        <CreateTicketWizard />
      </div>
    </div>
  );
}
