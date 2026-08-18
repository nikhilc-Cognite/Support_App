/**
 * Client helpers for Cognite Ask AI (kapa.ai via our /api/ask-ai proxy).
 */

export type AskAISource = {
  title: string;
  href: string;
  type: "Knowledge" | "Docs" | "Known Issue";
  resolutionCount?: number;
};

export type AskAIResponse = {
  answer: string;
  threadId: string | null;
  sources: AskAISource[];
  suggestEscalation?: boolean;
};

export async function fetchAskAIStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/ask-ai", { method: "GET", cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { configured?: boolean };
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

export async function askAI(query: string, threadId?: string | null): Promise<AskAIResponse> {
  const res = await fetch("/api/ask-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, threadId: threadId || undefined }),
  });

  const data = (await res.json()) as AskAIResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Ask AI failed (${res.status})`);
  }
  return {
    answer: data.answer,
    threadId: data.threadId ?? null,
    sources: uniqueSources(data.sources ?? []),
    suggestEscalation: data.suggestEscalation,
  };
}

function uniqueSources(sources: AskAISource[]): AskAISource[] {
  const seen = new Set<string>();
  const out: AskAISource[] = [];
  for (const s of sources) {
    const key = (s.href || s.title)
      .split("#")[0]
      .split("?")[0]
      .replace(/\/+$/, "")
      .toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}
