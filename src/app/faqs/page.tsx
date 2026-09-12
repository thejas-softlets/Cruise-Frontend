import { getTranslations } from "next-intl/server";

import { FaqAccordion } from "@/components/forms/FaqAccordion";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { getFaqCategories } from "@/lib/api/faqs";
import { SITE } from "@/lib/site";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { media } from "@/lib/api/mock/media";

export default async function FaqsPage() {
  const t = await getTranslations("faqs");
  const tc = await getTranslations("common");
  const tRoot = await getTranslations();
  const [categories, crumbs] = await Promise.all([getFaqCategories(), buildCrumbs(["faqs"])]);

  return (
    <>
      <PageHero
        asset={media("Sunset dinner cruise on Lake Kenyir", "/images/page-heroes/hero-faqs.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-4xl px-5 pb-28 sm:px-8">
        <div className="space-y-14 pt-16">
          {categories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 0.05}>
              <section>
                <h2 className="font-display text-3xl font-medium">
                  {tRoot(`faqs.categories.${cat.id}`)}
                </h2>
                <div className="mt-6">
                  <FaqAccordion items={cat.items} />
                </div>
              </section>
            </FadeIn>
          ))}
        </div>

        <p className="mt-16 rounded-3xl border border-gold/25 bg-gold/8 p-8 text-center leading-relaxed">
          {t("subtitle")}{" "}
          <a
            href={whatsappLink(WHATSAPP_NUMBER, tc("whatsappMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold-bright hover:underline"
          >
            {tc("whatsapp")}
          </a>{" "}
          · {SITE.phone}
        </p>
      </div>
    </>
  );
}
