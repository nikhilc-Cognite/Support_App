import { AIMessage } from "@/lib/types";

const KEY = "cognite-ai-handoff";

export interface AIHandoff {
  transcript: AIMessage[];
  suggestedSubject: string;
  suggestedDescription: string;
}

export function saveHandoff(handoff: AIHandoff) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(handoff));
}

export function readHandoff(): AIHandoff | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AIHandoff;
  } catch {
    return null;
  }
}

export function clearHandoff() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
