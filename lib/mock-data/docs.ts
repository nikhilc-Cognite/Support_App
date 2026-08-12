import { DocPage } from "@/lib/types";

export const docsNav = [
  {
    section: "Getting Started",
    items: [
      { title: "Introduction", slug: ["getting-started", "introduction"] },
      { title: "Quickstart", slug: ["getting-started", "quickstart"] },
    ],
  },
  {
    section: "Installation",
    items: [{ title: "System Requirements", slug: ["installation", "requirements"] }],
  },
  {
    section: "Configuration",
    items: [{ title: "Environment Variables", slug: ["configuration", "environment-variables"] }],
  },
  {
    section: "API Documentation",
    items: [
      { title: "Authentication", slug: ["api", "authentication"] },
      { title: "Tickets API", slug: ["api", "tickets"] },
      { title: "Rate Limits", slug: ["api", "rate-limits"] },
    ],
  },
  {
    section: "Integrations",
    items: [{ title: "Webhooks", slug: ["integrations", "webhooks"] }],
  },
  {
    section: "Security",
    items: [{ title: "Data Encryption", slug: ["security", "encryption"] }],
  },
];

export const docPages: DocPage[] = [
  {
    slug: ["getting-started", "introduction"],
    title: "Introduction to Cognite",
    summary: "What Cognite is, how the platform is organized, and where to go next.",
    section: "Getting Started",
    updatedAt: "2026-07-01T00:00:00Z",
    body: `Cognite is a unified platform for [product domain]. This documentation covers installation, configuration, administration, and the full API surface.

## How the docs are organized

- **Getting Started** — first-run setup
- **API Documentation** — endpoint reference with request/response examples
- **Integrations** — connecting third-party tools
- **Security** — encryption, compliance, and data handling

If you're looking for conceptual how-tos rather than reference material, check the [Knowledge Base](/knowledge) instead — Docs is reference-first, Knowledge is task-first.`,
  },
  {
    slug: ["getting-started", "quickstart"],
    title: "Quickstart",
    summary: "Get an authenticated API call working in under 5 minutes.",
    section: "Getting Started",
    updatedAt: "2026-07-01T00:00:00Z",
    apiExample: {
      language: "bash",
      code: `curl https://api.cognite.com/v2/ping \\
  -H "Authorization: Bearer $ACCESS_TOKEN"`,
    },
    body: `## 1. Get API credentials

Generate a client ID and secret under Organization Profile → Developer Settings.

## 2. Authenticate

See [Authentication](/docs/api/authentication) for the full OAuth flow.

## 3. Make your first call

\`\`\`bash
curl https://api.cognite.com/v2/ping \\
  -H "Authorization: Bearer $ACCESS_TOKEN"
\`\`\`

A successful response returns \`{"status": "ok"}\`.`,
  },
  {
    slug: ["installation", "requirements"],
    title: "System requirements",
    summary: "Supported browsers, network requirements, and SDK compatibility.",
    section: "Installation",
    updatedAt: "2026-05-20T00:00:00Z",
    body: `## Supported browsers

Latest two major versions of Chrome, Firefox, Safari, and Edge.

## Network requirements

Outbound HTTPS (443) access to \`*.cognite.com\` is required. If your organization uses an allowlist-based proxy, add \`api.cognite.com\` and \`app.cognite.com\` explicitly.

## SDK compatibility

- Node.js 18+
- Python 3.9+
- Go 1.21+`,
  },
  {
    slug: ["configuration", "environment-variables"],
    title: "Environment variables",
    summary: "Configuration variables for self-hosted agents and CI integrations.",
    section: "Configuration",
    updatedAt: "2026-06-11T00:00:00Z",
    apiExample: {
      language: "bash",
      code: `COGNITE_CLIENT_ID=your-client-id
COGNITE_CLIENT_SECRET=your-client-secret
COGNITE_API_BASE_URL=https://api.cognite.com`,
    },
    body: `These variables configure the Cognite CLI and CI integrations.

\`\`\`bash
COGNITE_CLIENT_ID=your-client-id
COGNITE_CLIENT_SECRET=your-client-secret
COGNITE_API_BASE_URL=https://api.cognite.com
\`\`\`

Never commit \`COGNITE_CLIENT_SECRET\` to source control — use your CI provider's secret storage.`,
  },
  {
    slug: ["api", "authentication"],
    title: "Authentication",
    summary: "OAuth 2.0 client credentials flow for server-to-server API access.",
    section: "API Documentation",
    updatedAt: "2026-07-30T00:00:00Z",
    apiExample: {
      language: "bash",
      code: `curl -X POST https://api.cognite.com/oauth/token \\
  -d grant_type=client_credentials \\
  -d client_id=$COGNITE_CLIENT_ID \\
  -d client_secret=$COGNITE_CLIENT_SECRET`,
    },
    body: `All API requests must be authenticated with an OAuth 2.0 bearer token.

## Requesting a token

\`\`\`bash
curl -X POST https://api.cognite.com/oauth/token \\
  -d grant_type=client_credentials \\
  -d client_id=$COGNITE_CLIENT_ID \\
  -d client_secret=$COGNITE_CLIENT_SECRET
\`\`\`

Response:

\`\`\`json
{
  "access_token": "eyJhbGciOi...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
\`\`\`

## Full walkthrough

For a step-by-step guide including refresh handling, see the [OAuth API authentication guide](/knowledge/article/oauth-api-authentication-guide) in the Knowledge Base.`,
  },
  {
    slug: ["api", "tickets"],
    title: "Tickets API",
    summary: "Create, read, and update support tickets programmatically.",
    section: "API Documentation",
    updatedAt: "2026-07-28T00:00:00Z",
    apiExample: {
      language: "bash",
      code: `curl -X POST https://api.cognite.com/v2/tickets \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "API integration error",
    "product": "platform",
    "severity": "moderate",
    "description": "..."
  }'`,
    },
    body: `## Create a ticket

\`\`\`bash
curl -X POST https://api.cognite.com/v2/tickets \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "API integration error",
    "product": "platform",
    "severity": "moderate",
    "description": "..."
  }'
\`\`\`

## List your tickets

\`\`\`bash
curl https://api.cognite.com/v2/tickets?status=open \\
  -H "Authorization: Bearer $ACCESS_TOKEN"
\`\`\`

## Add a comment

\`\`\`bash
curl -X POST https://api.cognite.com/v2/tickets/48213/comments \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -d '{"body": "Any update on this?"}'
\`\`\`

Note: this API is a thin, customer-scoped layer over Zendesk's Tickets API — see the technical architecture doc for how field mapping and permission scoping work server-side.`,
  },
  {
    slug: ["api", "rate-limits"],
    title: "Rate limits",
    summary: "Per-plan limits, response headers, and backoff strategy.",
    section: "API Documentation",
    updatedAt: "2026-07-10T00:00:00Z",
    body: `See [Understanding API rate limits](/knowledge/article/api-rate-limits-explained) in the Knowledge Base for the full conceptual explanation and 429-handling strategy. This page is the quick reference:

## Limits by plan

- Standard: 600 req/min per organization
- Enterprise: 3,000 req/min per organization (configurable)

## Headers

\`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\` on every response.`,
  },
  {
    slug: ["integrations", "webhooks"],
    title: "Webhooks",
    summary: "Subscribe to ticket and account events in real time.",
    section: "Integrations",
    updatedAt: "2026-06-25T00:00:00Z",
    apiExample: {
      language: "json",
      code: `{
  "event": "ticket.status_changed",
  "ticket_id": "48213",
  "from_status": "investigating",
  "to_status": "solution_provided",
  "occurred_at": "2026-08-08T09:10:00Z"
}`,
    },
    body: `## Available events

- \`ticket.created\`
- \`ticket.status_changed\`
- \`ticket.comment_added\`
- \`incident.opened\`
- \`incident.updated\`

## Payload example

\`\`\`json
{
  "event": "ticket.status_changed",
  "ticket_id": "48213",
  "from_status": "investigating",
  "to_status": "solution_provided",
  "occurred_at": "2026-08-08T09:10:00Z"
}
\`\`\`

## Verifying signatures

Every webhook request includes an \`X-Cognite-Signature\` header — an HMAC-SHA256 signature of the raw request body using your webhook signing secret. Always verify this before processing the payload.`,
  },
  {
    slug: ["security", "encryption"],
    title: "Data encryption",
    summary: "How Cognite encrypts data at rest and in transit.",
    section: "Security",
    updatedAt: "2026-04-15T00:00:00Z",
    body: `## In transit

All traffic is encrypted with TLS 1.2+. Legacy TLS versions are rejected.

## At rest

Customer data is encrypted at rest using AES-256. Encryption keys are managed via a dedicated key-management service and rotated on a fixed schedule.

## Attachments

Files uploaded to tickets are encrypted at rest using the same standard and are scoped to the requesting organization's access boundary — never accessible cross-tenant.`,
  },
];

export function getDocBySlug(slug: string[]) {
  const key = slug.join("/");
  return docPages.find((d) => d.slug.join("/") === key);
}
