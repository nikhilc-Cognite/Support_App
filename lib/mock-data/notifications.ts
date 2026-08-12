import { NotificationItem } from "@/lib/types";

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    type: "ticket",
    title: "Solution provided on ticket #48213",
    body: "Priya Nandakumar suggested a fix for \"OAuth token refresh failing intermittently\" — please confirm if it resolved your issue.",
    createdAt: "2026-08-08T09:10:00Z",
    read: false,
    href: "/tickets/48213",
  },
  {
    id: "n2",
    type: "incident",
    title: "New incident: Elevated latency in Analytics ingestion",
    body: "INC-1042 is affecting Cognite Analytics in the US region. We're actively monitoring.",
    createdAt: "2026-08-09T12:05:00Z",
    read: false,
    href: "/status/incidents/INC-1042",
  },
  {
    id: "n3",
    type: "ticket",
    title: "Update on ticket #48190",
    body: "Sofia Reyes replied: \"Can you tell us roughly how large the date range is on the report you're exporting?\"",
    createdAt: "2026-08-08T16:44:00Z",
    read: false,
    href: "/tickets/48190",
  },
  {
    id: "n4",
    type: "ticket",
    title: "Ticket #48240 submitted",
    body: "We've received your urgent report about API rate limiting during your nightly sync job.",
    createdAt: "2026-08-09T06:12:00Z",
    read: true,
    href: "/tickets/48240",
  },
  {
    id: "n5",
    type: "maintenance",
    title: "Scheduled maintenance — Aug 14, 02:00–03:00 UTC",
    body: "Brief read-only mode expected during a routine database upgrade in the US region.",
    createdAt: "2026-08-07T10:00:00Z",
    read: true,
    href: "/status",
  },
  {
    id: "n6",
    type: "announcement",
    title: "New: Bulk endpoints now available",
    body: "Reduce API call volume for large sync jobs with new /v2/bulk/* endpoints — see the updated Tickets API docs.",
    createdAt: "2026-08-01T00:00:00Z",
    read: true,
    href: "/docs/api/tickets",
  },
  {
    id: "n7",
    type: "knowledge",
    title: "Article updated: Why is my analytics data delayed?",
    body: "This article you previously viewed was updated with live incident status.",
    createdAt: "2026-08-09T13:20:00Z",
    read: true,
    href: "/knowledge/article/analytics-data-delay-troubleshooting",
  },
];

export function unreadCount() {
  return notifications.filter((n) => !n.read).length;
}
