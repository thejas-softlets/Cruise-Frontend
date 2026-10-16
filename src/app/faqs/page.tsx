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
        <div className="pt-12 pb-6 border-b border-ink/8 text-center sm:text-left">
          <p className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
            Tasik Kenyir · Terengganu · Malaysia
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium text-ink">
            Summer Cruise Kenyir Lake
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Planning a trip to Tasik Kenyir with Summer Cruise? Find answers to the most common questions about our luxury Lake Cruise experience, packages, activities, accommodation, transportation, and travel tips.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Whether you are planning a family holiday, couple getaway, corporate retreat, or nature escape, this FAQ guide helps you prepare for your Kenyir Lake adventure.
          </p>
        </div>

        <div className="space-y-14 pt-12">
          {categories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 0.05}>
              <section id={cat.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
                  {cat.title}
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
