"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { openAskAI } from "@/lib/ask-ai-events";
import { cn } from "@/lib/utils";

type AskAITriggerProps = {
  children: ReactNode;
  className?: string;
  /** float = open floating chat; page = go to /ask-ai */
  mode?: "float" | "page";
  query?: string;
  submit?: boolean;
};

/**
 * Opens Ask AI without sharing conversation state with other surfaces
 * unless they intentionally use the same mode (float vs page).
 */
export function AskAITrigger({
  children,
  className,
  mode = "float",
  query,
  submit,
}: AskAITriggerProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    if (mode === "page" || pathname === "/ask-ai") {
      const href = query ? `/ask-ai?q=${encodeURIComponent(query)}` : "/ask-ai";
      router.push(href);
      return;
    }
    openAskAI({ query, submit });
  }

  return (
    <button type="button" onClick={handleClick} className={cn("text-left", className)}>
      {children}
    </button>
  );
}
