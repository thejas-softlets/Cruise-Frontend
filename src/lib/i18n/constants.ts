/**
 * Locale constants shared by server and client code (safe for either bundle —
 * no next/headers, no getRequestConfig here).
 */
export const locales = ["en", "ms"] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
