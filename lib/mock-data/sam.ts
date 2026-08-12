export const samAccounts = [
  {
    id: "org_500",
    name: "Acme Corporation",
    plan: "Enterprise",
    healthScore: 82,
    healthTrend: "up" as const,
    openTickets: 3,
    criticalTickets: 1,
    slaAtRisk: 1,
    csat: 4.6,
    reopenedRate: 4,
  },
  {
    id: "org_501",
    name: "Nova Industries",
    plan: "Enterprise",
    healthScore: 58,
    healthTrend: "down" as const,
    openTickets: 9,
    criticalTickets: 2,
    slaAtRisk: 3,
    csat: 3.4,
    reopenedRate: 18,
  },
  {
    id: "org_502",
    name: "Bluewave Logistics",
    plan: "Business",
    healthScore: 91,
    healthTrend: "up" as const,
    openTickets: 1,
    criticalTickets: 0,
    slaAtRisk: 0,
    csat: 4.9,
    reopenedRate: 0,
  },
  {
    id: "org_503",
    name: "Fjord Analytics",
    plan: "Enterprise",
    healthScore: 71,
    healthTrend: "flat" as const,
    openTickets: 5,
    criticalTickets: 0,
    slaAtRisk: 1,
    csat: 4.1,
    reopenedRate: 7,
  },
];

export const ticketVolumeTrend = [
  { week: "Jun 15", opened: 12, resolved: 10 },
  { week: "Jun 22", opened: 15, resolved: 14 },
  { week: "Jun 29", opened: 9, resolved: 12 },
  { week: "Jul 6", opened: 18, resolved: 15 },
  { week: "Jul 13", opened: 14, resolved: 16 },
  { week: "Jul 20", opened: 11, resolved: 13 },
  { week: "Jul 27", opened: 20, resolved: 17 },
  { week: "Aug 3", opened: 16, resolved: 18 },
];

export const slaPerformanceTrend = [
  { week: "Jun 15", metPct: 96 },
  { week: "Jun 22", metPct: 94 },
  { week: "Jun 29", metPct: 97 },
  { week: "Jul 6", metPct: 91 },
  { week: "Jul 13", metPct: 93 },
  { week: "Jul 20", metPct: 95 },
  { week: "Jul 27", metPct: 89 },
  { week: "Aug 3", metPct: 92 },
];

export const recurringIssues = [
  { issue: "OAuth token refresh errors", count: 14, product: "Cognite Platform" },
  { issue: "Analytics export timeouts", count: 9, product: "Cognite Analytics" },
  { issue: "SSO group mapping questions", count: 7, product: "Cognite Platform" },
  { issue: "Dashboard widget load failures", count: 5, product: "Cognite Analytics" },
  { issue: "API rate limit during sync jobs", count: 5, product: "Cognite Platform" },
];

export const knowledgeUsage = { deflectionRate: 38, aiResolutionRate: 24, articlesViewedPerTicket: 1.8 };

export const resolutionIntelligence = {
  articlesPromotedThisMonth: 9,
  verifiedFixResolutions: 40,
  estimatedTicketsDeflected: 40,
  avgAgentAuthoringTimeSavedMinutes: 22,
};
