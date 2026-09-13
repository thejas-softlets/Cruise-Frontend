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
  HorizontalScroll,
  StatCounter,
  Magnetic,
  SplitDoors,
  AutoGallery,
} from "@/components/motion/gsap-primitives";
import { VideoHero } from "@/components/home/VideoHero";
import { DualVoyagesSection } from "@/components/home/DualVoyagesSection";

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

      {/* 6 ── KENYIR LAKE EXPERIENCES: DISCOVER EXPERIENCES & EXPLORE EXCURSIONS */}
      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">06 — Kenyir Lake Experiences</p>
          <SplitHeadline
            text="Discover Kenyir Lake Experiences"
            className="font-display mt-4 text-4xl font-medium tracking-tight text-ink sm:text-5xl"
          />
        </div>
        <AutoGallery className="mt-8" baseDuration={46}>
          {experiences.slice(0, 10).map((e) => (
            <Link
              key={e.slug}
              href="/experiences"
              className="group relative block h-[56vh] w-[70vw] shrink-0 overflow-hidden rounded-3xl sm:w-[38vw] lg:w-[26vw]"
            >
              <img
                src={e.images[0]?.src ?? ""}
                alt={e.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-xl font-medium text-white sm:text-2xl">{e.title}</h3>
                <p className="mt-1.5 line-clamp-1 text-xs font-light text-white/75">{e.lines[0]}</p>
              </div>
            </Link>
          ))}
        </AutoGallery>
      </section>

      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">Excursions</p>
              <SplitHeadline
                text="Explore Kenyir Lake Excursions"
                className="font-display mt-4 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-ink text-balance sm:text-6xl"
              />
            </div>
            <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-text-muted/80 sm:block">
              Swipe to explore →
            </p>
          </div>
        </div>
        <HorizontalScroll className="mt-8">
          {EXCURSIONS.map((ex) => (
            <article
              key={ex.title}
              className="group relative h-[380px] w-[75vw] shrink-0 overflow-hidden rounded-3xl sm:h-[440px] sm:w-[42vw] lg:h-[480px] lg:w-[28vw]"
            >
              <img src={ex.image} alt={ex.title} className="absolute inset-0 size-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105" loading="lazy" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-teal-soft">{ex.tag}</p>
                <h3 className="font-display mt-3 text-2xl font-medium text-white sm:text-3xl">{ex.title}</h3>
              </div>
            </article>
          ))}
        </HorizontalScroll>
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
            <CurtainReveal key={v.id} className="w-full flex flex-col">
              {/* Vessel Image Card */}
              <Link
                href={`/vessels/${v.id}`}
                className="group relative block aspect-[16/9] min-h-[320px] w-full overflow-hidden rounded-3xl sm:min-h-[380px] lg:aspect-[16/10]"
              >
                <img
                  src={v.image}
                  alt={v.name}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[2.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent" />
                <div data-curtain-text className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
                  <div>
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      {v.role}
                    </span>
                    <h3 className="font-display mt-2 text-2xl font-medium text-white sm:text-3xl lg:text-4xl">{v.name}</h3>
                  </div>
                  <span className="font-secondary inline-flex min-h-10 items-center gap-2 rounded-full border border-white/30 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-500 group-hover:border-teal group-hover:bg-teal">
                    View vessel →
                  </span>
                </div>
              </Link>

              {/* Life On Board Stats Card for this vessel */}
              <div className="mt-4 rounded-3xl border border-black/6 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                  <div>
                    <p className="font-display text-lg font-medium text-ink">{v.name}</p>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-teal-deep">{v.role}</p>
                  </div>
                  <Link
                    href={`/vessels/${v.id}`}
                    className="text-xs font-semibold text-teal-deep hover:text-ink transition-colors"
                  >
                    Specs &amp; Decks →
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-stone-50 py-3 px-2 border border-black/[0.03]">
                    <p className="font-display text-2xl font-medium text-teal-deep sm:text-3xl">
                      <StatCounter value={v.guests} />
                    </p>
                    <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-text-muted">Guests</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 py-3 px-2 border border-black/[0.03]">
                    <p className="font-display text-2xl font-medium text-teal-deep sm:text-3xl">
                      <StatCounter value={v.rooms} />
                    </p>
                    <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-text-muted">Rooms</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 py-3 px-2 border border-black/[0.03]">
                    <p className="font-display text-2xl font-medium text-teal-deep sm:text-3xl">
                      <StatCounter value={v.crew} />
                    </p>
                    <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-text-muted">Crew</p>
                  </div>
                </div>
              </div>
            </CurtainReveal>
          ))}
        </div>

        {/* Highlights tag strip from Life On Board */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-text-muted">
            Included Life On Board Highlights
          </p>
          <div className="mt-4 flex max-w-4xl flex-wrap justify-center gap-2 sm:gap-2.5">
            {[
              "Lasir Waterfall",
              "Kelah Sanctuary",
              "Bewah Cave",
              "Melunak Trail",
              "Saok Waterfall",
              "Orchid Garden",
              "Cave Hiking",
              "Jungle Trekking",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/8 bg-white px-4 py-1.5 text-xs font-medium text-ink/80 shadow-xs transition-colors hover:border-teal/40 hover:text-teal-deep"
              >
                {tag}
              </span>
            ))}
          </div>
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
  { tag: "Waterfall", title: "Lasir Falls", image: "/images/real/DSC07615-scaled.webp" },
  { tag: "Sanctuary", title: "Kelah Fish Spa", image: "/images/real/DSC07600.webp" },
  { tag: "Prehistoric", title: "Bewah Cave", image: "/images/real/bewah-cave-card.webp" },
  { tag: "Rainforest", title: "Melunak Giant Tree", image: "/images/real/DSC07563-scaled.webp" },
  { tag: "On the water", title: "Kayak & Bamboo Raft", image: "/images/real/DSC07926-min-1-scaled.webp" },
  { tag: "After dark", title: "Stargazing Anchorage", image: "/images/real/sc-stargazing.webp" },
];
