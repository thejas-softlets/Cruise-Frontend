import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";

export interface Crumb {
  href: string;
  label: string;
}

/**
 * Builds translated breadcrumbs for any route path, e.g.
 * "/packages/3d2n-kenyir-explorer" → Home / Packages / 3D2N Kenyir Explorer.
 * Falls back to the raw segment for dynamic slugs; callers can pass overrides.
 */
export async function buildCrumbs(
  segments: string[],
  overrides: Record<string, string> = {},
): Promise<Crumb[]> {
  const t = await getTranslations();

  const staticLabels: Record<string, string> = {
    vessels: t("nav.vessels"),
    packages: t("nav.packages"),
    offers: t("nav.offers"),
    experiences: t("nav.experiences"),
    excursions: t("experiences.tabExcursions"),
    activities: t("experiences.tabActivities"),
    about: t("nav.about"),
    journal: t("nav.journal"),
    "the-lake": t("nav.theLake"),
    "how-it-works": t("nav.howItWorks"),
  };

  const crumbs: Crumb[] = [{ href: "/", label: t("common.home") }];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({
      href: acc,
      label: overrides[acc] ?? staticLabels[seg] ?? decodeURIComponent(seg).replace(/-/g, " "),
    });
  }
  return crumbs;
}

export function Breadcrumbs({ crumbs, light }: { crumbs: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="print:hidden">
      <ol
        className={`font-secondary flex flex-wrap items-center gap-1.5 text-[0.8125rem] tracking-wide ${
          light ? "text-white/60" : "text-text-muted"
        }`}
      >
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight aria-hidden className={`size-3.5 ${light ? "text-white/40" : "text-text-muted/60"}`} />
            )}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className={light ? "text-white" : "text-ink"}>
                {c.label}
              </span>
            ) : (
              <Link
                href={c.href}
                className={`inline-flex min-h-11 items-center py-2.5 transition-colors ${
                  light ? "hover:text-white" : "hover:text-gold-bright"
                }`}
              >
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
