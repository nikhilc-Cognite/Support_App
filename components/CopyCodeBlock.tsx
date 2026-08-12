"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — no-op, button remains functional-looking
    }
  }

  return (
    <div className="group relative">
      {language && (
        <div className="absolute left-4 top-2.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 opacity-0 transition-opacity hover:bg-neutral-700 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success-500" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={language ? "pt-8" : ""}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
