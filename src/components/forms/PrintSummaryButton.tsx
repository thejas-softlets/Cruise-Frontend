"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";

/** §7.7: print-optimized one-pager via the browser print dialog (Save as PDF). */
export function PrintSummaryButton() {
  const t = useTranslations("common");

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-gold/50 px-5 py-2.5 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/15 print:hidden"
    >
      <Printer aria-hidden className="size-4" />
      {t("printSummary")}
    </button>
  );
}
