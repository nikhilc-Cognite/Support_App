import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ProgressSteps({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        return (
          <li key={step} className={cn("flex items-center", i !== steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  state === "done" && "border-accent-600 bg-accent-600 text-white",
                  state === "current" && "border-accent-600 text-accent-600 bg-neutral-0",
                  state === "upcoming" && "border-neutral-300 text-neutral-400 bg-neutral-0",
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-center text-[11px] font-medium sm:block max-w-[88px] leading-tight",
                  state === "upcoming" ? "text-neutral-400" : "text-neutral-700",
                )}
              >
                {step}
              </span>
            </div>
            {i !== steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", i < currentIndex ? "bg-accent-600" : "bg-neutral-200")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
