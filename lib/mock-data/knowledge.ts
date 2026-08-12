import { KnowledgeArticle } from "@/lib/types";

export const knowledgeCategories = [
  { id: "getting-started", name: "Getting Started", product: "All Products", articleCount: 12 },
  { id: "authentication", name: "Authentication & SSO", product: "Cognite Platform", articleCount: 18 },
  { id: "analytics", name: "Analytics & Reporting", product: "Cognite Analytics", articleCount: 24 },
  { id: "integrations", name: "Integrations", product: "All Products", articleCount: 15 },
  { id: "billing", name: "Billing & Plans", product: "All Products", articleCount: 9 },
  { id: "troubleshooting", name: "Troubleshooting", product: "All Products", articleCount: 31 },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "authentication-troubleshooting",
    title: "Troubleshooting authentication and login errors",
    summary: "Diagnose and resolve the most common causes of failed logins, expired sessions, and OAuth token errors.",
    category: "Authentication & SSO",
    product: "Cognite Platform",
    type: "troubleshooting",
    updatedAt: "2026-08-04T00:00:00Z",
    helpfulCount: 342,
    notHelpfulCount: 28,
    trending: true,
    resolutionCount: 23,
    relatedSlugs: ["oauth-api-authentication-guide", "sso-saml-configuration"],
    body: `If you're seeing authentication failures, start by identifying which category of error you're hitting — the fix is different for each.

## "Invalid credentials" on login

This means the username/password pair (or SSO assertion) was rejected before a session was ever created.

- Confirm the account email is correct and not a duplicate across organizations
- If your organization uses SSO, password login is disabled by design — use the "Sign in with SSO" option instead
- Check for a recent password reset that may not have propagated yet (allow up to 2 minutes)

## 401 errors from the API after previously working

This almost always means a token expired or was revoked, not a credentials problem.

- Access tokens expire after 1 hour; refresh tokens should be used to obtain a new one
- If refresh also returns 401, the refresh token itself has likely expired (90-day default) or was revoked by an admin
- Check the **Authentication & SSO** status on the [Status page](/status) — token issuance issues are rare but do happen

## SSO-specific failures

- Confirm your identity provider's certificate hasn't rotated without updating the Cognite SAML configuration
- Group mapping errors will show as a successful login with a "no role assigned" screen, not a login failure

## Still stuck?

If none of the above resolves it, [ask our AI assistant](/ask-ai) with your specific error message — it can check known issues in real time. If it can't resolve it, escalating to a ticket preserves everything you've already described.`,
  },
  {
    slug: "oauth-api-authentication-guide",
    title: "OAuth API authentication guide",
    summary: "Step-by-step guide to authenticating API requests using OAuth 2.0 client credentials and refresh tokens.",
    category: "Authentication & SSO",
    product: "Cognite Platform",
    type: "how-to",
    updatedAt: "2026-07-30T00:00:00Z",
    helpfulCount: 210,
    notHelpfulCount: 11,
    relatedSlugs: ["authentication-troubleshooting"],
    body: `Cognite's API uses OAuth 2.0. Most server-to-server integrations should use the client credentials grant.

## Requesting an access token

\`\`\`bash
curl -X POST https://api.cognite.com/oauth/token \\
  -d grant_type=client_credentials \\
  -d client_id=$COGNITE_CLIENT_ID \\
  -d client_secret=$COGNITE_CLIENT_SECRET
\`\`\`

## Using the token

Include it as a bearer token on every request:

\`\`\`bash
curl https://api.cognite.com/v2/tickets \\
  -H "Authorization: Bearer $ACCESS_TOKEN"
\`\`\`

## Refreshing before expiry

Access tokens last 1 hour. Refresh proactively rather than waiting for a 401 — this avoids the intermittent-failure pattern many integrations hit under load.

1. Store the refresh token securely, never in client-side code
2. Refresh at ~80% of the token lifetime (48 minutes)
3. Handle a failed refresh by re-authenticating from scratch, not retrying indefinitely`,
  },
  {
    slug: "sso-saml-configuration",
    title: "Configuring SAML SSO for your organization",
    summary: "Connect Cognite to Okta, Azure AD, or any SAML 2.0 identity provider.",
    category: "Authentication & SSO",
    product: "Cognite Platform",
    type: "how-to",
    updatedAt: "2026-06-18T00:00:00Z",
    helpfulCount: 156,
    notHelpfulCount: 9,
    relatedSlugs: ["authentication-troubleshooting"],
    body: `Cognite supports SAML 2.0 SSO for Customer Admin-managed organizations.

## Prerequisites

- Customer Admin role in Cognite
- Admin access to your identity provider (Okta, Azure AD, OneLogin, or any SAML 2.0 IdP)

## Setup steps

1. In Cognite, go to Organization Profile → Security → SSO and copy the ACS URL and Entity ID
2. In your IdP, create a new SAML application using those values
3. Map the following attributes: \`email\`, \`first_name\`, \`last_name\`, \`groups\`
4. Upload your IdP's signing certificate back into Cognite
5. Send a test SSO login before enforcing SSO-only login org-wide

## Group mapping

Groups from your IdP map to Cognite roles (Admin / Member / Viewer). Unmapped groups default to Viewer — plan your group names accordingly before rollout.`,
  },
  {
    slug: "analytics-data-delay-troubleshooting",
    title: "Why is my analytics data delayed?",
    summary: "Understand normal ingestion latency vs. an active data delay incident, and what to check first.",
    category: "Analytics & Reporting",
    product: "Cognite Analytics",
    type: "known-issue",
    updatedAt: "2026-08-09T13:20:00Z",
    helpfulCount: 88,
    notHelpfulCount: 4,
    trending: true,
    resolutionCount: 6,
    relatedSlugs: ["export-usage-reports"],
    body: `## Normal ingestion latency

Under typical load, events appear in Cognite Analytics dashboards within 2–5 minutes of being received.

## Currently elevated delay

There is an active incident affecting ingestion latency in the US region — see [INC-1042](/status/incidents/INC-1042) for live status. During this incident, expect delays of up to 20 minutes. No data is lost; this is a processing delay only.

## What to check before contacting support

- Confirm the [Status page](/status) doesn't already show a known incident for Analytics
- Check whether the delay is isolated to one data source or affects all events — isolated delays are usually source-side, not platform-side
- Large custom date-range queries can appear "delayed" when they are actually just slow to render — try narrowing the range first`,
  },
  {
    slug: "export-usage-reports",
    title: "Exporting usage reports as CSV or PDF",
    summary: "How to generate, schedule, and troubleshoot exports of usage and billing reports.",
    category: "Analytics & Reporting",
    product: "Cognite Analytics",
    type: "how-to",
    updatedAt: "2026-07-22T00:00:00Z",
    helpfulCount: 121,
    notHelpfulCount: 7,
    relatedSlugs: ["analytics-data-delay-troubleshooting"],
    body: `## Exporting a report

1. Open the report you'd like to export
2. Click **Export** in the top-right of the report view
3. Choose CSV (raw data) or PDF (formatted, for sharing)

## Scheduling recurring exports

Reports can be scheduled to export automatically and emailed to a distribution list — configure this under Report Settings → Scheduled Delivery.

## Common export issues

- Exports covering more than 12 months of data may take several minutes — this is expected, not a failure
- If an export spins indefinitely for over 5 minutes, it has likely failed silently; refresh and retry rather than waiting further
- PDF exports of dashboards with more than 20 widgets may be truncated — export as CSV instead for full data`,
  },
  {
    slug: "getting-started-with-cognite",
    title: "Getting started with Cognite",
    summary: "A first-time setup walkthrough: creating your workspace, inviting your team, and connecting your first integration.",
    category: "Getting Started",
    product: "All Products",
    type: "how-to",
    updatedAt: "2026-05-14T00:00:00Z",
    helpfulCount: 498,
    notHelpfulCount: 19,
    trending: true,
    relatedSlugs: ["sso-saml-configuration"],
    body: `Welcome to Cognite. This guide covers the essential first steps.

## 1. Set up your workspace

Choose your organization name and primary region during onboarding — region cannot be changed later without a data migration, so pick the region closest to your primary user base.

## 2. Invite your team

Go to Organization Profile → Authorized Users → Invite. Invited users receive an email with a signup link valid for 7 days.

## 3. Connect your first integration

Most customers start with Slack or Salesforce. Both take under 5 minutes to connect via OAuth — no API keys to manage manually.

## 4. Explore the product

We recommend starting with the [Learn](/learn) section's "Cognite Fundamentals" course — about 25 minutes, and covers the concepts referenced throughout the rest of the documentation.`,
  },
  {
    slug: "api-rate-limits-explained",
    title: "Understanding API rate limits",
    summary: "How Cognite enforces rate limits, how to read the response headers, and how to design for burst traffic.",
    category: "Troubleshooting",
    product: "Cognite Platform",
    type: "faq",
    updatedAt: "2026-07-10T00:00:00Z",
    helpfulCount: 176,
    notHelpfulCount: 14,
    resolutionCount: 11,
    relatedSlugs: ["oauth-api-authentication-guide"],
    body: `## Default limits

Standard plans: 600 requests/minute per organization. Enterprise plans: 3,000 requests/minute, configurable higher on request.

## Reading rate limit headers

Every API response includes:

- \`X-RateLimit-Limit\` — your current limit
- \`X-RateLimit-Remaining\` — requests remaining in the current window
- \`X-RateLimit-Reset\` — unix timestamp when the window resets

## Handling 429 responses

Back off using the \`Retry-After\` header rather than a fixed delay — this adapts correctly if your limit changes.

## Designing for burst jobs

Nightly sync jobs are the most common source of rate-limit issues. Spread large syncs across the full window instead of firing all requests at once, and consider using bulk endpoints (\`/v2/bulk/*\`) where available — they count as a single request regardless of record count.`,
  },
  {
    slug: "billing-plan-changes",
    title: "How plan changes and billing cycles work",
    summary: "What happens to your billing when you upgrade, downgrade, or add seats mid-cycle.",
    category: "Billing & Plans",
    product: "All Products",
    type: "faq",
    updatedAt: "2026-06-02T00:00:00Z",
    helpfulCount: 94,
    notHelpfulCount: 21,
    relatedSlugs: [],
    body: `## Upgrading

Upgrades take effect immediately and are prorated for the remainder of your current billing cycle.

## Downgrading

Downgrades take effect at the start of your next billing cycle, so you retain access to current-plan features until then.

## Adding seats

Additional seats are prorated and billed immediately; removing seats takes effect next cycle, same as a downgrade.

## Questions about your specific invoice

Our Ask AI assistant can't access live billing data for security reasons — for anything account-specific, please [create a ticket](/tickets/new) with the Billing category so it routes directly to our billing team.`,
  },
];

export function getArticleBySlug(slug: string) {
  return knowledgeArticles.find((a) => a.slug === slug);
}

export function trendingArticles() {
  return knowledgeArticles.filter((a) => a.trending);
}

export function recentlyUpdatedArticles(limit = 5) {
  return [...knowledgeArticles].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, limit);
}
