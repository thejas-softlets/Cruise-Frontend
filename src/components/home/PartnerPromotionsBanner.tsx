"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion";

interface PartnerDestination {
  title: string;
  tag: string;
  location: string;
  description: string;
  image: string;
  alt: string;
  url: string;
  displayUrl: string;
  badge: string;
  actionText: string;
  isPoster?: boolean;
}

const PARTNER_DESTINATIONS: PartnerDestination[] = [
  {
    title: "The M Hotels Collection",
    tag: "Boutique & Executive Stays",
    location: "Kuala Terengganu & Kuantan",
    description:
      "A curated collection of city hotels and executive resident suites providing standardized comfort, prime urban access, and warm hospitality.",
    image: "/images/partners/m-suite-hero.webp",
    alt: "The M Hotels collection executive suite",
    url: "https://mhgbrand.netlify.app/our-hotels",
    displayUrl: "mhgbrand.netlify.app",
    badge: "M Hotels",
    actionText: "Explore Hotels",
  },
  {
    title: "Summer Bay Resort",
    tag: "Marine Island Sanctuary",
    location: "Lang Tengah Island, Terengganu",
    description:
      "Award-winning PADI 5-star marine dive resort nestled on crystal-clear reef lagoons with beachfront villas, powdery white sands, and vibrant coral gardens.",
    image: "/images/partners/summer-bay-sb16.jpg",
    alt: "Summer Bay Resort beachfront and white sand at Lang Tengah Island",
    url: "https://www.summerbayresort.com.my",
    displayUrl: "summerbayresort.com.my",
    badge: "Island Resorts",
    actionText: "Visit Resort",
  },
  {
    title: "Summer Bay Holiday Package",
    tag: "All-Inclusive Island Getaway",
    location: "Lang Tengah Island, Terengganu",
    description:
      "Signature all-inclusive holiday package featuring 4-star accommodation, full-board dining, 2-way boat transfers, and 3 complimentary activities.",
    image: "/images/real/ads2.webp",
    alt: "Summer Bay Resort holiday package promotion",
    url: "https://www.summerbayresort.com.my/packages/",
    displayUrl: "summerbayresort.com.my/packages",
    badge: "Travel Agents",
    actionText: "View Promotion",
    isPoster: true,
  },
];

export function PartnerPromotionsBanner() {
  return (
    <section className="bg-[#faf9f6] py-14 sm:py-20 border-t border-b border-ink/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">
                Sister Brands & Destinations
              </p>
              <h2 className="font-display mt-2 text-2xl font-medium tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Explore the MHG Hospitality Network
              </h2>
            </div>
            <span className="rounded-full border border-teal-deep/20 bg-teal-deep/5 px-3.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-teal-deep">
              Associated Ventures
            </span>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_DESTINATIONS.map((dest, i) => (
            <FadeIn key={dest.title} delay={i * 0.08}>
              <a
                href={dest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 bg-white shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-deep/30"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={dest.image}
                    alt={dest.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {!dest.isPoster && (
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                  )}

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center rounded-full bg-obsidian/85 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-white backdrop-blur-md border border-white/15">
                      {dest.badge}
                    </span>
                  </div>

                  {/* Bottom Image Tag (for scenery/hotel photos) */}
                  {!dest.isPoster && (
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white/90">
                      <span className="text-[0.68rem] font-medium tracking-wider uppercase drop-shadow-sm">
                        {dest.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    {dest.isPoster && (
                      <span className="mb-1.5 inline-block text-[0.68rem] font-semibold uppercase tracking-wider text-teal-deep">
                        {dest.tag}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-teal-deep sm:text-2xl">
                      {dest.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-teal-deep/90">
                      {dest.location}
                    </p>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-text-muted">
                      {dest.description}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs font-medium text-text-muted transition-colors group-hover:text-ink">
                      {dest.displayUrl}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-deep transition-transform duration-300 group-hover:translate-x-1">
                      {dest.actionText} <span aria-hidden>↗</span>
                    </span>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
