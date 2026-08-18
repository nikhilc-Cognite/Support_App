/**
 * Server-only Cognite Ask AI client (kapa.ai Chat API).
 *
 * Never import this from client components — the API key must stay on the server.
 * Docs: https://docs.kapa.ai/integrations/chat-api
 *
 * Config (first match wins):
 *   1. process.env KAPA_API_KEY / KAPA_PROJECT_ID / KAPA_INTEGRATION_ID
 *   2. kapa.local.json in the project root (gitignored)
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type KapaSource = {
  title: string;
  href: string;
  type: "Knowledge" | "Docs" | "Known Issue";
};

export type KapaChatResult = {
  answer: string;
  threadId: string | null;
  sources: KapaSource[];
  isUncertain?: boolean;
};

type LocalKapaConfig = {
  apiKey?: string;
  projectId?: string;
  integrationId?: string;
};

function loadLocalConfig(): LocalKapaConfig {
  try {
    const path = join(process.cwd(), "kapa.local.json");
    if (!existsSync(path)) return {};
    return JSON.parse(readFileSync(path, "utf8")) as LocalKapaConfig;
  } catch {
    return {};
  }
}

export function getKapaConfig() {
  const local = loadLocalConfig();
  return {
    apiKey: process.env.KAPA_API_KEY?.trim() || local.apiKey?.trim() || "",
    projectId: process.env.KAPA_PROJECT_ID?.trim() || local.projectId?.trim() || "",
    integrationId: process.env.KAPA_INTEGRATION_ID?.trim() || local.integrationId?.trim() || "",
  };
}

export function isKapaApiConfigured(): boolean {
  const { apiKey, projectId } = getKapaConfig();
  return Boolean(apiKey && projectId);
}

function cleanTitle(title: string): string {
  const trimmed = title.trim();
  // kapa often returns "Page title|Page title" or "Section|Page"
  if (trimmed.includes("|")) {
    const parts = trimmed
      .split("|")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
      return parts[0];
    }
    // Prefer the more specific left segment when both exist
    return parts[0] || trimmed;
  }
  return trimmed;
}

/** Dedupe key: same doc path counts once even with different #fragments */
function sourceIdentity(href: string, title: string): string {
  try {
    const url = new URL(href);
    url.hash = "";
    // Drop common cognite fragment noise; keep path + host
    const normalized = `${url.origin}${url.pathname}`.replace(/\/+$/, "").toLowerCase();
    return normalized || href.toLowerCase();
  } catch {
    const bare = href.split("#")[0].split("?")[0].replace(/\/+$/, "").toLowerCase();
    return bare || title.toLowerCase();
  }
}

function normalizeSource(raw: Record<string, unknown>): KapaSource | null {
  const href =
    (typeof raw.source_url === "string" && raw.source_url) ||
    (typeof raw.url === "string" && raw.url) ||
    (typeof raw.href === "string" && raw.href) ||
    "";
  const title = cleanTitle(
    (typeof raw.title === "string" && raw.title) ||
      (typeof raw.source_title === "string" && raw.source_title) ||
      (typeof raw.name === "string" && raw.name) ||
      href ||
      "Source",
  );

  if (!href && title === "Source") return null;

  const kind = String(raw.source_type || raw.type || raw.kind || "").toLowerCase();
  let type: KapaSource["type"] = "Docs";
  if (kind.includes("issue") || kind.includes("incident")) type = "Known Issue";
  else if (kind.includes("knowledge") || kind.includes("article") || kind.includes("guide")) type = "Knowledge";
  else if (href.includes("/knowledge") || href.includes("support")) type = "Knowledge";

  return { title, href: href || "#", type };
}

function extractSources(payload: Record<string, unknown>): KapaSource[] {
  const candidates =
    (Array.isArray(payload.relevant_sources) && payload.relevant_sources) ||
    (Array.isArray(payload.sources) && payload.sources) ||
    (Array.isArray(payload.citations) && payload.citations) ||
    [];

  const seen = new Set<string>();
  const out: KapaSource[] = [];
  for (const item of candidates) {
    if (!item || typeof item !== "object") continue;
    const source = normalizeSource(item as Record<string, unknown>);
    if (!source) continue;
    const key = sourceIdentity(source.href, source.title);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(source);
  }
  return out;
}

function extractAnswer(payload: Record<string, unknown>): string {
  if (typeof payload.answer === "string") return payload.answer;
  if (typeof payload.content === "string") return payload.content;
  if (typeof payload.response === "string") return payload.response;
  if (payload.message && typeof payload.message === "object") {
    const msg = payload.message as Record<string, unknown>;
    if (typeof msg.content === "string") return msg.content;
    if (typeof msg.answer === "string") return msg.answer;
  }
  return "";
}

async function kapaFetch(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const { apiKey } = getKapaConfig();
  const res = await fetch(`https://api.kapa.ai${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    throw new Error(text || `kapa.ai returned ${res.status}`);
  }

  if (!res.ok) {
    const detail =
      (typeof json.detail === "string" && json.detail) ||
      (typeof json.message === "string" && json.message) ||
      (typeof json.error === "string" && json.error) ||
      `kapa.ai error ${res.status}`;
    throw new Error(detail);
  }

  return json;
}

/**
 * Start a new conversation or continue an existing thread.
 * Matches Cognite curl: POST /query/v1/projects/{id}/chat/ with { "query": "..." }
 */
export async function chatWithKapa(query: string, threadId?: string | null): Promise<KapaChatResult> {
  const { projectId, integrationId } = getKapaConfig();
  if (!isKapaApiConfigured()) {
    throw new Error("kapa.ai API is not configured");
  }

  const trimmed = query.trim();
  if (!trimmed) throw new Error("Query is required");

  const body: Record<string, unknown> = {
    query: trimmed,
  };
  if (integrationId) {
    body.integration_id = integrationId;
  }

  const path = threadId
    ? `/query/v1/threads/${encodeURIComponent(threadId)}/chat/`
    : `/query/v1/projects/${encodeURIComponent(projectId)}/chat/`;

  const payload = await kapaFetch(path, body);
  const answer = extractAnswer(payload).trim();
  const nextThreadId =
    (typeof payload.thread_id === "string" && payload.thread_id) ||
    threadId ||
    null;

  if (!answer) {
    throw new Error("kapa.ai returned an empty answer");
  }

  return {
    answer,
    threadId: nextThreadId,
    sources: extractSources(payload),
    isUncertain: Boolean(payload.is_uncertain),
  };
}
