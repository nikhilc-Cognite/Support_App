/**
 * Resolution Intelligence
 *
 * The flywheel: every resolved ticket carries an auto-generated,
 * plain-language recap (see `generateRecap`). A support agent can promote
 * that recap into a Knowledge Base article draft in one click
 * (`buildArticleFromTicket`) instead of writing one from scratch. Published
 * articles carry a `resolutionCount` — how many times that exact fix has
 * closed out a ticket — which Ask AI and article cards surface as a trust
 * signal ("resolved this exact issue 23 times"), nudging future customers
 * toward self-service before they ever open a ticket.
 *
 * This file holds the generation logic; see docs/05-resolution-intelligence.md
 * for the product rationale and where a real implementation would plug in
 * an LLM summarization call instead of the template below.
 */

import { Ticket, TicketRecap, KnowledgeArticle } from "@/lib/types";

/**
 * Produces a recap from a ticket's own conversation — no recap needs to be
 * hand-authored in mock data for this to work. In production this is
 * where an LLM call would summarize the thread instead of templating it.
 */
export function generateRecap(ticket: Ticket): TicketRecap {
  const firstCustomerMessage = ticket.messages.find((m) => m.author.role === "customer");
  const lastAgentMessage = [...ticket.messages].reverse().find((m) => m.author.role === "agent");
  const lastNonCustomerMessage = [...ticket.messages].reverse().find((m) => m.author.role !== "customer");

  return {
    whatHappened: firstCustomerMessage?.body ?? ticket.subject,
    whyItHappened: `Root-caused by ${ticket.assignedTeam} as an issue affecting ${ticket.product.name}${
      ticket.environment ? ` in ${ticket.environment}` : ""
    }.`,
    whatFixedIt: lastAgentMessage?.body ?? lastNonCustomerMessage?.body ?? "Resolved by the support team.",
  };
}

/** Ensures a ticket has a recap, generating one on the fly if none was pre-set. */
export function getOrGenerateRecap(ticket: Ticket): TicketRecap {
  return ticket.recap ?? generateRecap(ticket);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Turns a resolved ticket + its recap into a Knowledge Base article draft.
 * This is what "Promote to Knowledge Base" produces — client-side only in
 * this prototype (see docs/05-resolution-intelligence.md for how this maps
 * to a real Zendesk Guide article creation call).
 */
export function buildArticleFromTicket(ticket: Ticket, recap: TicketRecap): KnowledgeArticle {
  return {
    slug: `${slugify(ticket.subject)}-${ticket.id}`,
    title: ticket.subject,
    summary: recap.whatHappened.length > 140 ? `${recap.whatHappened.slice(0, 137)}...` : recap.whatHappened,
    category: ticket.tags[0] ? ticket.tags[0][0].toUpperCase() + ticket.tags[0].slice(1) : "Troubleshooting",
    product: ticket.product.name,
    type: "known-issue",
    updatedAt: new Date().toISOString(),
    helpfulCount: 0,
    notHelpfulCount: 0,
    relatedSlugs: [],
    resolutionCount: 1,
    sourceTicketId: ticket.id,
    isDraft: true,
    body: `## What happened

${recap.whatHappened}

## Why it happened

${recap.whyItHappened}

## What fixed it

${recap.whatFixedIt}`,
  };
}
