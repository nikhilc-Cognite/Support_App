import { cn } from "@/lib/utils";

const palette = [
  "bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
  "bg-success-50 text-success-700 dark:bg-success-900/50 dark:text-success-300",
  "bg-warning-50 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300",
  "bg-neutral-200 text-neutral-700",
];

function hashIndex(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % palette.length;
}

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        palette[hashIndex(initials)],
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
