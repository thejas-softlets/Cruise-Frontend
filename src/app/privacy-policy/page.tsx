import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { media } from "@/lib/api/mock/media";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacy");
  const crumbs = await buildCrumbs(["privacy-policy"], {
    "/privacy-policy": t("title"),
  });

  return (
    <>
      <PageHero
        asset={media("Quiet lake water at dawn", "/images/page-heroes/hero-privacy.webp")}
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
