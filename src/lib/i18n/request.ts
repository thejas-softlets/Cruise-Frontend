import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { isLocale, LOCALE_COOKIE } from "./constants";

/**
 * Server-only locale resolution (plan §7.2/§10.4): no `/en/` or `/ms/` URL
 * prefix — a shared link renders identically for whoever opens it.
 * Server component only — never import from client code; use ./constants.
 */
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
