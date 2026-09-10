import { getTranslations } from "next-intl/server";

import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { getAllExperiences } from "@/lib/api/experiences";
import { media } from "@/lib/api/mock/media";

export default async function ExperiencesHubPage() {
  const t = await getTranslations("experiences");
  const [experiences, crumbs] = await Promise.all([
    getAllExperiences(),
    buildCrumbs(["experiences"]),
  ]);

  const excursions = experiences.filter((e) => e.kind === "excursions");
  const activities = experiences.filter((e) => e.kind === "activities");

  return (
    <>
      <PageHero
        asset={experiences[0]?.images[0] ?? media("Waterfall excursion on Kenyir Lake", "/images/page-heroes/hero-experiences.webp")}
        title={t("hubTitle")}
        line={t("hubLine")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <section aria-labelledby="excursions-heading" className="pt-14">
          <h2 id="excursions-heading" className="font-display text-3xl font-medium">
            {t("tabExcursions")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((exp, i) => (
              <FadeIn key={exp.slug} delay={i * 0.06}>
                <ExperienceCard experience={exp} />
              </FadeIn>
            ))}
          </div>
        </section>

        <section aria-labelledby="activities-heading" className="pt-20">
          <h2 id="activities-heading" className="font-display text-3xl font-medium">
            {t("tabActivities")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((exp, i) => (
              <FadeIn key={exp.slug} delay={i * 0.06}>
                <ExperienceCard experience={exp} />
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
