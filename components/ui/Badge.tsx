import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  accent: "bg-accent-50 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
  success: "bg-success-50 text-success-700 dark:bg-success-900/50 dark:text-success-300",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300",
  info: "bg-info-50 text-info-700 dark:bg-info-900/50 dark:text-info-300",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
