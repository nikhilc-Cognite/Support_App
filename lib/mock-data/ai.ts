import {
  HelpCircle,
  BadgeQuestionMark,
  Mail,
  Bug,
  FileText,
  Search,
  type LucideIcon,
} from "lucide-react";

/**
 * Empty-state prompt tiles for Ask AI (matches Cognite/kapa assistant UX).
 * `label` is shown on the tile; `query` is what we send to kapa.ai.
 */
export const suggestedPrompts: {
  label: string;
  query: string;
  icon: LucideIcon;
}[] = [
  {
    label: "How can I do ...?",
    query: "How to create a CDF project",
    icon: HelpCircle,
  },
  {
    label: "Do we support ...?",
    query: "Do we support SAML SSO for my organization?",
    icon: BadgeQuestionMark,
  },
  {
    label: "Reply to customer",
    query: "Help me draft a reply to a customer about a CDF authentication issue",
    icon: Mail,
  },
  {
    label: "Debug an error",
    query: "How do I debug a 401 error from the Cognite API?",
    icon: Bug,
  },
  {
    label: "Create KB article",
    query: "How do I create a knowledge base article in Cognite support?",
    icon: FileText,
  },
  {
    label: "Find existing issue",
    query: "How do I find an existing known issue in Cognite?",
    icon: Search,
  },
];

/** @deprecated use suggestedPrompts — kept for any leftover imports */
export const suggestedQuestions = suggestedPrompts.map((p) => p.query);

/**
 * Canned response matcher for the prototype — keyword-matched fallback only.
 * Live Ask AI uses kapa.ai via /api/ask-ai.
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
        "A 401 from the API almost always means your access token expired or was revoked — not a credentials problem. Access tokens last 1 hour; you should refresh proactively rather than waiting for a 401.",
      sources: [
        { title: "Troubleshooting authentication and login errors", href: "/knowledge/article/authentication-troubleshooting", type: "Knowledge", resolutionCount: 23 },
      ],
    };
  }

  return {
    content:
      "I searched our Knowledge Base and documentation but couldn't find a confident answer to that — I don't want to guess.",
    suggestEscalation: true,
  };
}
