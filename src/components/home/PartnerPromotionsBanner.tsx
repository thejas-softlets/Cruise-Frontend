"use client";

import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";

const PROMOTIONS = [
  {
    title: "Diving Package",
    image: "/images/real/diving-package.webp",
    alt: "Summerbay Resort Lang Tengah Diving Package",
    href: "/packages",
  },
  {
    title: "Leisure Package",
    image: "/images/real/Leisure-package.webp",
    alt: "Summerbay Resort Kenyir & Island Leisure Package",
    href: "/packages",
  },
  {
    title: "Holiday Package",
    image: "/images/real/ads2.webp",
    alt: "Full board accommodation and boat transfer holiday packages",
    href: "/packages",
  },
];

export function PartnerPromotionsBanner() {
  return (
    <section className="bg-[#faf9f6] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Summerbay Resort Promotions
            </h2>
            <span className="rounded-md bg-obsidian px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-white">
              Sponsored
            </span>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROMOTIONS.map((promo, i) => (
            <FadeIn key={promo.title} delay={i * 0.08}>
              <Link
                href={promo.href}
                className="group relative block aspect-[2/1] w-full overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Natural 2:1 art, full image visible — object-contain, no crop */}
                <Image
                  src={promo.image}
                  alt={promo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
