"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const id = useId();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm font-medium text-gold-bright">
        {t("success")}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Newsletter delivery is not wired yet; acknowledge locally and honestly.
        setDone(true);
      }}
    >
      <p className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/45">
        {t("title")}
      </p>
      <p className="mt-1.5 text-sm text-text-muted">{t("line")}</p>
      <div className="group relative mt-4">
        <input
          id={`${id}-email`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          className="peer min-h-12 w-full rounded-2xl border border-ink/15 bg-white px-4 pt-4 text-sm text-ink placeholder-transparent transition-colors focus:border-gold-bright focus:outline-none focus:ring-2 focus:ring-gold/25"
        />
        <label
          htmlFor={`${id}-email`}
          className="pointer-events-none absolute left-4 top-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-text-muted transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:text-[0.625rem] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-gold-bright"
        >
          {t("placeholder")}
        </label>
      </div>
      <button
        type="submit"
        className="font-secondary mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-obsidian text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-500 hover:bg-gold-bright"
      >
        {t("submit")}
      </button>
    </form>
  );
}
