import { cn } from "@/lib/utils";

/** Cognite wordmark — local asset (transparent bg, dark ink). */
export const COGNITE_LOGO_SRC = "/cognite-logo.png";

type CogniteLogoProps = {
  className?: string;
  /** Image height in Tailwind terms; width stays auto */
  heightClassName?: string;
  alt?: string;
};

export function CogniteLogo({
  className,
  heightClassName = "h-8",
  alt = "Cognite",
}: CogniteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand asset in /public
    <img
      src={COGNITE_LOGO_SRC}
      alt={alt}
      className={cn("w-auto object-contain object-left", heightClassName, className)}
      decoding="async"
    />
  );
}
