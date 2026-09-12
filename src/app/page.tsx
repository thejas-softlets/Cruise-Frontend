import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/components/cards/ArticleCard";
import { Button } from "@/components/ui/Button";
import { FadeIn, ParallaxImage } from "@/components/motion";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { HeroAnchorStrip } from "@/components/home/HeroAnchorStrip";
import { KenyirAdventuresStory } from "@/components/home/KenyirAdventuresStory";
import { AudiencePersonaGrid } from "@/components/home/AudiencePersonaGrid";
import { FleetShowcaseSection } from "@/components/home/FleetShowcaseSection";
import { PackageScheduleSection } from "@/components/home/PackageScheduleSection";
import { PanoramicDivider } from "@/components/home/PanoramicDivider";
import { HighlightsExcursionsSection } from "@/components/home/HighlightsExcursionsSection";
import { PartnerPromotionsBanner } from "@/components/home/PartnerPromotionsBanner";
import { getAllArticles } from "@/lib/api/journal";
import { Link } from "@/lib/i18n/navigation";
import { media } from "@/lib/api/mock/media";

const heroAsset = media(
  "Summer Cruise luxury houseboat aerial sailing across Kenyir Lake",
  "/images/real/Homepage-banner-new-two.webp",
  2560,
  1440
);

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const articles = await getAllArticles();

  return (
    <>
      {/* 1. Cinematic Hero — Inspired by reference layout with script eyebrow & bold title */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-obsidian pb-24 pt-36 sm:pb-32 sm:pt-48">
        <ParallaxImage
          asset={heroAsset}
          className="absolute inset-0 h-[115%]"
          priority
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/45 to-obsidian/25"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <p className="font-script text-3xl text-gold sm:text-4xl lg:text-5xl">
              Enjoy Nature, Be Part of Nature
            </p>
            <h1 className="font-display mt-3 max-w-5xl text-5xl font-medium uppercase tracking-tight text-[#F6F5F1] text-balance sm:text-7xl lg:text-[5.5rem]">
              Kenyir Lake Cruises
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

      {/* 2. Anchor Strip for Fast Page Navigation */}
      <HeroAnchorStrip />

      {/* 3. Kenyir Lake Adventures Story & Asymmetric Collage */}
      <KenyirAdventuresStory />

      {/* 4. Kenyir Lake For (Audience Personas Grid) */}
      <AudiencePersonaGrid />

      {/* 5. Our Houseboats Fleet Showcase (Summer Cruise & Green Horizon) */}
      <FleetShowcaseSection />

      {/* 6. Packages & Schedules (Interactive Tabbed Selector) */}
      <PackageScheduleSection />

      {/* 7. Full-Bleed Panoramic Parallax Interlude */}
      <PanoramicDivider />

      {/* 8. Highlights & Excursions / Activities Tabs */}
      <HighlightsExcursionsSection />

      {/* 9. Travel Guide to Kenyir Lake, Terengganu (Journal / Blog) */}
      <section id="travel-guide" className="scroll-mt-20 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  Travel Guide to the Kenyir Lake, Terengganu
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
                  As you explore the unknown, be ready for awe-inspiring sights, thrilling experiences, and
                  the joy of overcoming challenges. Every moment holds a new treasure.
                </p>
              </div>
              <Link
                href="/journal"
                className="font-secondary inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
              >
                Explore Kenyir
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article, i) => (
              <FadeIn key={article.slug} delay={i * 0.08}>
                <ArticleCard article={article} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Partner Promotions (Summerbay Resort) */}
      <PartnerPromotionsBanner />

      {/* 11. Closing CTA — Dusk lake panoramic background */}
      <section className="relative overflow-hidden bg-obsidian pt-48 pb-24 text-center sm:pt-64 sm:pb-32">
        <PlaceholderMedia
          asset={media(
            "Moody atmospheric wide panoramic photography of Lake Kenyir mist rolling over water surrounded by ancient rainforest mountain silhouettes at dusk",
            "/images/real/DJI_0123-min-scaled.webp",
            2048,
            1152
          )}
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover object-center scale-105"
        />

        {/* Top dissolve — smooth cream fade into the dark section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6]/50 to-transparent sm:h-80"
        />

        {/* Ambient dark contrast layer — gradual vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-obsidian/25 to-obsidian/75"
        />

        {/* Bottom obsidian dissolve into footer — extended for seamless blend */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3/5 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent sm:h-2/3"
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
