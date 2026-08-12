import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { overallStatus, activeIncidents } from "@/lib/mock-data/status";
import { cn } from "@/lib/utils";

export function StatusSummaryCard() {
  const status = overallStatus();
  const active = activeIncidents();
  const isOperational = status === "operational" && active.length === 0;

  return (
    <Link
      href="/status"
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors",
        isOperational
          ? "border-success-50 bg-success-50 hover:bg-success-50/70 dark:border-success-900 dark:bg-success-900/30 dark:hover:bg-success-900/45"
          : "border-warning-50 bg-warning-50 hover:bg-warning-50/70 dark:border-warning-900 dark:bg-warning-900/30 dark:hover:bg-warning-900/45",
      )}
    >
      <div className="flex items-center gap-3">
        {isOperational ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" />
        )}
        <div>
          <p className={cn("text-sm font-semibold", isOperational ? "text-success-700 dark:text-success-300" : "text-warning-700 dark:text-warning-300")}>
            {isOperational ? "All Systems Operational" : `${active.length} active incident${active.length > 1 ? "s" : ""}`}
          </p>
          {!isOperational && (
            <p className="mt-0.5 text-xs text-neutral-600">{active[0].title}</p>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
    </Link>
  );
}
