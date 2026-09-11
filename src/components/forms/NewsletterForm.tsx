"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
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

  const isDark = tone === "dark";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Newsletter delivery is not wired yet; acknowledge locally and honestly.
        setDone(true);
      }}
    >
      <p className={`font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-gold" : "text-ink/45"}`}>
        {t("title")}
      </p>
      <p className={`mt-1.5 text-sm ${isDark ? "text-white/70" : "text-text-muted"}`}>{t("line")}</p>
      <div className="group relative mt-4">
        <input
          id={`${id}-email`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          className={`peer min-h-12 w-full rounded-2xl border px-4 pt-4 text-sm placeholder-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
            isDark
              ? "border-white/20 bg-white/10 text-white focus:border-gold-bright focus:bg-white/15"
              : "border-ink/15 bg-white text-ink focus:border-gold-bright"
          }`}
        />
        <label
          htmlFor={`${id}-email`}
          className={`pointer-events-none absolute left-4 top-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:text-[0.625rem] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-gold-bright ${
            isDark ? "text-white/50" : "text-text-muted"
          }`}
        >
          {t("placeholder")}
        </label>
      </div>
      <button
        type="submit"
        className={`font-secondary mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${
          isDark
            ? "bg-gold text-obsidian hover:bg-gold-bright hover:text-white"
            : "bg-obsidian text-white hover:bg-gold-bright"
        }`}
      >
        {t("submit")}
      </button>
    </form>
  );
}
