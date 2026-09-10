import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { media } from "@/lib/api/mock/media";

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const crumbs = await buildCrumbs(["terms-and-conditions"], {
    "/terms-and-conditions": t("title"),
  });

  return (
    <>
      <PageHero
        asset={media("Houseboat cruising past forested islands", "/images/page-heroes/hero-terms.webp")}
        title={t("title")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-3xl px-5 pb-28 sm:px-8">
        <p className="pt-12 text-sm text-text-muted">{t("updated")}</p>

        <div className="space-y-6 pt-6 leading-relaxed text-text-muted">
          {t.raw("body").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </>
  );
}
