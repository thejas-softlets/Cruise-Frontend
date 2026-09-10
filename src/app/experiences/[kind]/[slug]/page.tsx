import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PackageCard } from "@/components/cards/PackageCard";
import { getAllExperiences, getExperienceBySlug } from "@/lib/api/experiences";
import { getAllPackages } from "@/lib/api/packages";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { ExperienceKind } from "@/types";

export async function generateStaticParams() {
  const experiences = await getAllExperiences();
  return experiences.map((e) => ({ kind: e.kind, slug: e.slug }));
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind, slug } = await params;
  if (kind !== "excursions" && kind !== "activities") notFound();

  const experience = await getExperienceBySlug(slug, kind as ExperienceKind);
  if (!experience) notFound();

  const t = await getTranslations("experiences");
  const includedIn = (await getAllPackages()).filter((p) =>
    experience.includedInPackageSlugs.includes(p.slug),
  );

  const crumbs = await buildCrumbs(["experiences", kind, slug], {
    [`/experiences/${kind}/${slug}`]: experience.title,
  });

  return (
    <div>
      <PageHero
        asset={experience.images[0]}
        title={experience.title}
        line={experience.tags.join(" · ")}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="max-w-2xl space-y-4 pt-14 text-lg leading-relaxed text-text-muted">
          {experience.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {experience.images.length > 1 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {experience.images.slice(1).map((asset, i) => (
              <FadeIn key={i}>
                <div className="group relative overflow-hidden rounded-3xl bg-obsidian shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl">
                  <PlaceholderMedia
                    asset={asset}
                    className="aspect-[16/10]"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        ) : null}

        <section className="pt-20">
          <h2 className="font-display text-3xl font-medium">{t("includedIn")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {includedIn.map((pkg, i) => (
              <FadeIn key={pkg.slug} delay={i * 0.06}>
                <PackageCard pkg={pkg} />
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="pt-14">
          <p className="text-sm text-text-muted">
            {t("backToHub")} →{" "}
            <Link href="/experiences" className="font-semibold text-gold-bright hover:underline">
              {t("backToHub")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
