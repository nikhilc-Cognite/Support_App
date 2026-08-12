"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this reports to Cognite's error monitoring, not the console.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-320px)] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-900/40">
        <AlertOctagon className="h-7 w-7 text-danger-500" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-neutral-900">Something went wrong on our end</h1>
      <p className="mt-2 text-sm text-neutral-500">
        This isn&apos;t your fault — our team has been notified automatically. You can try again, or reach out if it keeps happening.
      </p>
      {error.digest && <p className="mt-2 text-xs text-neutral-400">Reference: {error.digest}</p>}
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={reset}>Try again</Button>
        <Button href="/tickets/new">Contact Support</Button>
      </div>
    </div>
  );
}
