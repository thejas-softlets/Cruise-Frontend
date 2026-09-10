"use client";

import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const controlClass =
  "min-h-12 w-full rounded-2xl border border-ink/20 bg-white px-4 text-base text-ink placeholder:text-text-muted/60 transition-colors duration-300 focus:border-gold-bright focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:bg-bg-base";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  children?: ReactNode;
}

/** Shared visible label + plain-language error line (§7.4). */
function LabelWrap({
  label,
  error,
  hint,
  htmlFor,
  children,
}: BaseProps & { htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-text-primary">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-sm text-text-muted">{hint}</p> : null}
      {/* aria-live so stepwizard users hear errors the moment they appear. */}
      <p
        aria-live="polite"
        className={cn(
          "mt-1.5 text-sm font-medium text-[#B4232A]",
          !error && "sr-only",
        )}
      >
        {error ?? "\u00A0"}
      </p>
    </div>
  );
}

interface TextFieldProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {}

export function TextField({ label, error, hint, ...input }: TextFieldProps) {
  return (
    <LabelWrap label={label} error={error} hint={hint} htmlFor={input.id ?? input.name ?? ""}>
      <input
        {...input}
        aria-invalid={!!error}
        className={cn(controlClass, error && "border-[#B4232A]")}
      />
    </LabelWrap>
  );
}

interface TextAreaProps
  extends BaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {}

export function TextArea({ label, error, hint, ...area }: TextAreaProps) {
  return (
    <LabelWrap label={label} error={error} hint={hint} htmlFor={area.id ?? area.name ?? ""}>
      <textarea
        {...area}
        aria-invalid={!!error}
        className={cn(controlClass, "min-h-24 py-3", error && "border-[#B4232A]")}
      />
    </LabelWrap>
  );
}

interface SelectFieldProps
  extends BaseProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options: { value: string; label: string }[];
}

export function SelectField({ label, error, hint, options, ...select }: SelectFieldProps) {
  return (
    <LabelWrap label={label} error={error} hint={hint} htmlFor={select.id ?? select.name ?? ""}>
      <div className="relative">
        <select
          {...select}
          aria-invalid={!!error}
          className={cn(controlClass, "appearance-none pr-10", error && "border-[#B4232A]")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        />
      </div>
    </LabelWrap>
  );
}

/** Stepper for guest counts — big +/- tap targets (§7.5). */
export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  plusLabel = "+",
  minusLabel = "−",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  plusLabel?: string;
  minusLabel?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-text-primary">{label}</span>
      <div className="inline-flex items-center gap-3 rounded-2xl border border-ink/20 bg-white p-1.5">
        <button
          type="button"
          aria-label={`${label}: ${minusLabel}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="inline-flex size-11 items-center justify-center rounded-full text-xl font-semibold text-ink transition-colors hover:bg-gold/15 disabled:opacity-40"
        >
          −
        </button>
        <span aria-live="polite" className="w-10 text-center text-lg font-semibold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`${label}: ${plusLabel}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="inline-flex size-11 items-center justify-center rounded-full text-xl font-semibold text-ink transition-colors hover:bg-gold/15 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
