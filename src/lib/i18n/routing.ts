import { defineRouting } from "next-intl/routing";

import { LOCALE_COOKIE, locales } from "./constants";

/**
 * No prefixed routing (plan §10.4): localePrefix "never" keeps every URL
 * language-neutral, per §7.2 — links shared via WhatsApp must render
 * identically for whoever opens them, regardless of language.
 */
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "never",
  localeCookie: { name: LOCALE_COOKIE },
});
