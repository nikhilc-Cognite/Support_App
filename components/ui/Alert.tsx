import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger";

const config: Record<Tone, { icon: typeof Info; classes: string; iconColor: string }> = {
  info: { icon: Info, classes: "bg-accent-50 border-accent-100 text-accent-900 dark:bg-accent-900/30 dark:border-accent-800 dark:text-accent-200", iconColor: "text-accent-600" },
  success: { icon: CheckCircle2, classes: "bg-success-50 border-success-50 text-success-700 dark:bg-success-900/30 dark:border-success-900 dark:text-success-300", iconColor: "text-success-500" },
  warning: { icon: AlertTriangle, classes: "bg-warning-50 border-warning-50 text-warning-700 dark:bg-warning-900/30 dark:border-warning-900 dark:text-warning-300", iconColor: "text-warning-500" },
  danger: { icon: XCircle, classes: "bg-danger-50 border-danger-50 text-danger-700 dark:bg-danger-900/30 dark:border-danger-900 dark:text-danger-300", iconColor: "text-danger-500" },
};

export function Alert({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { icon: Icon, classes, iconColor } = config[tone];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", classes, className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="mt-0.5 text-sm leading-relaxed opacity-90">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
