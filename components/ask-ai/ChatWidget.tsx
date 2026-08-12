"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, X, Send, Maximize2, LifeBuoy, User } from "lucide-react";
import { AIMessage } from "@/lib/types";
import { suggestedQuestions, matchResponse } from "@/lib/mock-data/ai";
import { saveHandoff } from "@/lib/ai-handoff";
import { SourceCard } from "@/components/ask-ai/SourceCard";
import { cn } from "@/lib/utils";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `widget-msg-${idCounter}`;
}

/**
 * Persistent floating "Ask AI" launcher, mounted once in the root layout.
 * Because it lives outside the routed `{children}` slot, it never
 * unmounts on navigation — the conversation survives as the customer
 * browses, the same way a real chat widget would.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, open]);

  // The dedicated /ask-ai page already offers this exact experience full-screen —
  // showing the widget there too would just duplicate it.
  if (pathname === "/ask-ai") return null;

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: trimmed }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const response = matchResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: response.content, sources: response.sources, suggestEscalation: response.suggestEscalation },
      ]);
      setThinking(false);
    }, 900);
  }

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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ink-950 py-3 pl-4 pr-5 text-sm font-medium text-white shadow-[var(--shadow-popover)] transition-colors hover:bg-ink-900 sm:bottom-6 sm:right-6"
      >
        <Sparkles className="h-4 w-4 text-accent-400" />
        Ask AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex h-[min(600px,calc(100vh-6rem))] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0 shadow-[var(--shadow-popover)] sm:bottom-6 sm:right-6 sm:w-96">
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
              I search Cognite&apos;s Knowledge Base, Docs, and live system status to answer directly — with sources, not guesses.
            </p>
            <div className="space-y-1.5">
              {suggestedQuestions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-left text-xs text-neutral-700 transition-colors hover:border-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/30"
                >
                  {q}
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
                <div
                  className={cn(
                    "whitespace-pre-line rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                    m.role === "user" ? "bg-ink-800 text-white" : "bg-neutral-100 text-neutral-800",
                  )}
                >
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="w-full space-y-1">
                    {m.sources.slice(0, 2).map((s) => (
                      <SourceCard key={s.href} {...s} />
                    ))}
                  </div>
                )}
                {m.suggestEscalation && (
                  <div className="flex items-center gap-2 rounded-lg border border-accent-100 bg-accent-50 px-3 py-2 dark:border-accent-800 dark:bg-accent-900/30">
                    <LifeBuoy className="h-3.5 w-3.5 shrink-0 text-accent-600" />
                    <p className="flex-1 text-[11px] text-accent-900 dark:text-accent-200">Want a person to take it from here?</p>
                    <button
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
          send(input);
        }}
        className="flex shrink-0 items-center gap-1.5 border-t border-neutral-100 p-2.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
