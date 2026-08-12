/**
 * Shared domain types for the Cognite Support Portal.
 *
 * These mirror the shape the Cognite backend API layer returns to the frontend
 * — already translated from raw Zendesk objects into customer-facing
 * concepts. See docs/04-data-model.md for the Zendesk-source-of-truth vs.
 * Cognite-application-data split these types represent.
 */

export type CustomerTicketStatus =
  | "submitted"
  | "investigating"
  | "waiting_on_customer"
  | "solution_provided"
  | "resolved"
  | "closed";

export const TICKET_STATUS_LABEL: Record<CustomerTicketStatus, string> = {
  submitted: "Submitted",
  investigating: "Under Investigation",
  waiting_on_customer: "Waiting for Information",
  solution_provided: "Solution Provided — Awaiting Confirmation",
  resolved: "Resolved",
  closed: "Closed",
};

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type TicketSeverity = "minor" | "moderate" | "major" | "critical";

export interface TicketProduct {
  id: string;
  name: string;
}

export interface TicketMessage {
  id: string;
  author: {
    name: string;
    role: "customer" | "agent" | "ai" | "system";
    avatarInitials: string;
    team?: string;
  };
  body: string;
  createdAt: string;
  attachments?: TicketAttachment[];
  internal?: boolean;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  sizeKb: number;
  contentType: string;
}

export interface SLAInfo {
  nextResponseDueAt?: string;
  resolutionDueAt?: string;
  atRisk: boolean;
  breached: boolean;
}

/**
 * Resolution Intelligence — an auto-generated, plain-language recap of a
 * resolved ticket. Written once the ticket reaches `resolved`, shown to
 * the customer for their own record and to support staff as the seed for
 * a Knowledge Base article (see `promoteTicketToArticle` in
 * lib/mock-data/knowledge.ts and docs/05-resolution-intelligence.md).
 */
export interface TicketRecap {
  whatHappened: string;
  whyItHappened: string;
  whatFixedIt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: CustomerTicketStatus;
  priority: TicketPriority;
  severity: TicketSeverity;
  product: TicketProduct;
  environment?: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: string;
  requester: { name: string; email: string };
  organization: string;
  sla: SLAInfo;
  nextExpectedAction: string;
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  tags: string[];
  csatSubmitted?: boolean;
  recap?: TicketRecap;
  /** Slug of the Knowledge Base article this ticket's recap was promoted into, once an agent does so. */
  promotedToArticleSlug?: string;
}

export type ComponentStatus = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";

export const COMPONENT_STATUS_LABEL: Record<ComponentStatus, string> = {
  operational: "Operational",
  degraded: "Degraded Performance",
  partial_outage: "Partial Outage",
  major_outage: "Major Outage",
  maintenance: "Under Maintenance",
};

export interface StatusComponent {
  id: string;
  name: string;
  status: ComponentStatus;
  group: string;
}

export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";
export type IncidentSeverity = "minor" | "major" | "critical";

export interface IncidentUpdate {
  id: string;
  status: IncidentStatus;
  message: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedProducts: string[];
  affectedRegions: string[];
  startedAt: string;
  resolvedAt?: string;
  customerImpact: string;
  updates: IncidentUpdate[];
  relatedArticleSlugs?: string[];
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  product: string;
  type: "how-to" | "troubleshooting" | "faq" | "known-issue" | "release-note";
  body: string;
  updatedAt: string;
  helpfulCount: number;
  notHelpfulCount: number;
  relatedSlugs: string[];
  trending?: boolean;
  /**
   * Resolution Intelligence: how many times this exact fix has resolved a
   * customer ticket. Present only on articles that originated from (or
   * have been matched against) real resolved tickets — not every article
   * carries this trust signal, only verified ones.
   */
  resolutionCount?: number;
  /** Ticket ID this article was promoted from, if it originated that way. */
  sourceTicketId?: string;
  /** True the moment an agent promotes a ticket recap into a new draft article at runtime (client-only state, not persisted). */
  isDraft?: boolean;
}

export interface DocPage {
  slug: string[];
  title: string;
  summary: string;
  section: string;
  body: string;
  updatedAt: string;
  apiExample?: { language: string; code: string };
}

export interface LearnItem {
  slug: string;
  title: string;
  type: "course" | "video" | "webinar" | "tutorial";
  product: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  summary: string;
  progress?: number;
}

export interface NotificationItem {
  id: string;
  type: "ticket" | "incident" | "maintenance" | "announcement" | "knowledge";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; href: string; type: "Knowledge" | "Docs" | "Known Issue"; resolutionCount?: number }[];
  suggestEscalation?: boolean;
}
