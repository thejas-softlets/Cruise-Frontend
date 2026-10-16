import { Check, X, Clock } from "lucide-react";
import { notFound } from "next/navigation";

import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { Link } from "@/lib/i18n/navigation";
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
import { DynamicCruiseMap } from "@/components/booking/DynamicCruiseMap";
import { SummerCruiseDeckPlan } from "@/components/vessels/SummerCruiseDeckPlan";
import { getAllPackages, getPackageBySlug } from "@/lib/api/packages";
import { getRoomsByIds } from "@/lib/api/rooms";
import { getExperiencesBySlugs } from "@/lib/api/experiences";
import { getReviewsByPackage } from "@/lib/api/reviews";
import { getWaypointsForPackage } from "@/lib/api/booking";
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

  const [rooms, experiences, reviews, waypoints] = await Promise.all([
    getRoomsByIds(pkg.roomCategoryIds),
    getExperiencesBySlugs(pkg.experienceSlugs),
    getReviewsByPackage(pkg.slug),
    getWaypointsForPackage(pkg.slug),
  ]);

  const crumbs = await buildCrumbs(["packages", slug], { [`/packages/${slug}`]: pkg.title });

  const subnav = [
    { id: "overview", label: t("overview") },
    { id: "route-map", label: "Navigation Chart" },
    { id: "itinerary", label: t("itinerary") },
    { id: "rooms", label: t("rooms") },
    { id: "deck-plan", label: "Deck Plan" },
    { id: "book-cabins", label: "Cabin Selection" },
    { id: "included", label: t("inclusions") },
    { id: "experiences", label: t("experiences") },
    { id: "enquire", label: tc("enquire") },
  ];


  return (
    <div>
      <PageHero
        asset={pkg.heroImage}
        title={pkg.title}
        line={
          pkg.customPriceLabel
            ? `${pkg.customPriceLabel} · ${pkg.durationLabel}`
            : `${tc("from")} ${formatPrice(pkg.fromPriceMYR)} ${tc("perPax")} · ${pkg.durationLabel}`
        }
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
              <p className="mt-4 text-lg leading-relaxed text-text-muted whitespace-pre-line">{pkg.overview}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl border border-ink/6 bg-white/70 p-3.5 shadow-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep">
                      <Check aria-hidden className="size-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-sm font-medium text-ink">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="h-fit rounded-3xl border border-ink/8 bg-white p-7">
              <p className="text-sm leading-relaxed text-text-muted">{t("relatedNote")}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="#book-cabins" size="lg">
                  {tc("bookNow")}
                </Button>
                <Button href="#enquire" variant="ghost" size="lg">
                  {tc("enquireNow")}
                </Button>
                <PrintSummaryButton />
              </div>
            </aside>
          </div>
        </section>

        {/* Dynamic Interactive Expedition Navigation Chart (Aqua style) */}
        <section id="route-map" className="scroll-mt-28 pt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
                Expedition Navigation
              </span>
              <h2 className="font-display mt-1 text-3xl font-medium text-ink">
                Kenyir Lake Passenger Route Chart
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-text-muted">
              Explore scheduled daily waypoints, secluded waterfalls, subterranean limestone caves, and sanctuary anchorages along your voyage.
            </p>
          </div>

          <FadeIn>
            <DynamicCruiseMap
              waypoints={waypoints}
              packageTitle={pkg.title}
              durationLabel={pkg.durationLabel}
            />
          </FadeIn>
        </section>

        {/* Itinerary */}
        <section id="itinerary" className="scroll-mt-28 pt-20">
          <div className="mb-8">
            <span className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
              Voyage Schedule
            </span>
            <h2 className="font-display mt-1 text-3xl font-medium text-ink sm:text-4xl">
              {t("itinerary")}
            </h2>
          </div>

          <ol className="space-y-6">
            {pkg.itinerary.map((day, i) => {
              const scheduleItems =
                day.schedule && day.schedule.length > 0
                  ? day.schedule
                  : parseScheduleFromDescription(day.description);

              return (
                <FadeIn key={day.day} delay={i * 0.05}>
                  <li className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm transition-all duration-300 hover:border-ink/15 hover:shadow-md">
                    {/* Header: Day Number + Day Title + Meals */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/6 bg-[#FAF9F6] px-6 py-4 sm:px-8">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-deep text-xs font-bold text-white shadow-sm">
                          {day.day}
                        </span>
                        <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">
                          {t("day", { n: day.day })}: {day.title}
                        </h3>
                      </div>
                      {day.meals.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {day.meals.map((meal) => (
                            <span
                              key={meal}
                              className="rounded-full bg-gold/10 px-3 py-1 font-secondary text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-deep border border-gold/20"
                            >
                              {meal}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timeline Schedule Body */}
                    <div className="p-6 sm:p-8">
                      {scheduleItems.length > 0 ? (
                        <div className="relative pl-6 sm:pl-8 before:absolute before:left-2 sm:before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-ink/15">
                          <div className="space-y-4">
                            {scheduleItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="group relative flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6"
                              >
                                {/* Timeline marker node */}
                                <span className="absolute -left-6 sm:-left-8 top-1.5 size-2 rounded-full bg-teal-deep ring-4 ring-teal-deep/15 transition-transform group-hover:scale-125" />

                                {/* Time Slot Badge */}
                                <div className="shrink-0 sm:w-48">
                                  <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-deep/10 bg-teal-deep/5 px-2.5 py-1 font-secondary text-xs font-bold uppercase tracking-wider text-teal-deep">
                                    <Clock className="size-3" />
                                    {item.time}
                                  </span>
                                </div>

                                {/* Activity Description */}
                                <p className="font-body text-sm font-normal text-ink/85 leading-relaxed">
                                  {item.activity}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="font-body text-sm leading-relaxed text-text-muted">
                          {day.description}
                        </p>
                      )}
                    </div>
                  </li>
                </FadeIn>
              );
            })}
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

        {/* Summer Cruise Floor Plan Attachment (Ground Floor, First Floor, Second Floor) */}
        <SummerCruiseDeckPlan />

        {/* Book Your Stateroom — deep-links into the unified booking wizard */}
        <section id="book-cabins" className="scroll-mt-28 pt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
                Direct Stateroom Reservation
              </span>
              <h2 className="font-display mt-1 text-3xl font-medium text-ink">
                Select Your Cabins & Secure Your Passage
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-text-muted">
              Pick your exact stateroom on the real deck plan, choose a departure date, and confirm — takes under two minutes.
            </p>
          </div>

          <FadeIn>
            <div className="flex flex-col items-start gap-5 rounded-3xl border border-ink/8 bg-[#FAFAF8] p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{pkg.title}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {pkg.durationLabel} aboard Summer Cruise or Green Horizon — staterooms from {formatPrice(rooms[0]?.indicativePriceMYR ?? pkg.fromPriceMYR)}/night
                </p>
              </div>
              <Button href="/book?mode=cabin" size="lg">
                Choose My Stateroom →
              </Button>
            </div>
          </FadeIn>
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
        <section className="pt-24 border-t border-ink/8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-medium">{tc("viewAll")}</h2>
            <Link
              href="/packages"
              className="font-secondary text-xs font-semibold uppercase tracking-widest text-teal-deep hover:text-ink transition-colors"
            >
              All Packages &rarr;
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6">
            {(await getAllPackages())
              .filter((p) => p.slug !== pkg.slug)
              .map((other) => (
                <div key={other.slug} className="w-full max-w-[340px] sm:max-w-[360px]">
                  <PackageCard pkg={other} />
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function parseScheduleFromDescription(desc: string): { time: string; activity: string }[] {
  if (!desc) return [];
  const regex = /(\d{1,2}:\d{2}\s*(?:AM|PM)(?:\s*[–\-—]\s*\d{1,2}:\d{2}\s*(?:AM|PM))?)\s*:\s*/gi;
  const matches = Array.from(desc.matchAll(regex));
  if (matches.length === 0) return [];

  const items: { time: string; activity: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const time = matches[i][1].trim();
    const startIndex = (matches[i].index ?? 0) + matches[i][0].length;
    const endIndex =
      i + 1 < matches.length
        ? (matches[i + 1].index ?? desc.length)
        : desc.length;
    const activity = desc.slice(startIndex, endIndex).replace(/\.\s*$/, "").trim();
    items.push({ time, activity });
  }
  return items;
}
