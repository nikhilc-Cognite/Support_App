import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-accent-600 text-white shadow-[0_1px_2px_rgb(97_86_224_/_0.3),0_0_0_1px_rgb(97_86_224_/_0.05)] hover:bg-accent-700 hover:shadow-[0_4px_12px_rgb(97_86_224_/_0.35)] active:bg-accent-800",
  secondary:
    "bg-neutral-0 text-neutral-800 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400",
  ghost: "text-neutral-700 hover:bg-neutral-100",
  danger: "bg-danger-500 text-white hover:bg-danger-700",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  href?: string;
}

type ButtonProps = ButtonOwnProps &
  Omit<ComponentProps<"button">, keyof ButtonOwnProps>;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const { onClick, type: _type, disabled, ...rest } = props;
    return (
      <Link
        href={href}
        className={cn(classes, disabled && "pointer-events-none opacity-50")}
        onClick={onClick as ComponentProps<typeof Link>["onClick"]}
        aria-disabled={disabled || undefined}
        {...(rest as Omit<ComponentProps<typeof Link>, "href" | "className" | "onClick" | "children">)}
      >
        {icon}
        {children}
        {iconRight}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
