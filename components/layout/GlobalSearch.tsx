"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, CornerDownLeft } from "lucide-react";
import { search, SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";

export function GlobalSearch({ variant = "nav" }: { variant?: "nav" | "hero" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => (query.length > 1 ? search(query).slice(0, 7) : []), [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function goToSearch() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  /** Enter / Ask AI row → full-page Ask AI (same as header), with the query submitted */
  function goToAskAI() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    router.push(`/ask-ai?q=${encodeURIComponent(q)}`);
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative w-full", isHero ? "max-w-2xl" : "max-w-md")}>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border bg-neutral-0 transition-shadow",
          isHero ? "h-14 border-neutral-200 px-4 shadow-[var(--shadow-elevated)]" : "h-10 border-neutral-200 px-3",
          open && "ring-2 ring-accent-100 border-accent-400",
        )}
      >
        <Search className={cn("shrink-0 text-neutral-400", isHero ? "h-5 w-5" : "h-4 w-4")} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goToAskAI();
            }
          }}
          placeholder={isHero ? "Search or ask a question — “why is my export failing?”" : "Search or ask a question…"}
          className={cn("w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none", isHero ? "text-base" : "text-sm")}
        />
        {!isHero && (
          <kbd className="hidden shrink-0 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 sm:block">
            ⌘K
          </kbd>
        )}
      </div>

      {open && query.length > 1 && (
        <div className="absolute inset-x-0 z-50 mt-2 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0 shadow-[var(--shadow-popover)]">
          <button
            type="button"
            onClick={goToAskAI}
            className="flex w-full items-center gap-2.5 border-b border-neutral-100 px-4 py-3 text-left hover:bg-accent-50 dark:hover:bg-accent-900/30"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-accent-600" />
            <span className="text-sm text-neutral-800">
              Ask AI: <span className="font-medium text-accent-700 dark:text-accent-300">&ldquo;{query}&rdquo;</span>
            </span>
            <CornerDownLeft className="ml-auto h-3.5 w-3.5 shrink-0 text-neutral-400" />
          </button>

          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-neutral-500">
              No matches yet — press Enter to Ask AI, or browse results below.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto py-1">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <p className="px-4 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    {group}
                  </p>
                  {items.map((r) => (
                    <a
                      key={r.id}
                      href={r.href}
                      className="flex flex-col gap-0.5 px-4 py-2 hover:bg-neutral-50"
                    >
                      <span className="truncate text-sm font-medium text-neutral-900">{r.title}</span>
                      <span className="truncate text-xs text-neutral-500">{r.snippet}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={goToSearch}
            className="flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2.5 text-left text-xs font-medium text-neutral-500 hover:bg-neutral-50"
          >
            View all search results for &ldquo;{query}&rdquo;
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

