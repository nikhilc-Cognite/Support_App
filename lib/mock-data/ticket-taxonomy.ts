/**
 * Product taxonomy for the Create Ticket wizard. In production this would
 * come from Zendesk Ticket Fields (cascading dropdown field config) rather
 * than being hardcoded — see docs/03-technical-architecture.md § 5.
 */

export type TicketCategory = "product_platform" | "solutions_custom";

export const categoryOptions: { id: TicketCategory; label: string; description: string }[] = [
  { id: "product_platform", label: "Product / Platform", description: "Core Cognite products, APIs, and platform features" },
  { id: "solutions_custom", label: "Solutions / Custom Solutions", description: "Bespoke implementations, managed services, professional services" },
];

export interface ProductOption {
  id: string;
  name: string;
  subProducts: string[];
}

export const productsByCategory: Record<TicketCategory, ProductOption[]> = {
  product_platform: [
    { id: "platform", name: "Cognite Platform", subProducts: ["Authentication & SSO", "User Management", "Workflow Engine", "Notifications"] },
    { id: "analytics", name: "Cognite Analytics", subProducts: ["Dashboards", "Reporting & Export", "Data Ingestion", "Alerts"] },
    { id: "api", name: "API", subProducts: ["Authentication API", "Tickets API", "Webhooks", "Search API", "Rate Limits"] },
    { id: "integrations", name: "Integrations", subProducts: ["Slack Integration", "Salesforce Integration", "Custom Webhook Integration"] },
  ],
  solutions_custom: [
    { id: "custom-integration", name: "Custom Integration", subProducts: ["Data Migration", "Legacy System Bridge"] },
    { id: "managed-services", name: "Managed Services", subProducts: ["Managed Hosting", "Managed Monitoring"] },
    { id: "professional-services", name: "Professional Services", subProducts: ["Implementation", "Training", "Custom Reporting Build"] },
  ],
};

export const urgencyOptions = ["Low", "Normal", "High", "Urgent"] as const;
export type TicketUrgency = (typeof urgencyOptions)[number];

export const impactOptions = [
  "Minor / Localised",
  "Moderate / Limited",
  "Significant / Large",
  "Extensive / Widespread",
] as const;
export type TicketImpact = (typeof impactOptions)[number];
