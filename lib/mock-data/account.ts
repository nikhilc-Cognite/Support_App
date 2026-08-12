export const currentUser = {
  id: "usr_1001",
  name: "Daniel Ortiz",
  email: "daniel.ortiz@acmecorp.com",
  role: "Customer User" as const,
  avatarInitials: "DO",
  title: "Senior Platform Engineer",
  notificationPreferences: {
    ticketUpdates: true,
    incidentUpdates: true,
    productAnnouncements: false,
    knowledgeBaseUpdates: false,
  },
};

export const currentOrganization = {
  id: "org_500",
  name: "Acme Corporation",
  supportPlan: "Enterprise" as const,
  since: "2023-02-14T00:00:00Z",
  accountManager: { name: "Marcus Webb", email: "marcus.webb@cognite.com", avatarInitials: "MW" },
  entitlements: [
    { product: "Cognite Platform", tier: "Enterprise" },
    { product: "Cognite Analytics", tier: "Enterprise" },
  ],
  authorizedUsers: [
    { id: "usr_1001", name: "Daniel Ortiz", email: "daniel.ortiz@acmecorp.com", role: "Member", lastActive: "2026-08-09T06:12:00Z" },
    { id: "usr_1002", name: "Priya Sharma", email: "priya.sharma@acmecorp.com", role: "Admin", lastActive: "2026-08-06T13:20:00Z" },
    { id: "usr_1003", name: "Kenji Tanaka", email: "kenji.tanaka@acmecorp.com", role: "Member", lastActive: "2026-07-29T11:00:00Z" },
    { id: "usr_1004", name: "Emma Fischer", email: "emma.fischer@acmecorp.com", role: "Viewer", lastActive: "2026-07-15T09:30:00Z" },
  ],
  supportHistory: {
    totalTickets: 47,
    openTickets: 3,
    avgResolutionHours: 14.2,
    csatAverage: 4.6,
  },
};

export const products = [
  { id: "platform", name: "Cognite Platform", description: "Core workflow and identity platform" },
  { id: "analytics", name: "Cognite Analytics", description: "Reporting, dashboards, and data pipelines" },
];
