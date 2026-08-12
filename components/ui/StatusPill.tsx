import { cn } from "@/lib/utils";
import {
  CustomerTicketStatus,
  TICKET_STATUS_LABEL,
  ComponentStatus,
  COMPONENT_STATUS_LABEL,
  IncidentStatus,
  TicketPriority,
} from "@/lib/types";

const dotColor: Record<string, string> = {
  // ticket status
  submitted: "bg-neutral-400",
  investigating: "bg-accent-500",
  waiting_on_customer: "bg-warning-500",
  solution_provided: "bg-accent-500",
  resolved: "bg-success-500",
  closed: "bg-neutral-400",
  // component status
  operational: "bg-success-500",
  degraded: "bg-warning-500",
  partial_outage: "bg-warning-500",
  major_outage: "bg-danger-500",
  maintenance: "bg-accent-500",
  // incident status
  investigating_incident: "bg-danger-500",
  identified: "bg-warning-500",
  monitoring: "bg-accent-500",
};

const textColor: Record<string, string> = {
  submitted: "text-neutral-700",
  investigating: "text-accent-700 dark:text-accent-300",
  waiting_on_customer: "text-warning-700 dark:text-warning-300",
  solution_provided: "text-accent-700 dark:text-accent-300",
  resolved: "text-success-700 dark:text-success-300",
  closed: "text-neutral-600",
  operational: "text-success-700 dark:text-success-300",
  degraded: "text-warning-700 dark:text-warning-300",
  partial_outage: "text-warning-700 dark:text-warning-300",
  major_outage: "text-danger-700 dark:text-danger-300",
  maintenance: "text-accent-700 dark:text-accent-300",
};

export function TicketStatusPill({ status }: { status: CustomerTicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium",
        textColor[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[status])} />
      {TICKET_STATUS_LABEL[status]}
    </span>
  );
}

export function ComponentStatusPill({ status }: { status: ComponentStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", textColor[status])}>
      <span className={cn("h-2 w-2 rounded-full", dotColor[status])} />
      {COMPONENT_STATUS_LABEL[status]}
    </span>
  );
}

const incidentLabel: Record<IncidentStatus, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

const incidentDot: Record<IncidentStatus, string> = {
  investigating: "bg-danger-500",
  identified: "bg-warning-500",
  monitoring: "bg-accent-500",
  resolved: "bg-success-500",
};

export function IncidentStatusPill({ status }: { status: IncidentStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
      <span className={cn("h-1.5 w-1.5 rounded-full", incidentDot[status])} />
      {incidentLabel[status]}
    </span>
  );
}

const priorityTone: Record<TicketPriority, string> = {
  low: "bg-neutral-100 text-neutral-700",
  normal: "bg-accent-50 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
  high: "bg-warning-50 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300",
  urgent: "bg-danger-50 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300",
};

const priorityLabel: Record<TicketPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export function PriorityPill({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", priorityTone[priority])}>
      {priorityLabel[priority]}
    </span>
  );
}
