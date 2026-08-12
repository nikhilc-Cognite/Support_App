import { LearnItem } from "@/lib/types";

export const learnItems: LearnItem[] = [
  {
    slug: "cognite-fundamentals",
    title: "Cognite Fundamentals",
    type: "course",
    product: "All Products",
    difficulty: "Beginner",
    durationMinutes: 25,
    summary: "The core concepts referenced throughout every other doc and course — start here.",
    progress: 100,
  },
  {
    slug: "advanced-api-integration",
    title: "Advanced API Integration Patterns",
    type: "course",
    product: "Cognite Platform",
    difficulty: "Advanced",
    durationMinutes: 55,
    summary: "Webhooks, bulk endpoints, and designing resilient sync jobs that respect rate limits.",
    progress: 40,
  },
  {
    slug: "sso-deep-dive-webinar",
    title: "SSO Deep Dive: SAML & SCIM in Practice",
    type: "webinar",
    product: "Cognite Platform",
    difficulty: "Intermediate",
    durationMinutes: 45,
    summary: "Recorded webinar walking through real customer SSO configurations, including common pitfalls.",
  },
  {
    slug: "building-your-first-dashboard",
    title: "Building Your First Analytics Dashboard",
    type: "tutorial",
    product: "Cognite Analytics",
    difficulty: "Beginner",
    durationMinutes: 15,
    summary: "Hands-on tutorial: create a dashboard, add widgets, and share it with your team.",
    progress: 0,
  },
  {
    slug: "rate-limit-design-video",
    title: "Designing Sync Jobs That Respect Rate Limits",
    type: "video",
    product: "Cognite Platform",
    difficulty: "Intermediate",
    durationMinutes: 12,
    summary: "Short video walkthrough of bulk endpoints and backoff strategy for high-volume integrations.",
  },
  {
    slug: "admin-best-practices",
    title: "Organization Admin Best Practices",
    type: "course",
    product: "All Products",
    difficulty: "Intermediate",
    durationMinutes: 35,
    summary: "Structuring authorized users, roles, and entitlements for a growing organization.",
    progress: 0,
  },
];

export function getLearnItemBySlug(slug: string) {
  return learnItems.find((l) => l.slug === slug);
}
