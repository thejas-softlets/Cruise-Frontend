import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { Link } from "@/lib/i18n/navigation";
import { ROUTE_GROUPS } from "@/lib/routes";
import { media } from "@/lib/api/mock/media";

/** Generated from ROUTE_GROUPS (§14) so it can never drift from the XML sitemap. */
export default async function SitemapPage() {
  const t = await getTranslations("sitemapPage");
  const tc = await getTranslations("common");
  const crumbs = await buildCrumbs(["sitemap"]);

  return (
    <>
      <PageHero
        asset={media("Calm morning water stretching to the rainforest", "/images/page-heroes/hero-sitemap.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-10 pt-16 md:grid-cols-2 lg:grid-cols-3">
          {ROUTE_GROUPS.filter((g) => g.id !== "offers").map((group) => (
            <nav key={group.id} aria-label={t(`groups.${group.id}`)}>
              <h2 className="font-display text-xl font-medium">{t(`groups.${group.id}`)}</h2>
              <ul className="mt-4 space-y-1">
                {group.routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className="inline-flex min-h-11 items-center text-[0.9375rem] text-text-muted transition-colors hover:text-gold-bright"
                    >
                      {route.path === "/"
                        ? tc("home")
                        : route.path.replace(/^\//, "").replace(/\//g, " / ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </>
  );
}
