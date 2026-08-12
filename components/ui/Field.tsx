import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const fieldBase =
  "w-full rounded-lg border border-neutral-300 bg-neutral-0 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100";

export function Label({
  children,
  htmlFor,
  hint,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {children}
        {required && <span className="ml-0.5 text-danger-500">*</span>}
      </label>
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  const { className, ...rest } = props;
  return <input className={cn(fieldBase, "h-10", className)} {...rest} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  const { className, ...rest } = props;
  return <textarea className={cn(fieldBase, "min-h-28 py-2.5 resize-y", className)} {...rest} />;
}

export function Select(props: ComponentProps<"select">) {
  const { className, children, ...rest } = props;
  return (
    <select className={cn(fieldBase, "h-10 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23707a92%22><path d=%22M5.5 7.5l4.5 5 4.5-5z%22/></svg>')] bg-[length:16px] bg-[right_0.65rem_center] bg-no-repeat pr-9", className)} {...rest}>
      {children}
    </select>
  );
}

export function HelperText({ children, error }: { children: ReactNode; error?: boolean }) {
  return (
    <p className={cn("mt-1.5 text-xs", error ? "text-danger-500" : "text-neutral-400")}>
      {children}
    </p>
  );
}
