import { StatusComponent, Incident } from "@/lib/types";

export const statusComponents: StatusComponent[] = [
  { id: "core-platform", name: "Core Platform", status: "operational", group: "Platform" },
  { id: "api", name: "Public API", status: "operational", group: "Platform" },
  { id: "webhooks", name: "Webhooks", status: "operational", group: "Platform" },
  { id: "auth", name: "Authentication & SSO", status: "operational", group: "Identity" },
  { id: "user-mgmt", name: "User Management", status: "operational", group: "Identity" },
  { id: "analytics-ingest", name: "Analytics — Data Ingestion", status: "degraded", group: "Analytics" },
  { id: "analytics-dash", name: "Analytics — Dashboards", status: "operational", group: "Analytics" },
  { id: "reporting-export", name: "Reporting — CSV/PDF Export", status: "operational", group: "Analytics" },
  { id: "integrations-slack", name: "Slack Integration", status: "operational", group: "Integrations" },
  { id: "integrations-salesforce", name: "Salesforce Integration", status: "operational", group: "Integrations" },
  { id: "eu-region", name: "EU Region (Frankfurt)", status: "operational", group: "Infrastructure" },
  { id: "us-region", name: "US Region (Virginia)", status: "operational", group: "Infrastructure" },
];

export const incidents: Incident[] = [
  {
    id: "INC-1042",
    title: "Elevated latency in Analytics data ingestion",
    severity: "minor",
    status: "monitoring",
    affectedProducts: ["Cognite Analytics"],
    affectedRegions: ["US Region (Virginia)"],
    startedAt: "2026-08-09T12:05:00Z",
    customerImpact:
      "Event data may take up to 20 minutes longer than usual to appear in dashboards. No data is being lost; ingestion is delayed, not dropped.",
    relatedArticleSlugs: ["analytics-data-delay-troubleshooting"],
    updates: [
      {
        id: "u1",
        status: "investigating",
        message: "We're investigating reports of delayed event processing in Analytics data ingestion for the US region.",
        createdAt: "2026-08-09T12:05:00Z",
      },
      {
        id: "u2",
        status: "identified",
        message: "We've identified increased load on an ingestion queue as the cause and are scaling additional capacity.",
        createdAt: "2026-08-09T12:41:00Z",
      },
      {
        id: "u3",
        status: "monitoring",
        message: "Additional capacity has been added and ingestion delay is trending back to normal. We're continuing to monitor before marking this resolved.",
        createdAt: "2026-08-09T13:20:00Z",
      },
    ],
  },
  {
    id: "INC-1038",
    title: "Brief authentication errors for SSO users in EU region",
    severity: "major",
    status: "resolved",
    affectedProducts: ["Cognite Platform"],
    affectedRegions: ["EU Region (Frankfurt)"],
    startedAt: "2026-08-05T07:58:00Z",
    resolvedAt: "2026-08-05T08:47:00Z",
    customerImpact: "Some EU-region users authenticating via SAML SSO received intermittent login failures for approximately 49 minutes.",
    relatedArticleSlugs: [],
    updates: [
      { id: "u1", status: "investigating", message: "Investigating reports of SSO login failures for EU-region customers.", createdAt: "2026-08-05T07:58:00Z" },
      { id: "u2", status: "identified", message: "Identified a certificate rotation issue on our EU identity provider integration.", createdAt: "2026-08-05T08:15:00Z" },
      { id: "u3", status: "monitoring", message: "Fix deployed. SSO logins are succeeding normally; continuing to monitor.", createdAt: "2026-08-05T08:35:00Z" },
      { id: "u4", status: "resolved", message: "Confirmed fully resolved. All EU-region SSO logins are processing normally.", createdAt: "2026-08-05T08:47:00Z" },
    ],
  },
  {
    id: "INC-1021",
    title: "Scheduled maintenance — Database upgrade (US region)",
    severity: "minor",
    status: "resolved",
    affectedProducts: ["Cognite Platform", "Cognite Analytics"],
    affectedRegions: ["US Region (Virginia)"],
    startedAt: "2026-07-27T04:00:00Z",
    resolvedAt: "2026-07-27T05:30:00Z",
    customerImpact: "Planned maintenance window; brief read-only mode for approximately 15 minutes during cutover.",
    relatedArticleSlugs: [],
    updates: [
      { id: "u1", status: "investigating", message: "Scheduled maintenance window has begun as announced.", createdAt: "2026-07-27T04:00:00Z" },
      { id: "u2", status: "resolved", message: "Maintenance completed successfully ahead of schedule. All systems fully operational.", createdAt: "2026-07-27T05:30:00Z" },
    ],
  },
];

export function overallStatus(): "operational" | "degraded" | "outage" {
  if (statusComponents.some((c) => c.status === "major_outage")) return "outage";
  if (statusComponents.some((c) => c.status === "degraded" || c.status === "partial_outage")) return "degraded";
  return "operational";
}

export function activeIncidents(): Incident[] {
  return incidents.filter((i) => i.status !== "resolved");
}
