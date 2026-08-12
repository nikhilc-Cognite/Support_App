# Cognite Support Portal v2 — Resolution Intelligence
### The signature feature of this version, and how it differs from v1

---

## What this document is

This is a companion to v1's `docs/01–04` (strategy, IA, technical architecture, data model) — those documents describe the platform this version is built on and still apply unchanged. This file covers only what's new: the **Graphite & Cobalt** visual refresh and the **Resolution Intelligence** feature. It doesn't repeat the IA, personas, or architecture already documented in v1.

---

## 1. The problem this solves

Every support team eventually hits the same two disconnected facts:
1. A huge share of tickets are repeats of something already solved last week.
2. The Knowledge Base doesn't grow fast enough to keep up, because writing an article is *extra* work an agent does *after* already doing the real work of fixing the ticket.

The result: agents keep re-solving the same problem from scratch, and customers keep filing tickets for things a self-serve article could have answered — not because self-service doesn't work, but because nobody had time to write the article yet.

## 2. The mechanism

```
Ticket resolved
      │
      ▼
Recap auto-generated (What happened / Why it happened / What fixed it)
 — visible to the customer immediately, on the ticket itself, no extra step
      │
      ▼
Agent reviews the recap in Support view, clicks "Promote to Knowledge Base"
 — one click, not a blank-page authoring task
      │
      ▼
New article published with resolutionCount: 1, sourceTicketId set
      │
      ▼
Ask AI and Knowledge Base search start citing it, with the count visible
 ("Resolved this exact issue N times") as a trust signal
      │
      ▼
Every future ticket that matches increments the count and is deflected
 before it's ever filed
```

This is implemented in `lib/resolution-intelligence.ts`:
- `generateRecap(ticket)` — produces the three-part recap from the ticket's own conversation. In this prototype it's a deterministic template; in production this is exactly where an LLM summarization call would go (see v1's `docs/03-technical-architecture.md` § 8, AI architecture — same grounding discipline applies: summarize only from the actual thread, never invent a root cause the conversation doesn't support).
- `buildArticleFromTicket(ticket, recap)` — constructs the draft `KnowledgeArticle`. In this prototype it's held in local component state (see `components/tickets/TicketDetailClient.tsx`); in production this is a call to the Zendesk Guide API via the Cognite backend, the same integration boundary described in v1's Zendesk API integration map.

## 3. Where it surfaces, and for whom

| Surface | Customer sees | Support sees |
|---|---|---|
| Ticket Detail | "Resolution summary" — the recap, for their own record | Same recap, plus "Promote to Knowledge Base" |
| Knowledge Base home | Aggregate count of verified fixes and tickets they've collectively deflected | — |
| Knowledge article | "Verified fix — resolved this exact issue N times" | — |
| Ask AI | Citations carry the resolution count inline | — |
| SAM Dashboard | — | Monthly Resolution Intelligence impact: articles promoted, tickets deflected, agent time saved |

Ticket Detail has a **Customer view / Support view** toggle. This is a demo affordance, not a real access-control model — in production this is derived from the logged-in user's role (per v1's `docs/02-information-architecture.md` § 4), not a visible switch. It's here so one page can demonstrate both sides of the feature without needing two separate logins.

## 4. Why both sides actually benefit — not just "customer-facing" dressed up as dual-purpose

- **Customer**: gets a plain-language record of what happened without asking for one, and increasingly finds the answer before filing a ticket at all, because the Knowledge Base is now growing from real resolutions instead of waiting on a writing backlog.
- **Support**: article authoring drops from a blank-page task to a one-click promotion of work already done. The resolution count gives agents (and their managers, via the SAM Dashboard) a concrete, growing measure of deflection impact tied to specific fixes — not just a generic "KB usage" vanity metric.

## 5. Visual system — Graphite & Cobalt

- **Ink**: true graphite-black (`#0b0c10`), not the navy-tinted ink from v1 — theme-invariant, used for the hero, footer mark, and fixed-dark chat bubbles in both light and dark mode.
- **Neutral**: true cool gray, no blue bias, inverts fully between light/dark (see `app/globals.css`).
- **Accent**: cobalt-violet (`#6156e0`), a cooler, more saturated single accent than v1's blue — used the same disciplined way (one accent, everywhere).
- **Type**: Manrope (UI) + IBM Plex Mono (data/code), replacing v1's Geist pairing.
- **Geometry**: corner radii shifted down one notch across the board (`rounded-2xl`→`rounded-xl`, `rounded-xl`→`rounded-lg`) for a tighter, more precise feel.
- **Dark mode**: designed in from the start this time (v1 added it after the fact) — same token-level mechanism as v1 (`@custom-variant dark` keyed to a `data-theme` attribute, resolved by a no-flash bootstrap script), just with the new palette from day one.

Everything else — sitemap, component architecture, mock data shape, ticket wizard, confirmation workflow, chat widget — is identical to v1 by design, so this document doesn't repeat it.
