import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/components/cards/ArticleCard";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { PackageCard } from "@/components/cards/PackageCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { VesselCard } from "@/components/cards/VesselCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, ParallaxImage } from "@/components/motion";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { getAllArticles } from "@/lib/api/journal";
import { getAllExperiences } from "@/lib/api/experiences";
import { getAllPackages } from "@/lib/api/packages";
import { getAllReviews } from "@/lib/api/reviews";
import { getAllVessels } from "@/lib/api/vessels";
import { Link } from "@/lib/i18n/navigation";
import { media } from "@/lib/api/mock/media";

const heroAsset = media(
  "Summer Cruise luxury houseboat sailing across Lake Kenyir",
  "/images/page-heroes/hero-cruise.webp",
  2560,
  1440
);

const lifeMoments = [
  {
    title: "Upper Deck Living",
    subtitle: "Panoramic teak loungers with 360° lake horizons",
    image: media("Upper deck loungers on the lake", "/images/deck/top-deck.webp"),
    span: "col-span-12 lg:col-span-7",
  },
  {
    title: "Dawn Paddleboarding",
    subtitle: "Gliding across mirror-like morning glass waters",
    image: media("Paddleboarding on Kenyir Lake", "/images/experiences/sunrise-paddle.webp"),
    span: "col-span-12 sm:col-span-6 lg:col-span-5",
  },
  {
    title: "Cascades & Jungle Pools",
    subtitle: "Secluded swims in pristine rainforest waterfalls",
    image: media("Lasir waterfall swimming pool", "/images/experiences/lasir-waterfall.webp"),
    span: "col-span-12 sm:col-span-6 lg:col-span-5",
  },
  {
    title: "Starlit Deck Dining",
    subtitle: "Freshly prepared lake-to-table cuisine under the evening sky",
    image: media("Fine dining terrace on the cruise deck at sunset", "/images/vessels/sc-deck-sunset.webp"),
    span: "col-span-12 lg:col-span-7",
  },
];

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [vessels, packages, experiences, reviews, articles] = await Promise.all([
    getAllVessels(),
    getAllPackages(),
    getAllExperiences(),
    getAllReviews(),
    getAllArticles(),
  ]);

  return (
    <>
      {/* Cinematic hero — full viewport aerial image, ultra-clean density, brand purpose */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-obsidian pb-24 pt-36 sm:pb-32 sm:pt-48">
        <ParallaxImage
          asset={heroAsset}
          className="absolute inset-0 h-[115%]"
          priority
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-obsidian/15"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.04] text-[#F6F5F1] text-balance sm:text-7xl lg:text-[5.25rem]">
              {t("heroTitle")}
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/packages" size="lg">
                {tc("enquireNow")}
              </Button>
              <Button href="/vessels" size="lg" variant="ghostLight">
                {tc("learnMore")}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The fleet — asymmetric editorial grid */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              as="h2"
              script={t("vesselsScript")}
              title={t("vesselsTitle")}
              line={t("vesselsLine")}
            />
            <ViewAll href="/vessels" label={tc("viewAll")} />
          </div>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr]">
          {vessels.map((vessel, i) => (
            <FadeIn key={vessel.id} delay={i * 0.1} className={i === 1 ? "md:mt-14" : undefined}>
              <VesselCard vessel={vessel} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Life on the water — photographic moments showcase */}
      <section className="border-t border-ink/6 bg-white pt-28 pb-40 sm:pb-48">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-script text-3xl text-gold sm:text-4xl">moments on the lake</p>
                <h2 className="font-display mt-2 text-3xl font-medium text-ink sm:text-4xl lg:text-5xl">
                  Life Adrift in the Rainforest
                </h2>
              </div>
              <ViewAll href="/gallery" label="View Gallery" />
            </div>
          </FadeIn>

          <div className="mt-12 grid grid-cols-12 gap-6">
            {lifeMoments.map((moment, i) => (
              <FadeIn key={moment.title} delay={i * 0.08} className={moment.span}>
                <div className="group relative block overflow-hidden rounded-2xl bg-obsidian">
                  <PlaceholderMedia
                    asset={moment.image}
                    className="aspect-[16/10] w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/30 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="font-display text-2xl font-medium text-[#F4F4F6] sm:text-3xl">
                      {moment.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/75 sm:text-base">
                      {moment.subtitle}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Expeditions — full-bleed image band */}
      <section className="relative overflow-hidden py-32 sm:py-36">
        <ParallaxImage
          asset={packages[1]?.heroImage ?? packages[0]?.heroImage}
          className="absolute inset-0 h-[120%]"
        />
        <div aria-hidden className="absolute inset-0 bg-obsidian/80" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                as="h2"
                script={t("packagesScript")}
                title={t("packagesTitle")}
                tone="light"
              />
              <ViewAll href="/packages" label={tc("viewAll")} light />
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.slug} delay={i * 0.1}>
                <PackageCard pkg={pkg} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              as="h2"
              script="excursions & activities"
              title={t("experiencesTitle")}
            />
            <ViewAll href="/experiences" label={tc("viewAll")} />
          </div>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.slice(0, 3).map((exp, i) => (
            <FadeIn key={exp.slug} delay={i * 0.08}>
              <ExperienceCard experience={exp} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Guest words */}
      <section className="border-t border-ink/6 bg-white py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading as="h2" script={t("reviewsScript")} title={t("reviewsTitle")} />
              <ViewAll href="/reviews" label={tc("viewAll")} />
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.08}>
                <ReviewCard review={review} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading as="h2" title={t("journalTitle")} />
            <ViewAll href="/journal" label={tc("viewAll")} />
          </div>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, i) => (
            <FadeIn key={article.slug} delay={i * 0.08}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Closing CTA — background image vanishing seamlessly into the footer */}
      <section className="relative overflow-hidden bg-obsidian py-36 text-center sm:py-48">
        <PlaceholderMedia
          asset={media(
            "Moody atmospheric wide panoramic photography of Lake Kenyir mist rolling over water surrounded by ancient rainforest mountain silhouettes at dusk",
            "/images/lake/kenyir-dusk.webp"
          )}
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover object-center scale-105"
        />

        {/* Ambient atmospheric dark gradient — keeps top crisp without white haze and smoothly dissolves into obsidian footer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-obsidian/50 via-obsidian/75 to-obsidian"
        />

        {/* Bottom deep obsidian dissolve into the footer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-obsidian via-obsidian/95 to-transparent"
        />

        <FadeIn className="relative z-20 mx-auto max-w-4xl px-5 sm:px-8">
          <p className="font-script text-3xl text-gold sm:text-4xl">{t("ctaScript")}</p>
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-5xl font-medium leading-[1.06] text-[#F6F5F1] text-balance sm:text-6xl lg:text-7xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t("ctaLine")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg">
              {tc("enquireNow")}
            </Button>
            <Button href="/vessels" size="lg" variant="ghostLight">
              {t("vesselsTitle")}
            </Button>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

function ViewAll({ href, label, light }: { href: string; label: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={
        "font-secondary group inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-colors " +
        (light ? "text-white/70 hover:text-gold" : "text-ink/50 hover:text-ink")
      }
    >
      {label}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </Link>
  );
}


