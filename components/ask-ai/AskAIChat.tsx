"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, LifeBuoy, User } from "lucide-react";
import { AIMessage } from "@/lib/types";
import { suggestedPrompts } from "@/lib/mock-data/ai";
import { askAI, fetchAskAIStatus } from "@/lib/kapa";
import { SourceCard } from "@/components/ask-ai/SourceCard";
import { MarkdownBody } from "@/components/MarkdownBody";
import { Button } from "@/components/ui/Button";
import { saveHandoff } from "@/lib/ai-handoff";
import { cn } from "@/lib/utils";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

/** Full-page Ask AI — independent conversation from the floating launcher. */
export function AskAIChat({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef(false);
  const threadIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    fetchAskAIStatus().then(setConfigured);
  }, []);

  useEffect(() => {
    thinkingRef.current = thinking;
  }, [thinking]);

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinkingRef.current) return;

    setError(null);
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: trimmed }]);
    setInput("");
    setThinking(true);
    thinkingRef.current = true;

    try {
      const response = await askAI(trimmed, threadIdRef.current);
      if (response.threadId) {
        setThreadId(response.threadId);
        threadIdRef.current = response.threadId;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: response.answer,
          sources: response.sources,
          suggestEscalation: response.suggestEscalation,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: `I couldn’t reach Cognite Ask AI right now. ${message}`,
          suggestEscalation: true,
        },
      ]);
    } finally {
      thinkingRef.current = false;
      setThinking(false);
    }
  }

  useEffect(() => {
    if (configured === true && initialQuery && !startedRef.current) {
      startedRef.current = true;
      void send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, initialQuery]);

  function escalate() {
    const firstUser = messages.find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    saveHandoff({
      transcript: messages,
      suggestedSubject: firstUser?.content.slice(0, 80) ?? "Issue reported via Ask AI",
      suggestedDescription:
        `${firstUser?.content ?? ""}\n\n— Ask AI attempted the following: ${lastAssistant?.content ?? ""}`.slice(0, 1200),
    });
    router.push("/tickets/new?fromAI=1");
  }

  const hasMessages = messages.length > 0;
  const ready = configured === true;

  if (configured === false) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-50 dark:bg-warning-900/40">
          <Sparkles className="h-6 w-6 text-warning-500" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-neutral-900">Ask AI needs configuration</h1>
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          Add your Cognite kapa.ai API credentials to <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">.env.local</code>, then restart the server.
        </p>
        <pre className="mt-6 max-w-lg overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left text-xs text-neutral-700">
{`KAPA_API_KEY=...
KAPA_PROJECT_ID=...`}
        </pre>
        <p className="mt-4 text-xs text-neutral-400">See env.kapa.example for details.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!hasMessages ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-900/40">
            <Sparkles className="h-6 w-6 text-accent-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-neutral-900">Ask AI</h1>
          <p className="mt-1.5 max-w-md text-sm text-neutral-500">
            Powered by Cognite&apos;s kapa.ai — answers grounded in Cognite docs and knowledge, with sources.
          </p>
          {configured === null && (
            <p className="mt-4 text-xs text-neutral-400">Connecting…</p>
          )}
          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => void send(prompt.query)}
                disabled={!ready || thinking}
                className="flex flex-col items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-0 px-4 py-4 text-left transition-all hover:border-accent-300 hover:bg-accent-50/60 disabled:opacity-50 dark:hover:bg-accent-900/30"
              >
                <prompt.icon className="h-5 w-5 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-800">{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-6 overflow-y-auto px-1 py-6">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-ink-800" : "bg-accent-600",
                )}
              >
                {m.role === "user" ? <User className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
              </div>
              <div className={cn("max-w-[min(100%,42rem)] space-y-3", m.role === "user" && "flex flex-col items-end")}>
                {m.role === "user" ? (
                  <div className="whitespace-pre-line rounded-lg bg-ink-800 px-4 py-2.5 text-sm leading-relaxed text-white">
                    {m.content}
                  </div>
                ) : (
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-0 px-5 py-4 shadow-[var(--shadow-card)]">
                    <MarkdownBody content={m.content} className="prose-article prose-ai" />
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-5 border-t border-neutral-100 pt-4">
                        <p className="text-xs font-semibold text-neutral-700">Answer based on the following sources:</p>
                        <div className="mt-2.5 space-y-1.5">
                          {m.sources.map((s, i) => (
                            <SourceCard key={`${m.id}-src-${i}-${s.href}`} {...s} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {m.suggestEscalation && (
                  <div className="flex items-center gap-2 rounded-lg border border-accent-100 bg-accent-50 px-4 py-3 dark:border-accent-800 dark:bg-accent-900/30">
                    <LifeBuoy className="h-4 w-4 shrink-0 text-accent-600" />
                    <p className="flex-1 text-xs text-accent-900 dark:text-accent-200">
                      Want a person to take it from here? I&apos;ll carry this conversation over.
                    </p>
                    <Button size="sm" onClick={escalate} className="shrink-0">
                      Create ticket
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="shrink-0 border-t border-neutral-200 py-4">
        {error && <p className="mb-2 text-center text-xs text-danger-500">{error}</p>}
        {hasMessages && (
          <div className="mb-3 flex justify-end">
            <button type="button" onClick={escalate} className="text-xs font-medium text-neutral-500 hover:text-accent-600">
              Not helping? Talk to a person →
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-0 p-1.5 focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Cognite…"
            disabled={!ready || thinking}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!ready || !input.trim() || thinking}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
