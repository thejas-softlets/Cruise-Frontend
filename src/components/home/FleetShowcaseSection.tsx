"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";

const HIGHLIGHT_TAGS = [
  "Lasir Waterfall",
  "Kelah Sanctuary",
  "Bewah Cave",
  "Melunak Trail",
  "Saok Waterfall",
  "Orchid Garden",
  "Cave Hiking",
  "Jungle Trekking",
];

const MOSAIC_IMAGES = [
  {
    src: "/images/real/DJI_0061.webp",
    alt: "Summer Cruise luxury houseboat on Lake Kenyir",
    span: "col-span-12 sm:col-span-6 row-span-2",
    height: "h-56 sm:h-72",
  },
  {
    src: "/images/real/DJI_0123-min-scaled.webp",
    alt: "Houseboat cruising through emerald rainforest waters",
    span: "col-span-6 sm:col-span-6",
    height: "h-36 sm:h-44",
  },
  {
    src: "/images/real/sc-superior-bedroom.webp",
    alt: "Panoramic bedroom suite with lake and mountain view",
    span: "col-span-6 sm:col-span-6",
    height: "h-36 sm:h-44",
  },
  {
    src: "/images/real/about-1-Green-Horizon_summer-cruise.webp",
    alt: "Green Horizon newly launched grand houseboat",
    span: "col-span-6 sm:col-span-6",
    height: "h-36 sm:h-44",
  },
  {
    src: "/images/real/DSC01523-min-scaled.webp",
    alt: "Dining setup with freshly prepared dishes",
    span: "col-span-6 sm:col-span-6",
    height: "h-36 sm:h-44",
  },
];

export function FleetShowcaseSection() {
  return (
    <section id="cruises" className="scroll-mt-20 bg-obsidian py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Fleet Cards & Highlights */}
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="space-y-6">
                {/* Summer Cruise Card */}
                <Link
                  href="/vessels/summer-cruise"
                  className="group relative flex items-center justify-between rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-white/10 sm:p-8"
                >
                  <div>
                    <h3 className="font-display text-3xl font-medium text-white transition-colors group-hover:text-gold">
                      Summer Cruise
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-white/70 sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        34 Guests
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        10 Crew
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        12 Rooms
                      </span>
                    </div>
                  </div>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-obsidian shadow-lg shadow-[#10b981]/25 transition-transform duration-300 group-hover:scale-110">
                    <ArrowUpRight aria-hidden className="size-6 stroke-[2.5]" />
                  </div>
                </Link>

                {/* Green Horizon Card */}
                <Link
                  href="/vessels/green-horizon"
                  className="group relative flex items-center justify-between rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-white/10 sm:p-8"
                >
                  <div>
                    <h3 className="font-display text-3xl font-medium text-white transition-colors group-hover:text-gold">
                      Green Horizon
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-white/70 sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        60 Guests
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        10 Crew
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-gold" />
                        15 Rooms
                      </span>
                    </div>
                  </div>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-obsidian shadow-lg shadow-[#10b981]/25 transition-transform duration-300 group-hover:scale-110">
                    <ArrowUpRight aria-hidden className="size-6 stroke-[2.5]" />
                  </div>
                </Link>
              </div>

              {/* Explanatory Copy */}
              <p className="mt-8 text-sm leading-relaxed text-white/75 sm:text-base">
                Our cruises on Kenyir Lake in Malaysia offer a fantastic luxury experience! Kenyir Lake is
                one of the largest man-made lakes in Southeast Asia, known for its stunning scenery, lush
                rainforest surroundings, and abundant wildlife. Here are some highlights and tips for enjoying
                a summer cruise on Kenyir Lake:
              </p>

              {/* Highlight Tag Chips */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {HIGHLIGHT_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-gold hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: 6-Photo Mosaic Grid */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-12 gap-3.5">
                {MOSAIC_IMAGES.map((img, i) => (
                  <div
                    key={img.src}
                    className={`group relative overflow-hidden rounded-2xl bg-white/10 ${img.span} ${img.height}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
