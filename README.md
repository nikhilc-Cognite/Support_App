# Cognite Support Portal v2 — "Graphite & Teal"

The same customer support portal as v1 — full feature parity, same information architecture — rebuilt with a new visual theme and one new capability: **Resolution Intelligence**, a flywheel that turns every resolved ticket into a one-click Knowledge Base article, with a live "resolved N times" trust counter that Ask AI and search cite.

v1 (untouched, still running independently) lives at `../Sample Support Page /`. This is a separate, standalone project — not a fork or a variant toggle.

## What's different from v1

| | v1 | v2 |
|---|---|---|
| Ink | Navy-tinted near-black | True graphite-black |
| Accent | Blue (`#2b3fd6`) | Cognite teal (`#1a9b86`) |
| Type | Geist Sans / Geist Mono | Manrope / IBM Plex Mono |
| Corner radii | `rounded-xl` / `rounded-2xl` | One notch tighter throughout |
| Dark mode | Added after launch | Designed in from day one |
| Signature feature | — | Resolution Intelligence |

Everything else — sitemap, component architecture, mock data shape, ticket creation wizard, confirmation workflow, floating Ask AI widget — is identical by design. See [docs/05-resolution-intelligence.md](docs/05-resolution-intelligence.md) for what's new and why; v1's `docs/01–04` (strategy, IA, technical architecture, data model) still apply unchanged and aren't repeated here.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whatever port is free — v1 typically holds 3000, so this often lands on 3001).

### Ask AI (kapa.ai Chat API)

Ask AI calls Cognite's [kapa.ai Chat API](https://docs.kapa.ai/integrations/chat-api) through a **server-side** proxy (`/api/ask-ai`) so the API key never ships to the browser.

1. In the Cognite kapa dashboard, create an API key and a **Custom (API)** integration
2. Copy `env.kapa.example` into `.env.local` and set:

```bash
KAPA_API_KEY=...
KAPA_PROJECT_ID=ebf1a74a-2447-444b-9a38-80272b49c875
```

`KAPA_INTEGRATION_ID` is optional.
3. Restart `npm run dev`

Without these, the portal still runs; Ask AI shows a setup hint.

## Try Resolution Intelligence

1. Go to **My Tickets → #47998** ("Dashboard widgets not loading after last release") — already resolved, with an auto-generated recap.
2. Toggle **Support view** (top right of the ticket).
3. Click **Promote to Knowledge Base** — watch a new article draft appear inline with a live resolution counter.
4. Visit **Knowledge Base** to see the aggregate trust-signal banner, or ask AI *"Why am I getting a 401 error?"* to see a citation carry its resolution count.
5. Confirm-resolve ticket **#48213** yourself (it starts "Solution Provided") to see the recap generate live from a ticket that had none pre-written.
