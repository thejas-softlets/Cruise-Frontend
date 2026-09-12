"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

const HIGHLIGHTS_DATA = {
  excursions: [
    {
      slug: "elephant-conservation-village",
      title: "Kenyir Elephant Conservation Village",
      subtitle: "Observe and connect with gentle giants in ethical sanctuary",
      image: "/images/real/Kenyir-Elephant-Conservation-Village.webp",
      alt: "Asian elephant sanctuary interaction at Tasik Kenyir",
    },
    {
      slug: "kelah-sanctuary",
      title: "Playing in Kenyir Kelah Sanctuary",
      subtitle: "Natural Fish Spa of Kenyir Kelah Sanctuary Preserving Nature's Harmony",
      image: "/images/real/DSC07600.webp",
      alt: "Wild Malaysian Mahseer fish sanctuary in clean river water",
    },
    {
      slug: "bewah-cave",
      title: "Exploring Bewah Cave",
      subtitle: "Conqueror of Bewah Cave Unveiling Nature's Subterranean Wonder",
      image: "/images/real/495.webp",
      alt: "Prehistoric limestone chambers inside Bewah Cave",
    },
    {
      slug: "melunak-trail",
      title: "Melunak Trail",
      subtitle: "Undiscovered Melunak Tree Trail Explore the Enchanting Canopy",
      image: "/images/real/DSC07563-scaled.webp",
      alt: "Rainforest giant Melunak tree trail trekking",
    },
    {
      slug: "lasir-waterfall",
      title: "Lasir Waterfall",
      subtitle: "Multi-tiered cascades and natural rock freshwater swimming pools",
      image: "/images/real/DSC07615-scaled.webp",
      alt: "Lasir waterfall cascading into crystal clear pool",
    },
    {
      slug: "saok-waterfall",
      title: "Saok Waterfall",
      subtitle: "Secluded forest canopy streams and shallow granite pools",
      image: "/images/real/air-terjun-saok-1-scaled.webp",
      alt: "Saok waterfall surrounded by rainforest greenery",
    },
  ],
  activities: [
    {
      slug: "kayaking-rafting",
      title: "Kayaking & Bamboo Rafting",
      subtitle: "Glide across morning glass waters in personal kayaks or bamboo rafts",
      image: "/images/real/DSC07926-min-1-scaled.webp",
      alt: "Kayaking and bamboo rafting on Kenyir Lake",
    },
    {
      slug: "fishing-terengganu",
      title: "Lake Angling & Sport Fishing",
      subtitle: "Catch-and-release angling for Toman and Kelah in secluded coves",
      image: "/images/real/fishing-terengganu.webp",
      alt: "Game fishing on Lake Kenyir",
    },
    {
      slug: "starlit-deck",
      title: "Starlit Deck Dining",
      subtitle: "Freshly prepared lake-to-table cuisine under the evening constellation sky",
      image: "/images/real/DSC01523-min-scaled.webp",
      alt: "Deck dining terrace on the cruise at sunset",
    },
    {
      slug: "sunset-cruising",
      title: "Sunset Drift & Coves Exploration",
      subtitle: "Peaceful slow-steaming through 340+ rainforest islands at golden hour",
      image: "/images/real/DJI_0123-min-scaled.webp",
      alt: "Houseboat drifting through tranquil rainforest lake at sunset",
    },
  ],
};

export function HighlightsExcursionsSection() {
  const [activeTab, setActiveTab] = useState<"excursions" | "activities">("excursions");

  const items = HIGHLIGHTS_DATA[activeTab];

  return (
    <section id="excursions" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Explore Kenyir Lake Highlights & Excursions
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              Discover Unique Wildlife Along Kenyir Lake&apos;s Serene Waters
            </p>

            {/* Tabs */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-full bg-ink/5 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("excursions")}
                  className={cn(
                    "font-secondary rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                    activeTab === "excursions"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-ink/60 hover:text-ink",
                  )}
                >
                  Excursions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activities")}
                  className={cn(
                    "font-secondary rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                    activeTab === "activities"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-ink/60 hover:text-ink",
                  )}
                >
                  Activities
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Highlights Grid — Full-bleed cards with frosted glassmorphism */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <FadeIn key={item.slug} delay={i * 0.06}>
              <Link
                href="/experiences"
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-obsidian shadow-xl shadow-ink/8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:aspect-[3/4]"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/35 to-transparent transition-opacity duration-300 group-hover:from-obsidian/95"
                />

                {/* Glassmorphic Overlay Panel */}
                <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-white/20 bg-obsidian/60 p-5 backdrop-blur-xl transition-all duration-300 group-hover:border-gold/50 group-hover:bg-obsidian/75">
                  <h3 className="font-display text-xl font-medium text-white transition-colors group-hover:text-gold sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
