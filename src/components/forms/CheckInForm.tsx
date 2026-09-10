"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { StepWizard, type WizardStep } from "./StepWizard";
import { TextField } from "./Field";

interface FormValues {
  bookingCode: string;
  lastName: string;
}

type Outcome = { kind: "stub"; message: string } | { kind: "error"; message: string } | null;

export function CheckInForm() {
  const t = useTranslations("checkIn");
  const tf = useTranslations("checkInForm");
  const tc = useTranslations("common");

  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const steps: WizardStep[] = [
    { id: "code", title: tf("steps.code") },
    { id: "review", title: tf("steps.review") },
  ];

  const bookingCode = watch("bookingCode") ?? "";
  const lastName = watch("lastName") ?? "";

  async function next() {
    const valid = await trigger(["bookingCode", "lastName"]);
    if (valid) setStep(1);
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      await res.json();
      // §9.8: the stub always answers honestly — never a fake success state.
      setOutcome({ kind: "stub", message: t("stubResponse") });
    } catch {
      setOutcome({ kind: "error", message: tc("errorGeneric") });
    }
  });

  return (
    <div className="mx-auto max-w-xl">
      <StepWizard steps={steps} current={step} onNext={next} onSubmit={onSubmit}>
        {step === 0 && (
          <fieldset className="space-y-4">
            <legend className="sr-only">{tf("steps.code")}</legend>
            <TextField
              id="ci-code"
              label={t("bookingCode")}
              hint={t("bookingCodeHint")}
              error={errors.bookingCode ? tc("required") : undefined}
              autoComplete="off"
              {...register("bookingCode", { required: true })}
            />
            <TextField
              id="ci-last"
              label={t("lastName")}
              hint={t("lastNameHint")}
              error={errors.lastName ? tc("required") : undefined}
              autoComplete="family-name"
              {...register("lastName", { required: true })}
            />
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">{tf("reviewNote")}</p>
            <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/12">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-text-muted">{t("bookingCode")}</dt>
                <dd className="text-sm font-semibold uppercase">{bookingCode}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-text-muted">{t("lastName")}</dt>
                <dd className="text-sm font-medium">{lastName}</dd>
              </div>
            </dl>
          </div>
        )}
      </StepWizard>

      {outcome?.kind === "stub" ? (
        <div
          role="status"           className="mt-5 rounded-3xl border border-gold/40 bg-white p-6 text-center shadow-xl shadow-ink/8"
        >
          <h3 className="font-display text-xl">{outcome.message}</h3>
          <p className="mt-2 text-text-muted">{t("subtitle")}</p>
        </div>
      ) : null}
      {outcome?.kind === "error" ? (
        <p role="alert" className="mt-5 rounded-3xl bg-[#FBEAEA] p-4 text-sm font-medium text-[#B4232A]">
          {outcome.message}
        </p>
      ) : null}
    </div>
  );
}
