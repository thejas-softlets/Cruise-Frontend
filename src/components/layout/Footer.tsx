import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Link } from "@/lib/i18n/navigation";
import { ROUTE_GROUPS } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";

/** Light footer on cream — soft borders, gold hover accents. */
export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  // Offers disabled for launch — no footer/nav entry.
  const exploreGroups = ROUTE_GROUPS.filter((g) =>
    ["vessels", "packages", "experiences", "about", "journal"].includes(g.id),
  );
  const helpGroup = ROUTE_GROUPS.find((g) => g.id === "help");
  const legalGroup = ROUTE_GROUPS.find((g) => g.id === "legal");

  return (
    <footer className="border-t border-white/10 bg-obsidian text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {/* §7.6: first-time visitors get pointed at the plain-language guide. */}
        <Link
          href="/how-it-works"
          className="mb-12 inline-flex min-h-11 items-center rounded-full border border-gold/50 px-5 py-2 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/15"
        >
          {t("footer.firstTime")}
        </Link>

        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr_1.2fr]">
          <div>
            <Link
              href="/"
              aria-label={SITE.name}
              className="inline-block transition-opacity duration-300 hover:opacity-85"
            >
              <Image
                src="/images/logo/summer-cruise-logo-white.webp"
                alt={SITE.name}
                width={200}
                height={52}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {t("footer.tagline")}
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 text-white/80 transition-colors hover:text-gold"
                >
                  <Phone aria-hidden className="size-4 text-gold" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, t("common.whatsappMessage"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-white/80 transition-colors hover:text-gold"
                >
                  <MessageCircle aria-hidden className="size-4 text-[#25D366]" /> {t("common.whatsapp")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-11 items-center gap-2 text-white/80 transition-colors hover:text-gold"
                >
                  <Mail aria-hidden className="size-4 text-gold" /> {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-sm text-white/60">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-gold" /> {SITE.address}
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
                {t("footer.explore")}
              </p>
              <ul className="mt-4 space-y-2">
                {exploreGroups.flatMap((g) => g.routes.slice(0, 1)).map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {t(`nav.${navKeyForPath(r.path)}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
                {t("footer.help")}
              </p>
              <ul className="mt-4 space-y-2">
                {helpGroup?.routes.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {labelForPath(r.path, t)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
                {t("footer.legal")}
              </p>
              <ul className="mt-4 space-y-2">
                {legalGroup?.routes.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {t(r.path === "/privacy-policy" ? "privacy.title" : "terms.title")}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/brochure"
                    className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t("brochure.title")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gift-vouchers"
                    className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t("giftVouchers.title")}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div>
            <NewsletterForm tone="dark" />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex gap-6 text-xs">
            <Link href="/sitemap" className="transition-colors hover:text-white">
              Sitemap
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function navKeyForPath(path: string): string {
  switch (path) {
    case "/vessels":
      return "vessels";
    case "/packages":
      return "packages";
    case "/offers":
      return "offers";
    case "/experiences":
      return "experiences";
    case "/about":
      return "about";
    case "/journal":
      return "journal";
    default:
      return "theLake";
  }
}

/** Human labels for help-group routes (path alone is never shown). */
function labelForPath(path: string, t: (key: string) => string): string {
  switch (path) {
    case "/contact":
      return t("contact.title");
    case "/check-in":
      return t("checkIn.title");
    case "/faqs":
      return t("faqs.title");
    case "/gift-vouchers":
      return t("giftVouchers.title");
    case "/sitemap":
      return t("sitemapPage.title");
    default:
      return path;
  }
}
