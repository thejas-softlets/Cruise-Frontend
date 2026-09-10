import type { ReactNode } from "react";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "ghost" | "whatsapp" | "ghostLight";
type Size = "md" | "lg";

const base =
  "font-secondary inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-all duration-500 ease-out select-none";

const variants: Record<Variant, string> = {
  primary: "bg-obsidian text-white hover:bg-gold-bright",
  gold: "bg-gold text-white hover:bg-gold-bright",
  ghost:
    "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
  ghostLight:
    "border border-white/35 bg-transparent text-white hover:border-gold hover:text-gold",
  whatsapp: "bg-[#128C7E] text-white hover:bg-[#0F7568]",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "min-h-14 px-9",
};

interface ButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** External links (wa.me, tel:, mailto:, PDFs) render a plain <a>. */
  external?: boolean;
  ariaLabel?: string;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external = false,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
