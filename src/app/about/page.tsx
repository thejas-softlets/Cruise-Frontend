import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Link } from "@/lib/i18n/navigation";
import { ABOUT_PAGES } from "@/lib/about";
import { media } from "@/lib/api/mock/media";

export default async function AboutHubPage() {
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  const crumbs = await buildCrumbs(["about"]);

  return (
    <>
      <PageHero
        asset={media("Guests dining on the open top deck at golden hour", "/images/page-heroes/hero-about.webp")}
        title={t("hubTitle")}
        line={t("hubLine")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-6 pt-14 md:grid-cols-2">
          {ABOUT_PAGES.map((page, i) => (
            <FadeIn key={page.slug} delay={i * 0.06}>
              <Link
                href={`/about/${page.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/8"
              >
                <h2 className="font-display text-2xl font-medium">
                  {t(`pages.${page.slug}.title` as const)}
                </h2>
                <p className="mt-3 flex-1 text-text-muted">
                  {t(`pages.${page.slug}.intro` as const)}
                </p>
                <span className="font-secondary mt-6 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                  {tc("learnMore")}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
