import Link from "next/link";
import { Ticket } from "@/lib/types";
import { TicketStatusPill, PriorityPill } from "@/components/ui/StatusPill";
import { relativeTime } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 transition-colors last:border-0 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-400">#{ticket.id}</span>
          <PriorityPill priority={ticket.priority} />
          {ticket.sla.atRisk && (
            <span className="flex items-center gap-1 text-xs font-medium text-danger-600">
              <AlertTriangle className="h-3 w-3" /> SLA at risk
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-sm font-medium text-neutral-900">{ticket.subject}</p>
        <p className="mt-1 truncate text-xs text-neutral-500">
          {ticket.product.name} · {ticket.assignedTeam} · Updated {relativeTime(ticket.updatedAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
        <TicketStatusPill status={ticket.status} />
        <p className="max-w-[220px] truncate text-right text-xs text-neutral-400">{ticket.nextExpectedAction}</p>
      </div>
    </Link>
  );
}
