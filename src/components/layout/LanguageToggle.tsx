"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/constants";

/** §7.2: single-tap toggle, always visible in the header; URL never changes. */
export function LanguageToggle({
  className,
  onDark,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const t = useTranslations("common");

  function switchLocale() {
    const next: Locale = locale === "en" ? "ms" : "en";
    // next-intl sets the cookie and re-renders server components without
    // changing the URL (localePrefix "never", §7.2).
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      aria-label={`${t("languageLabel")}: ${t("switchTo")}`}
      className={cn(
        "font-secondary inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[0.75rem] font-semibold uppercase tracking-wider transition-colors duration-300",
        onDark
          ? "border-white/25 text-white/85 hover:bg-white/10"
          : "border-ink/15 text-ink/60 hover:bg-ink/5 hover:text-ink",
        className,
      )}
    >
      <Languages aria-hidden className="size-3.5" />
      <span suppressHydrationWarning>{locale === "en" ? "BM" : "EN"}</span>
    </button>
  );
}
