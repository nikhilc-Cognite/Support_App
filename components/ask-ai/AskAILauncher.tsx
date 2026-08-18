"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, X, Send, Maximize2, LifeBuoy, User } from "lucide-react";
import { AIMessage } from "@/lib/types";
import { suggestedPrompts } from "@/lib/mock-data/ai";
import { askAI } from "@/lib/kapa";
import { ASK_AI_OPEN_EVENT, type AskAIOpenDetail } from "@/lib/ask-ai-events";
import { saveHandoff } from "@/lib/ai-handoff";
import { SourceCard } from "@/components/ask-ai/SourceCard";
import { MarkdownBody } from "@/components/MarkdownBody";
import { cn } from "@/lib/utils";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `widget-msg-${idCounter}`;
}

/**
 * Floating Ask AI chat — independent conversation from the /ask-ai page.
 * Listens for cognite:ask-ai-open so home / search can open it.
 */
export function AskAILauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const onAskAiPage = pathname === "/ask-ai";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef(false);
  const threadIdRef = useRef<string | null>(null);
  const onAskAiPageRef = useRef(onAskAiPage);
  const sendRef = useRef<(text: string) => Promise<void>>(async () => {});

  useEffect(() => {
    thinkingRef.current = thinking;
  }, [thinking]);
  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);
  useEffect(() => {
    onAskAiPageRef.current = onAskAiPage;
  }, [onAskAiPage]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinkingRef.current) return;
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
      const message = err instanceof Error ? err.message : "Ask AI failed";
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

  sendRef.current = send;

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<AskAIOpenDetail>).detail ?? {};
      if (onAskAiPageRef.current) {
        if (detail.query) {
          router.push(`/ask-ai?q=${encodeURIComponent(detail.query)}`);
        }
        return;
      }
      setOpen(true);
      if (detail.query) {
        if (detail.submit !== false) {
          void sendRef.current(detail.query);
        } else {
          setInput(detail.query);
        }
      }
    }
    window.addEventListener(ASK_AI_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASK_AI_OPEN_EVENT, onOpen);
  }, [router]);

  function escalate() {
    const firstUser = messages.find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    saveHandoff({
      transcript: messages,
      suggestedSubject: firstUser?.content.slice(0, 80) ?? "Issue reported via Ask AI",
      suggestedDescription: `${firstUser?.content ?? ""}\n\n— Ask AI attempted the following: ${lastAssistant?.content ?? ""}`.slice(0, 1200),
    });
    setOpen(false);
    router.push("/tickets/new?fromAI=1");
  }

  if (onAskAiPage) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full bg-ink-950 py-3 pl-4 pr-5 text-sm font-medium text-white shadow-[var(--shadow-popover)] transition-colors hover:bg-ink-900 sm:bottom-6 sm:right-6"
      >
        <Sparkles className="h-4 w-4 text-accent-400" />
        Ask AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex h-[min(600px,calc(100vh-6rem))] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-0 shadow-[var(--shadow-popover)] sm:bottom-6 sm:right-6 sm:w-96">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 bg-ink-950 px-4 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4 text-accent-400" />
          Ask AI
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/ask-ai"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Open full Ask AI page"
            title="Open full page"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">
              Ask Cognite&apos;s kapa.ai assistant — answers with citations from your knowledge sources.
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => void send(prompt.query)}
                  className="flex flex-col items-start gap-2 rounded-lg border border-neutral-200 px-2.5 py-2.5 text-left transition-colors hover:border-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/30"
                >
                  <prompt.icon className="h-3.5 w-3.5 text-neutral-500" />
                  <span className="text-[11px] font-medium leading-snug text-neutral-700">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-ink-800" : "bg-accent-600",
                )}
              >
                {m.role === "user" ? <User className="h-3 w-3 text-white" /> : <Sparkles className="h-3 w-3 text-white" />}
              </div>
              <div className={cn("max-w-[82%] space-y-2", m.role === "user" && "flex flex-col items-end")}>
                {m.role === "user" ? (
                  <div className="whitespace-pre-line rounded-lg bg-ink-800 px-3 py-2 text-[13px] leading-relaxed text-white">
                    {m.content}
                  </div>
                ) : (
                  <div className="rounded-lg bg-neutral-100 px-3 py-2 text-[13px] text-neutral-800">
                    <MarkdownBody content={m.content} className="prose-article prose-ai" />
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 space-y-1 border-t border-neutral-200/80 pt-2">
                        <p className="text-[10px] font-semibold text-neutral-600">Sources</p>
                        {m.sources.slice(0, 2).map((s, i) => (
                          <SourceCard key={`${m.id}-src-${i}-${s.href}`} {...s} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {m.suggestEscalation && (
                  <div className="flex items-center gap-2 rounded-lg border border-accent-100 bg-accent-50 px-3 py-2 dark:border-accent-800 dark:bg-accent-900/30">
                    <LifeBuoy className="h-3.5 w-3.5 shrink-0 text-accent-600" />
                    <p className="flex-1 text-[11px] text-accent-900 dark:text-accent-200">Want a person to take it from here?</p>
                    <button
                      type="button"
                      onClick={escalate}
                      className="shrink-0 rounded-md bg-accent-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-accent-700"
                    >
                      Create ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {thinking && (
          <div className="flex gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex shrink-0 items-center gap-1.5 border-t border-neutral-100 p-2.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={thinking}
          className="flex-1 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
