import { getTranslations } from "next-intl/server";

import { FaqAccordion } from "@/components/forms/FaqAccordion";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { media } from "@/lib/api/mock/media";

export default async function HowItWorksPage() {
  const t = await getTranslations("howItWorks");
  const crumbs = await buildCrumbs(["how-it-works"]);

  const steps = [
    { title: t("steps.browse.title"), body: t("steps.browse.body") },
    { title: t("steps.enquire.title"), body: t("steps.enquire.body") },
    { title: t("steps.quote.title"), body: t("steps.quote.body") },
    { title: t("steps.confirm.title"), body: t("steps.confirm.body") },
    { title: t("steps.board.title"), body: t("steps.board.body") },
  ];

  const quickFaqs = [
    { question: t("faqs.account.q"), answer: t("faqs.account.a") },
    { question: t("faqs.whatsapp.q"), answer: t("faqs.whatsapp.a") },
    { question: t("faqs.language.q"), answer: t("faqs.language.a") },
  ];

  return (
    <>
      <PageHero
        asset={media("Crew welcoming guests at the jetty", "/images/page-heroes/hero-how-it-works.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <ol className="grid gap-4 pt-16 lg:grid-cols-5">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.05}>
              <li className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-6">
                <span
                  aria-hidden
                  className="font-script text-3xl leading-none text-gold-bright"
                >
                  {i + 1}.
                </span>
                <h2 className="font-display mt-3 text-xl font-medium">{step.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.body}</p>
              </li>
            </FadeIn>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <FadeIn>
            <h2 className="font-display text-3xl font-medium">{t("faqTitle")}</h2>
            <div className="mt-6">
              <FaqAccordion items={quickFaqs} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-3xl border border-gold/25 bg-gold/8 p-10 text-center">
              <p className="font-script text-2xl text-gold-bright">{t("title")}</p>
              <h2 className="font-display mt-2 text-3xl font-medium">{t("subtitle")}</h2>
              <div className="mt-8 flex justify-center">
                <Button href="/packages" size="lg">
                  {t("cta")}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
