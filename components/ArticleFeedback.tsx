"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function ArticleFeedback({ helpfulCount, notHelpfulCount }: { helpfulCount: number; notHelpfulCount: number }) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [showTicketPrompt, setShowTicketPrompt] = useState(false);

  function vote(v: "up" | "down") {
    setVoted(v);
    if (v === "down") setShowTicketPrompt(true);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-sm font-semibold text-neutral-900">Was this article helpful?</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => vote("up")}
          disabled={voted !== null}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-default",
            voted === "up" ? "border-success-500 bg-success-50 text-success-700 dark:bg-success-900/40 dark:text-success-300" : "border-neutral-300 text-neutral-600 hover:bg-neutral-0",
          )}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Yes ({helpfulCount + (voted === "up" ? 1 : 0)})
        </button>
        <button
          onClick={() => vote("down")}
          disabled={voted !== null}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-default",
            voted === "down" ? "border-danger-500 bg-danger-50 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300" : "border-neutral-300 text-neutral-600 hover:bg-neutral-0",
          )}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          No ({notHelpfulCount + (voted === "down" ? 1 : 0)})
        </button>
      </div>

      {voted === "up" && <p className="mt-3 text-sm text-neutral-500">Thanks for letting us know.</p>}

      {showTicketPrompt && (
        <div className="mt-4 rounded-lg border border-accent-100 bg-accent-50 p-3.5 dark:border-accent-800 dark:bg-accent-900/30">
          <p className="text-sm text-accent-900 dark:text-accent-200">Sorry this didn&apos;t help. Want to talk to a person instead?</p>
          <div className="mt-2.5 flex gap-2">
            <Button href="/ask-ai" variant="secondary" size="sm">Try Ask AI</Button>
            <Button href="/tickets/new" size="sm">Create a ticket</Button>
          </div>
        </div>
      )}
    </div>
  );
}
