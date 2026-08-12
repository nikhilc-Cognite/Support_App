"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, LifeBuoy, User } from "lucide-react";
import { AIMessage } from "@/lib/types";
import { suggestedQuestions, matchResponse } from "@/lib/mock-data/ai";
import { SourceCard } from "@/components/ask-ai/SourceCard";
import { Button } from "@/components/ui/Button";
import { saveHandoff } from "@/lib/ai-handoff";
import { cn } from "@/lib/utils";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export function AskAIChat({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const startedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (initialQuery && !startedRef.current) {
      startedRef.current = true;
      send(initialQuery);
    }
  }, [initialQuery]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: AIMessage = { id: nextId(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const response = matchResponse(trimmed);
      const assistantMsg: AIMessage = {
        id: nextId(),
        role: "assistant",
        content: response.content,
        sources: response.sources,
        suggestEscalation: response.suggestEscalation,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setThinking(false);
    }, 900);
  }

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

  return (
    <div className="flex h-full flex-col">
      {!hasMessages ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-900/40">
            <Sparkles className="h-6 w-6 text-accent-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-neutral-900">Ask AI</h1>
          <p className="mt-1.5 max-w-md text-sm text-neutral-500">
            I search Cognite&apos;s Knowledge Base, Docs, and live system status to answer directly — with sources, not guesses.
          </p>
          <div className="mt-6 flex w-full max-w-lg flex-col gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-left text-sm text-neutral-700 transition-colors hover:border-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/30"
              >
                {q}
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
              <div className={cn("max-w-[85%] space-y-3", m.role === "user" && "flex flex-col items-end")}>
                <div
                  className={cn(
                    "whitespace-pre-line rounded-lg px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user" ? "bg-ink-800 text-white" : "bg-neutral-100 text-neutral-800",
                  )}
                >
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="w-full space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Sources</p>
                    {m.sources.map((s) => (
                      <SourceCard key={s.href} {...s} />
                    ))}
                  </div>
                )}
                {m.suggestEscalation && (
                  <div className="flex items-center gap-2 rounded-lg border border-accent-100 bg-accent-50 px-4 py-3 dark:border-accent-800 dark:bg-accent-900/30">
                    <LifeBuoy className="h-4 w-4 shrink-0 text-accent-600" />
                    <p className="flex-1 text-xs text-accent-900 dark:text-accent-200">Want a person to take it from here? I&apos;ll carry this whole conversation over.</p>
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

      <div className="border-t border-neutral-200 pt-4">
        {hasMessages && (
          <div className="mb-3 flex justify-end">
            <button onClick={escalate} className="text-xs font-medium text-neutral-500 hover:text-accent-600">
              Not helping? Talk to a person →
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-0 p-1.5 focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Cognite…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-neutral-400">
          AI answers are grounded in Cognite Knowledge, Docs, and live status — it will say so when it isn&apos;t sure.
        </p>
      </div>
    </div>
  );
}
