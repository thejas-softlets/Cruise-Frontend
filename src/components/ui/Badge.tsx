import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "light" | "dark" | "gold";

const variants: Record<Variant, string> = {
  light: "border-ink/20 text-ink/70",
  dark: "border-white/25 text-white/80",
  gold: "border-gold/60 text-gold-bright",
};

/**
 * Editorial meta tag: hairline rectangle, letterspaced small caps — never a
 * filled pill or dot chip.
 */
export function Badge({
  variant = "light",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-secondary inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** §8.3: any field with real-world pricing carries a visible "Indicative" tag. */
export function IndicativeBadge({ label }: { label: string }) {
  return (
    <Badge variant="gold">
      {label}
    </Badge>
  );
}
