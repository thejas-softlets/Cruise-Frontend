import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/components/cards/ArticleCard";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion";
import {
  SplitHeadline,
  Rise,
  StaggerGrid,
  ParallaxLayer,
  CurtainReveal,
  StatCounter,
  Magnetic,
  SplitDoors,
} from "@/components/motion/gsap-primitives";
import { VideoHero } from "@/components/home/VideoHero";
import { DualVoyagesSection } from "@/components/home/DualVoyagesSection";
import {
  ExperiencesInfiniteMarquee,
  type ExperienceItem,
} from "@/components/home/ExperiencesInfiniteMarquee";

import { PartnerPromotionsBanner } from "@/components/home/PartnerPromotionsBanner";
import { getAllArticles } from "@/lib/api/journal";
import { getAllReviews } from "@/lib/api/reviews";
import { getAllOffers } from "@/lib/api/offers";
import { getExperiencesByKind } from "@/lib/api/experiences";
import { Link } from "@/lib/i18n/navigation";
import { GoogleG, StarRow } from "@/components/layout/BrandBadges";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const [articles, reviews, offers, experiences] = await Promise.all([
    getAllArticles(),
    getAllReviews(),
    getAllOffers(),
    getExperiencesByKind("excursions"),
  ]);
  const offer = offers[0];

  const allExperienceItems: ExperienceItem[] = [
    ...EXCURSIONS.map((ex) => ({
      id: ex.id,
      title: ex.title,
      tag: ex.tag,
      image: ex.image,
      description: ex.description,
      href: "/experiences",
    })),
    ...experiences
      .filter(
        (e) =>
          !EXCURSIONS.some(
            (ex) =>
              ex.id === e.slug ||
              ex.title.toLowerCase().includes(e.title.toLowerCase().slice(0, 7))
          )
      )
      .map((e) => ({
        id: e.slug,
        title: e.title,
        tag: e.tags?.[0] ?? "Excursion",
        image: e.images[0]?.src ?? "/images/real/DSC07615-scaled.webp",
        description: e.lines?.[0],
        href: `/experiences/${e.slug}`,
      })),
  ];

  return (
    <>
      {/* 1 ── CINEMATIC VIDEO HERO (Summer Cruise's own film) */}
      <div data-nav-transparent>
        <VideoHero />
      </div>

      {/* 2 ── PREMIER LUXURY RIVER CRUISES & LIFE ON BOARD COMBINED */}
      <FleetSection />

      {/* 3 ── UNFORGETTABLE KENYIR LAKE CRUISE PACKAGES */}
      <DualVoyagesSection />

      {/* Current offer — single ribbon, low text density */}
      {offer && (
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24 -mt-6">
          <Rise delay={0.15}>
            <Link
              href={`/offers/${offer.slug}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-teal/20 bg-teal/5 px-7 py-6 transition-colors duration-500 hover:bg-teal/10 sm:px-9"
            >
              <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.26em] text-teal-deep">
                <Sparkle /> {offer.shortTag}
              </span>
              <span className="font-display text-xl font-medium text-ink sm:text-2xl">{offer.title}</span>
              <span className="font-secondary text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep transition-transform duration-500 group-hover:translate-x-1">
                View offer →
              </span>
            </Link>
          </Rise>
        </div>
      )}

      {/* 4 ── KENYIR THE LAKE SECTION — center-split doors */}
      <SplitDoors leftWord="Kenyir" rightWord="Lake">
        <div className="relative size-full">
          <img
            src="/images/lake/kenyir-shoreline.webp"
            alt="Rainforest islands rising from Kenyir Lake"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div aria-hidden className="absolute inset-0 bg-obsidian/35" />
          <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-5 text-center text-white sm:px-8">
            <p data-reveal-rise className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-soft">
              04 — The Lake
            </p>
            <h2 data-reveal-rise className="font-display mt-5 text-4xl font-medium leading-[1.05] tracking-tight text-balance sm:text-6xl">
              130 million years of rainforest, one mirror-still lake
            </h2>
            <p data-reveal-rise className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
              Malaysia&apos;s largest man-made lake — a maze of emerald islands where
              waterfalls pour out of untouched jungle and the only morning commute
              is a tender boat.
            </p>
            <div data-reveal-rise className="mt-9">
              <Magnetic strength={0.25}>
                <Button href="/the-lake" variant="ghostLight">
                  Discover Kenyir
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </SplitDoors>

      {/* 5 ── WHAT GUESTS SAY */}
      <section className="bg-[#f7fafb] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">05 — Guest Words</p>
              <SplitHeadline
                text="What guests say"
                className="font-display mt-4 text-4xl font-medium tracking-tight text-ink sm:text-6xl"
              />
            </div>
            <Rise delay={0.2}>
              <span className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-teal-deep shadow-sm">
                <StarRow className="text-teal" /> 5.0 · Google &amp; TripAdvisor
              </span>
            </Rise>
          </div>
          <StaggerGrid className="mt-10 grid gap-6 lg:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <figure
                key={r.id}
                className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-[0_12px_44px_rgba(12,43,51,0.06)]"
              >
                <StarRow className="text-teal" />
                <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-text-muted">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 border-t border-ink/8 pt-5">
                  <p className="font-display text-lg font-medium text-ink">{r.guestName}</p>
                  <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-text-muted">{r.guestLocation}</p>
                </figcaption>
              </figure>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 6 ── KENYIR LAKE EXPERIENCES & EXCURSIONS: Combined Infinite Marquee & Horizontal Drag */}
      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">
                06 — Experiences &amp; Excursions
              </p>
              <SplitHeadline
                text="Discover Kenyir Lake Experiences &amp; Excursions"
                className="font-display mt-4 max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
              />
              <p className="mt-3 max-w-2xl text-base text-text-muted">
                From ancient limestone caves and roaring waterfalls to misty bamboo rafting — discover every signature Kenyir encounter.
              </p>
            </div>
            <Link
              href="/experiences"
              className="font-secondary inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-xs transition-all duration-300 hover:border-teal hover:bg-teal hover:text-white"
            >
              All Experiences →
            </Link>
          </div>
        </div>

        <ExperiencesInfiniteMarquee items={allExperienceItems} className="mt-8" />
      </section>

      {/* 7 ── PANORAMIC INTERLUDE — pinned slow parallax quote */}
      <section className="relative overflow-hidden bg-obsidian py-28 text-center text-white sm:py-40">
        <ParallaxLayer speed={0.22} className="absolute inset-0 -top-[15%] h-[130%]">
          <img src="/images/real/DJI_0117-min-scaled.webp" alt="" className="size-full object-cover" loading="lazy" />
        </ParallaxLayer>
        <div aria-hidden className="absolute inset-0 bg-obsidian/55" />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <SplitHeadline
            text="Enjoy Nature. Be Part of Nature."
            className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          />
          <Rise delay={0.3}>
            <p className="mt-6 font-light italic text-teal-soft/90 sm:text-xl">Summer Cruise · Kenyir Lake</p>
          </Rise>
        </div>
      </section>

      {/* 8 ── JOURNAL — travel guide cards */}
      <section id="travel-guide" className="scroll-mt-20 bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">08 — Journal</p>
                <SplitHeadline
                  text="Notes from the lake"
                  className="font-display mt-4 text-4xl font-medium tracking-tight text-ink sm:text-5xl"
                />
              </div>
              <Magnetic>
                <Button href="/journal" variant="ghost">
                  Explore Kenyir
                </Button>
              </Magnetic>
            </div>
          </FadeIn>

          <StaggerGrid className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" duration={0.85} stagger={0.08} y={40}>
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 9 ── Partner Promotions (M Hotels · Island Resorts · Travel agents) */}
      <PartnerPromotionsBanner />

      {/* 10 ── RECOGNITION — awards band */}
      <section className="bg-[#f7fafb] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <StaggerGrid className="grid items-center gap-10 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 text-center">
              <GoogleG className="size-8 text-teal-deep" />
              <p className="font-display text-3xl font-medium text-ink">5.0</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-text-muted">Google Reviews</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <StarRow className="text-teal-deep" />
              <p className="font-display text-3xl font-medium text-ink">Rated · 5</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-text-muted">TripAdvisor · Kenyir Lake</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <svg viewBox="0 0 24 24" className="size-8 text-teal-deep" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="12" cy="9" r="5" />
                <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-display text-3xl font-medium text-ink">No. 1</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-text-muted">Houseboat Cruise · Tasik Kenyir</p>
            </div>
          </StaggerGrid>
        </div>
      </section>

      {/* 11 ── CLOSING CTA — dusk lake, magnetic buttons */}
      <section className="relative overflow-hidden bg-obsidian pb-28 pt-40 text-center text-white sm:pb-36 sm:pt-56">
        <ParallaxLayer speed={0.16} className="absolute inset-0 -top-[12%] h-[124%]">
          <img src="/images/real/DJI_0123-min-scaled.webp" alt="" className="size-full object-cover" loading="lazy" />
        </ParallaxLayer>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg-base/0 via-obsidian/40 to-obsidian/85" />
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-bg-base/70 to-transparent" />

        <div className="relative z-20 mx-auto max-w-4xl px-5 sm:px-8">
          <SplitHeadline
            text={t("ctaTitle")}
            className="font-display mx-auto max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          />
          <Rise delay={0.25}>
            <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg">
              {t("ctaLine")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12">
              <Magnetic>
                <Button href="/contact" size="lg" className="bg-teal hover:bg-white hover:text-obsidian">
                  {tc("enquireNow")}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/vessels" size="lg" variant="ghostLight">
                  {t("vesselsTitle")}
                </Button>
              </Magnetic>
            </div>
          </Rise>
        </div>
      </section>
    </>
  );
}

/* Small 4-point sparkle used in the offer ribbon */
function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
      <path d="M12 1.5c.7 4.6 3.9 7.8 8.5 8.5-4.6.7-7.8 3.9-8.5 8.5-.7-4.6-3.9-7.8-8.5-8.5 4.6-.7 7.8-3.9 8.5-8.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Fleet & Life On Board Combined — Two Premier Luxury River Cruises  */
/* ------------------------------------------------------------------ */
function FleetSection() {
  return (
    <section className="bg-bg-base pb-16 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">
          02 — The Fleet &amp; Life On Board
        </p>
        <SplitHeadline
          text="Kenyir Lake’s Premier Luxury River Cruises."
          className="font-display mt-4 max-w-4xl text-3xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
          Discover the beauty of Kenyir Lake through the exceptional experiences of SummerCruise and Green Horizon
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {FLEET.map((v) => (
            <CurtainReveal key={v.id} className="w-full">
              {/* Vessel Card with concise nested glassmorphic specs card */}
              <Link
                href={`/vessels/${v.id}`}
                className="group relative block w-full overflow-hidden rounded-[2rem] min-h-[480px] sm:min-h-[520px] lg:min-h-[550px] aspect-[4/4.5] sm:aspect-[1/1] lg:aspect-[16/13] shadow-lg transition-all duration-500 hover:shadow-2xl"
              >
                {/* Vessel background image with smooth slow zoom on hover */}
                <img
                  src={v.image}
                  alt={v.name}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[2.2s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                {/* Editorial gradient scrim: transparent top, subtle lagoon tint at base */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-black/15"
                />

                {/* Top category badge */}
                <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
                  <span className="inline-block rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">
                    {v.role}
                  </span>
                </div>

                {/* Concise, slim nested glassmorphic card */}
                <div className="absolute inset-x-3.5 bottom-3.5 z-10 sm:inset-x-5 sm:bottom-5">
                  <div className="rounded-2xl border border-white/25 bg-black/40 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-all duration-500 group-hover:border-white/40 group-hover:bg-black/50">
                    {/* Header row: Vessel name + role + specs CTA */}
                    <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2.5">
                      <div>
                        <h3 className="font-display text-lg font-medium text-white tracking-tight sm:text-xl drop-shadow-sm">
                          {v.name}
                        </h3>
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-teal-soft">
                          {v.role}
                        </p>
                      </div>
                      <span className="font-secondary inline-flex min-h-7 items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-300 group-hover:border-teal group-hover:bg-teal">
                        Specs &amp; Decks →
                      </span>
                    </div>

                    {/* Concise stats divider strip */}
                    <div className="mt-2.5 grid grid-cols-3 text-center">
                      <div className="flex flex-col items-center justify-center border-r border-white/10 py-1">
                        <span className="font-display text-base font-medium text-white sm:text-lg leading-none">
                          <StatCounter value={v.guests} />
                        </span>
                        <span className="mt-0.5 text-[0.58rem] sm:text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/75">
                          Guests
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center border-r border-white/10 py-1">
                        <span className="font-display text-base font-medium text-white sm:text-lg leading-none">
                          <StatCounter value={v.rooms} />
                        </span>
                        <span className="mt-0.5 text-[0.58rem] sm:text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/75">
                          Rooms
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-1">
                        <span className="font-display text-base font-medium text-white sm:text-lg leading-none">
                          <StatCounter value={v.crew} />
                        </span>
                        <span className="mt-0.5 text-[0.58rem] sm:text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/75">
                          Crew
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CurtainReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

const FLEET = [
  {
    id: "summer-cruise",
    name: "Summer Cruise",
    role: "Flagship Luxury Houseboat",
    meta: "34 guests · 12 rooms · 10 crew",
    image: "/images/vessels/sc-hero.webp",
    guests: 34,
    rooms: 12,
    crew: 10,
  },
  {
    id: "green-horizon",
    name: "Green Horizon",
    role: "Newly Launched Grand Houseboat",
    meta: "60 guests · 15 rooms · 10 crew",
    image: "/images/vessels/gh-hero.webp",
    guests: 60,
    rooms: 15,
    crew: 10,
  },
];

const EXCURSIONS = [
  {
    id: "lasir-falls",
    tag: "Waterfall",
    title: "Lasir Falls",
    image: "/images/real/DSC07615-scaled.webp",
    description: "Multi-tiered natural cascades tumbling into crystal pools fringed by lush canopy.",
  },
  {
    id: "kelah-fish-spa",
    tag: "Sanctuary",
    title: "Kelah Fish Spa",
    image: "/images/real/DSC07600.webp",
    description: "Wade into clear river currents with hundreds of protected Malaysian Mahseer.",
  },
  {
    id: "bewah-cave",
    tag: "Prehistoric",
    title: "Bewah Cave",
    image: "/images/real/bewah-cave-card.webp",
    description: "16,000-year-old archaeological cavern with awe-inspiring limestone chambers.",
  },
  {
    id: "elephant-village",
    tag: "Wildlife",
    title: "Elephant Village",
    image: "/images/real/Kenyir-Elephant-Conservation-Village.webp",
    description: "Ethical encounters with Asian elephants in their protected forest sanctuary.",
  },
  {
    id: "melunak-tree",
    tag: "Rainforest",
    title: "Melunak Giant Tree",
    image: "/images/real/DSC07563-scaled.webp",
    description: "Trek pristine dipterocarp trails to stand before a thousand-year-old rainforest icon.",
  },
  {
    id: "kayak-raft",
    tag: "On The Water",
    title: "Kayak & Bamboo Raft",
    image: "/images/real/DSC07926-min-1-scaled.webp",
    description: "Glide silently across misty emerald inlets directly from the houseboat deck.",
  },
  {
    id: "stargazing",
    tag: "After Dark",
    title: "Stargazing Anchorage",
    image: "/images/real/sc-stargazing.webp",
    description: "Unpolluted dark-sky celestial panoramas from the open observation deck at night.",
  },
  {
    id: "herbal-island",
    tag: "Botanical",
    title: "Kenyir Herbal Island",
    image: "/images/real/herbal-park.webp",
    description: "Explore hundreds of rare indigenous medicinal rainforest plants and tropical flora.",
  },
];
