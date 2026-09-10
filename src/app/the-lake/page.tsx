import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { getLakeInfo } from "@/lib/api/lake";

export default async function TheLakePage() {
  const t = await getTranslations("lake");
  const [lake, crumbs] = await Promise.all([getLakeInfo(), buildCrumbs(["the-lake"])]);

  return (
    <>
      <PageHero
        asset={lake.heroGallery[0]}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <section className="grid gap-10 pt-16 lg:grid-cols-2">
          <FadeIn>
            <h2 className="font-display text-3xl font-medium">{t("overviewTitle")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">{lake.overview}</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="font-display text-3xl font-medium">{t("bestTimeTitle")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">{lake.bestTimeToVisit}</p>
          </FadeIn>
        </section>

        <section className="pt-20">
          <h2 className="font-display text-3xl font-medium">{t("gettingThereTitle")}</h2>
          <ol className="mt-8 space-y-4">
            {[
              { title: t("byRoadTitle"), body: lake.gettingThere.byRoad },
              { title: t("nearestAirportTitle"), body: lake.gettingThere.nearestAirport },
              { title: t("jettyTitle"), body: lake.gettingThere.jettyDetails },
            ].map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.05}>
                <li className="flex gap-5 rounded-3xl border border-ink/8 bg-white p-6">
                  <span
                    aria-hidden
                    className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-obsidian text-lg text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-text-muted">{step.body}</p>
                  </div>
                </li>
              </FadeIn>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 pt-20 sm:grid-cols-3">
          {lake.heroGallery.map((asset, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="group relative overflow-hidden rounded-3xl bg-obsidian shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl">
                <PlaceholderMedia
                  asset={asset}
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </FadeIn>
          ))}
        </section>

        <section className="flex flex-wrap gap-3 pt-16">
          <Button href="/packages" size="lg">
            {t("explorePackages")}
          </Button>
          <Button href="/experiences" variant="ghost" size="lg">
            {t("exploreExperiences")}
          </Button>
        </section>
      </div>
    </>
  );
}
