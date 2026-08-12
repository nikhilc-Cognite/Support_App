import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Ticket Submitted — Cognite Support" };

export default async function TicketConfirmationPage({ searchParams }: PageProps<"/tickets/new/confirmation">) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : "48300";
  const subject = typeof params.subject === "string" ? params.subject : "Your support request";
  const urgency = typeof params.urgency === "string" ? params.urgency : "Normal";

  const isUrgent = urgency === "Urgent";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 dark:bg-success-900/40">
        <CheckCircle2 className="h-7 w-7 text-success-500" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-neutral-900">Ticket #{id} submitted</h1>
      <p className="mt-2 text-sm text-neutral-500">
        &ldquo;{subject}&rdquo; is now with our support team.
      </p>

      <Card className="mt-8 text-left">
        <p className="text-sm font-semibold text-neutral-900">What happens next</p>
        <ol className="mt-3 space-y-3">
          <li className="flex gap-3 text-sm text-neutral-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">1</span>
            {isUrgent
              ? "Because this is marked Urgent, our on-call team has been notified immediately."
              : "Your ticket has been routed to the right team based on product, urgency, and impact."}
          </li>
          <li className="flex gap-3 text-sm text-neutral-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">2</span>
            You&apos;ll get a notification the moment someone responds — no need to keep checking back.
          </li>
          <li className="flex gap-3 text-sm text-neutral-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">3</span>
            Track progress any time under My Tickets, including exactly what happens next and any SLA target.
          </li>
        </ol>
      </Card>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/tickets" variant="secondary">View My Tickets</Button>
        <Button href="/" iconRight={<ArrowRight className="h-4 w-4" />}>Back to Support Home</Button>
      </div>
      <p className="mt-6 text-xs text-neutral-400">
        Need to add more detail? <Link href="/tickets" className="font-medium text-accent-600 hover:text-accent-700">Open the ticket</Link> and reply any time.
      </p>
    </div>
  );
}
