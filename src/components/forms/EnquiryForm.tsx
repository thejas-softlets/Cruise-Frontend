"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { StepWizard, type WizardStep } from "./StepWizard";
import { Stepper, TextField, TextArea } from "./Field";

export interface EnquiryFormDefaults {
  packageSlug?: string;
  offerSlug?: string;
  vesselId?: string;
  source: string;
  bookingType?: "cruise" | "charter" | "voucher";
  heading?: string;
  line?: string;
  voucherAmount?: number;
}

interface FormValues {
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  adults: number;
  children: number;
  message?: string;
}

export function EnquiryForm(defaults: EnquiryFormDefaults) {
  const t = useTranslations("enquiry");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const [ref, setRef] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { adults: 2, children: 0 } });

  const steps: WizardStep[] = [
    { id: "name", title: t("steps.name") },
    { id: "contact", title: t("steps.contact") },
    { id: "dates", title: t("steps.dates") },
    { id: "review", title: t("steps.review") },
  ];

  const adults = watch("adults") ?? 0;
  const children = watch("children") ?? 0;
  const name = watch("name") ?? "";
  const phone = watch("phone") ?? "";
  const email = watch("email") ?? "";
  const preferredDate = watch("preferredDate") ?? "";
  const message = watch("message") ?? "";

  async function next() {
    const fieldsByStep: (keyof FormValues)[][] = [[], ["name"], ["phone", "email"], []];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  const onSubmit = handleSubmit(async (values) => {
    setFailed(false);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: defaults.source,
          packageSlug: defaults.packageSlug,
          offerSlug: defaults.offerSlug,
          vesselId: defaults.vesselId,
          bookingType: defaults.bookingType,
          preferredLanguage: locale,
          voucherAmount: defaults.voucherAmount,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { ref: string };
      setRef(data.ref);
    } catch {
      setFailed(true);
    }
  });

  // §7.4: persistent, screenshot-friendly confirmation card — never a toast.
  if (ref) {
    return (
      <div
        role="status"         className="rounded-3xl border border-gold/40 bg-white p-8 text-center shadow-xl shadow-ink/8"
      >
        <CheckIcon />
        <h3 className="mt-4 font-display text-2xl">{t("successTitle")}</h3>
        <p className="mt-2 text-lg">{t("successLine")}</p>
        <p className="mt-4 rounded-2xl bg-bg-base p-4 text-base">
          <span className="block text-sm text-text-muted">{t("enquiryRef")}</span>
          <span className="text-xl font-bold tracking-wide">{ref}</span>
        </p>
        <p className="mt-3 text-sm text-text-muted">{t("successHint")}</p>
        <button
          type="button"
          onClick={() => {
            setRef(null);
            setStep(0);
          }}
          className="mt-6 inline-flex min-h-11 items-center rounded-2xl border border-gold/50 px-5 text-sm font-medium text-gold-bright hover:bg-gold/15"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {defaults.heading ? (
        <div className="mb-5">
          <h3 className="font-display text-2xl">{defaults.heading}</h3>
          {defaults.line ? <p className="mt-1 text-text-muted">{defaults.line}</p> : null}
        </div>
      ) : null}

      <StepWizard
        steps={steps}
        current={step}
        onNext={next}
        onSubmit={onSubmit}
        isSubmitting={false}
      >
        {step === 0 && (
          <fieldset className="space-y-4">
            <legend className="sr-only">{t("steps.name")}</legend>
            <TextField
              id="enq-name"
              label={t("name")}
              placeholder={t("namePlaceholder")}
              error={errors.name ? t("nameError") : undefined}
              autoComplete="name"
              {...register("name", { required: true, minLength: 2 })}
            />
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="sr-only">{t("steps.contact")}</legend>
            <TextField
              id="enq-phone"
              type="tel"
              inputMode="tel"
              label={t("phone")}
              placeholder={t("phonePlaceholder")}
              error={errors.phone ? t("phoneError") : undefined}
              autoComplete="tel"
              {...register("phone", { required: true, minLength: 6 })}
            />
            <TextField
              id="enq-email"
              type="email"
              label={t("email")}
              hint={t("emailHint")}
              error={errors.email ? t("emailError") : undefined}
              autoComplete="email"
              {...register("email", {
                // Optional, but if present must look like an email.
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "invalid",
                },
              })}
            />
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="sr-only">{t("steps.dates")}</legend>
            <TextField
              id="enq-date"
              type="date"
              label={t("preferredDate")}
              {...register("preferredDate")}
            />
            <div className="flex flex-wrap gap-6">
              <Stepper
                label={t("adults")}
                value={adults}
                onChange={(v) => setValue("adults", v)}
                min={1}
              />
              <Stepper
                label={t("children")}
                value={children}
                onChange={(v) => setValue("children", v)}
              />
            </div>
            <TextArea
              id="enq-message"
              rows={3}
              label={t("message")}
              placeholder={t("messagePlaceholder")}
              {...register("message")}
            />
          </fieldset>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">{t("reviewNote")}</p>
            <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/12">
              <ReviewRow label={t("name")} value={name} />
              <ReviewRow label={t("phone")} value={phone} />
              {email ? <ReviewRow label={t("email")} value={email} /> : null}
              {preferredDate ? <ReviewRow label={t("preferredDate")} value={preferredDate} /> : null}
              <ReviewRow
                label={t("adults")}
                value={String(adults)}
              />
              <ReviewRow label={t("children")} value={String(children)} />
              {defaults.voucherAmount ? (
                <ReviewRow
                  label={tc("indicative")}
                  value={`RM ${defaults.voucherAmount}`}
                />
              ) : null}
              {message ? <ReviewRow label={t("message")} value={message} /> : null}
            </dl>
          </div>
        )}
      </StepWizard>

      {failed ? (
        <p role="alert" className="mt-3 rounded-3xl bg-[#FBEAEA] p-4 text-sm font-medium text-[#B4232A]">
          {tc("errorGeneric")}
        </p>
        ) : null}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gold/15">
      <svg viewBox="0 0 24 24" className="size-7 text-gold-bright" aria-hidden fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
