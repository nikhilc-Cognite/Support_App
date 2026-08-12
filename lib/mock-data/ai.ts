export const suggestedQuestions = [
  "Why am I getting a 401 error from the API?",
  "How do I configure SAML SSO for my organization?",
  "Are there any known incidents affecting Analytics?",
  "How do I export a usage report as CSV?",
  "What's the difference between access and refresh tokens?",
];

/**
 * Canned response matcher for the prototype — keyword-matched, not a real
 * model. Structured so the shape (content + sources + escalation flag) is
 * exactly what a real LLM-backed endpoint would return, per
 * docs/03-technical-architecture.md § AI architecture.
 */
export interface CannedResponse {
  content: string;
  sources?: { title: string; href: string; type: "Knowledge" | "Docs" | "Known Issue"; resolutionCount?: number }[];
  suggestEscalation?: boolean;
}

export function matchResponse(query: string): CannedResponse {
  const q = query.toLowerCase();

  if (q.includes("401") || q.includes("token") || q.includes("oauth") || q.includes("auth")) {
    return {
      content:
        "A 401 from the API almost always means your access token expired or was revoked — not a credentials problem. Access tokens last 1 hour; you should refresh proactively rather than waiting for a 401. If refreshing also returns 401, your refresh token itself has likely expired (90-day default) or was revoked by an admin.\n\nI also checked current system status — there are no active incidents affecting Authentication right now, so this is very likely a client-side token-lifecycle issue rather than a platform problem. This exact fix has closed out 23 other tickets with the same symptom, so it's a well-worn path.",
      sources: [
        { title: "Troubleshooting authentication and login errors", href: "/knowledge/article/authentication-troubleshooting", type: "Knowledge", resolutionCount: 23 },
        { title: "OAuth API authentication guide", href: "/knowledge/article/oauth-api-authentication-guide", type: "Knowledge" },
        { title: "API Documentation — Authentication", href: "/docs/api/authentication", type: "Docs" },
      ],
    };
  }

  if (q.includes("sso") || q.includes("saml") || q.includes("okta") || q.includes("azure ad")) {
    return {
      content:
        "To configure SAML SSO: in Cognite, go to Organization Profile → Security → SSO and copy the ACS URL and Entity ID, then create a matching SAML application in your identity provider. You'll need to map the email, first_name, last_name, and groups attributes, and upload your IdP's signing certificate back into Cognite.\n\nOne thing worth double-checking up front: unmapped IdP groups default to the Viewer role in Cognite, so plan your group names before rollout to avoid users landing with less access than expected.",
      sources: [
        { title: "Configuring SAML SSO for your organization", href: "/knowledge/article/sso-saml-configuration", type: "Knowledge" },
      ],
    };
  }

  if (q.includes("incident") || q.includes("down") || q.includes("outage") || q.includes("delay")) {
    return {
      content:
        "Yes — there's one active incident right now: INC-1042, elevated latency in Analytics data ingestion (US region), currently in the Monitoring stage. Expect up to a 20-minute delay before events appear in dashboards; no data is being lost. Everything else is showing Operational.",
      sources: [
        { title: "INC-1042 — Elevated latency in Analytics data ingestion", href: "/status/incidents/INC-1042", type: "Known Issue" },
        { title: "Why is my analytics data delayed?", href: "/knowledge/article/analytics-data-delay-troubleshooting", type: "Knowledge", resolutionCount: 6 },
      ],
    };
  }

  if (q.includes("csv") || q.includes("export") || q.includes("report")) {
    return {
      content:
        "To export a usage report: open the report, click Export in the top-right, and choose CSV for raw data or PDF for a formatted, shareable version. Exports covering more than 12 months of data can take several minutes, which is expected — but if an export spins for more than 5 minutes with no result, it's likely failed silently, so refresh and retry rather than waiting.",
      sources: [{ title: "Exporting usage reports as CSV or PDF", href: "/knowledge/article/export-usage-reports", type: "Knowledge" }],
    };
  }

  if (q.includes("rate limit") || q.includes("429") || q.includes("sync job")) {
    return {
      content:
        "429 errors mean you've hit your organization's rate limit — 600 req/min on Standard plans, 3,000 req/min on Enterprise. Every response includes X-RateLimit-Remaining and Retry-After headers; back off using Retry-After rather than a fixed delay. For nightly sync jobs specifically, spreading requests across the full window (instead of firing them all at once) and using the /v2/bulk/* endpoints usually resolves this entirely, since bulk calls count as a single request regardless of record count.\n\nIf you're already doing this and still hitting limits consistently, that's worth a ticket — it may need a limit increase on your account rather than a code change.",
      sources: [
        { title: "Understanding API rate limits", href: "/knowledge/article/api-rate-limits-explained", type: "Knowledge", resolutionCount: 11 },
        { title: "API Documentation — Rate Limits", href: "/docs/api/rate-limits", type: "Docs" },
      ],
      suggestEscalation: true,
    };
  }

  return {
    content:
      "I searched our Knowledge Base and documentation but couldn't find a confident answer to that — I don't want to guess. Could you tell me a bit more about what you're seeing (an error message, which product, and roughly when it started)? Or, if you'd rather talk to a person directly, I can create a support ticket and carry this conversation over so you don't have to repeat yourself.",
      suggestEscalation: true,
  };
}
