import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";

import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { FadeIn } from "@/components/motion";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { PackageCard } from "@/components/cards/PackageCard";
import { PrintSummaryButton } from "@/components/forms/PrintSummaryButton";
import { StickySubNav } from "@/components/layout/StickySubNav";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { getAllPackages, getPackageBySlug } from "@/lib/api/packages";
import { getRoomsByIds } from "@/lib/api/rooms";
import { getExperiencesBySlugs } from "@/lib/api/experiences";
import { getReviewsByPackage } from "@/lib/api/reviews";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const packages = await getAllPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const t = await getTranslations("packages");
  const tc = await getTranslations("common");

  const [rooms, experiences, reviews] = await Promise.all([
    getRoomsByIds(pkg.roomCategoryIds),
    getExperiencesBySlugs(pkg.experienceSlugs),
    getReviewsByPackage(pkg.slug),
  ]);

  const crumbs = await buildCrumbs(["packages", slug], { [`/packages/${slug}`]: pkg.title });

  const subnav = [
    { id: "overview", label: t("overview") },
    { id: "itinerary", label: t("itinerary") },
    { id: "rooms", label: t("rooms") },
    { id: "included", label: t("inclusions") },
    { id: "experiences", label: t("experiences") },
    { id: "enquire", label: tc("enquire") },
  ];

  return (
    <div>
      <PageHero
        asset={pkg.heroImage}
        title={pkg.title}
        line={`${tc("from")} ${formatPrice(pkg.fromPriceMYR)} ${tc("perPax")} · ${pkg.durationLabel}`}
        crumbs={crumbs}
        size="lg"
      />

      <StickySubNav items={subnav} />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        {/* Overview */}
        <section id="overview" className="scroll-mt-28 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-medium">{t("overview")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">{pkg.overview}</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-gold-bright" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="h-fit rounded-3xl border border-ink/8 bg-white p-7">
              <p className="text-sm leading-relaxed text-text-muted">{t("relatedNote")}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="#enquire" size="lg">
                  {tc("enquireNow")}
                </Button>
                <PrintSummaryButton />
              </div>
            </aside>
          </div>
        </section>

        {/* Itinerary */}
        <section id="itinerary" className="scroll-mt-28 pt-20">
          <h2 className="font-display text-3xl font-medium">{t("itinerary")}</h2>
          <ol className="mt-8 space-y-4">
            {pkg.itinerary.map((day, i) => (
              <FadeIn key={day.day} delay={i * 0.05}>
                <li className="rounded-3xl border border-ink/8 bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-medium">
                      {t("day", { n: day.day })}: {day.title}
                    </h3>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
                      {day.meals.join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 leading-relaxed text-text-muted">{day.description}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </section>

        {/* Rooms */}
        <section id="rooms" className="scroll-mt-28 pt-20">
          <h2 className="font-display text-3xl font-medium">{t("rooms")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rooms.map((room, i) => (
              <FadeIn key={room.id} delay={i * 0.06}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white">
                  <PlaceholderMedia
                    asset={room.image}
                    className="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-medium">{room.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm text-text-muted">{room.description}</p>
                    <p className="mt-3 text-sm text-text-muted">
                      {t("occupancy", { count: room.occupancy })} ·{" "}
                      {tc("indicative")} {formatPrice(room.indicativePriceMYR)}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Included / not included */}
        <section id="included" className="scroll-mt-28 pt-20">
          <h2 className="font-display text-3xl font-medium">{t("inclusions")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-ink/8 bg-white p-6">
              <ul className="space-y-2.5">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-gold-bright" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-ink/8 bg-white p-6">
              <h3 className="font-display text-lg font-medium">{t("exclusions")}</h3>
              <ul className="mt-3 space-y-2.5">
                {pkg.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-text-muted">
                    <X aria-hidden className="mt-1 size-4 shrink-0 text-text-muted/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Experiences */}
        <section id="experiences" className="scroll-mt-28 pt-20">
          <h2 className="font-display text-3xl font-medium">{t("experiences")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <FadeIn key={exp.slug} delay={i * 0.06}>
                <ExperienceCard experience={exp} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <section className="pt-20">
            <h2 className="font-display text-3xl font-medium">{t("reviews")}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.map((review, i) => (
                <FadeIn key={review.id} delay={i * 0.06}>
                  <ReviewCard review={review} />
                </FadeIn>
              ))}
            </div>
          </section>
        ) : null}

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-28 pt-20">
          <div className="mx-auto max-w-2xl">
            <EnquiryForm
              source="package-detail"
              packageSlug={pkg.slug}
              vesselId={pkg.vesselId}
              bookingType="cruise"
              heading={t("enquireTitle")}
              line={t("enquireLine")}
            />
          </div>
        </section>

        {/* Other packages */}
        <section className="pt-24">
          <h2 className="font-display text-3xl font-medium">{tc("viewAll")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {(await getAllPackages())
              .filter((p) => p.slug !== pkg.slug)
              .map((other) => (
                <PackageCard key={other.slug} pkg={other} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
