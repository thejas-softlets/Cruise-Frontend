"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  title: string;
}

interface Props {
  steps: WizardStep[];
  current: number;
  children: ReactNode;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  nextLabel?: string;
  /** Set by the parent after per-step validation. */
  canProceed?: boolean;
}

/**
 * §7.3: guided, one-step-at-a-time flow with a large single "Next", a visible
 * progress-dots indicator, and a "Back" that never loses entered data (state
 * lives in the parent form). A single sequential column is used at every
 * viewport — the spec permits (not mandates) denser desktop screens, and one
 * column tested best for the non-technical target user.
 */
export function StepWizard({
  steps,
  current,
  children,
  onNext,
  onSubmit,
  isSubmitting = false,
  nextLabel,
  canProceed = true,
}: Props) {
  const t = useTranslations("common");
  const isLast = current === steps.length - 1;

  return (
    <div className="rounded-2xl border border-ink/12 bg-white p-6 shadow-sm sm:p-8">
      {/* Progress dots + step titles */}
      <ol className="mb-7 flex items-center" aria-label="Progress">
        {steps.map((step, i) => (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300",
                  i < current && "border-gold bg-gold text-white",
                  i === current && "border-gold-bright bg-gold-bright text-white",
                  i > current && "border-ink/20 bg-white text-text-muted",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-xs font-medium sm:block",
                  i === current ? "text-text-primary" : "text-text-muted",
                )}
              >
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-2 mb-0 h-px flex-1 sm:mb-5",
                  i < current ? "bg-gold" : "bg-ink/15",
                )}
              />
            )}
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {steps[current]?.title}
      </p>

      <div className="mb-7">{children}</div>

      {/* §7.5: large labeled buttons — no icon-only actions in any flow. */}
      <div className="flex items-center justify-between gap-3">
        {current > 0 ? (
          <button
            type="button"
            onClick={onNext}
            data-direction="back"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl px-5 text-[0.9375rem] font-medium text-text-muted transition-colors hover:bg-black/5 hover:text-text-primary"
          >
            <ChevronLeft aria-hidden className="size-4" />
            {t("back")}
          </button>
        ) : (
          <span aria-hidden />
        )}

        <button
          type="button"
          onClick={isLast ? onSubmit : onNext}
          disabled={isSubmitting || !canProceed}
          className="font-secondary inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-obsidian px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t("sending") : isLast ? (nextLabel ?? t("submit")) : t("next")}
        </button>
      </div>
    </div>
  );
}
