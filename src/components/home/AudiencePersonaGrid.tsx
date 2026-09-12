"use client";

import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";

const PERSONAS = [
  {
    title: "Nature Lovers",
    href: "/experiences",
    image: "/images/real/DSC07563-scaled.webp",
    alt: "Hikers exploring pristine ancient rainforest in Kenyir",
  },
  {
    title: "Wildlife",
    href: "/experiences#wildlife",
    image: "/images/real/Kenyir-Elephant-Conservation-Village.webp",
    alt: "Asian elephant conservation village at Lake Kenyir",
  },
  {
    title: "Eco Travelers",
    href: "/the-lake",
    image: "/images/real/air-terjun-saok-1-scaled.webp",
    alt: "Canopy trees and waterfalls in untouched tropical biosphere",
  },
  {
    title: "Adventures",
    href: "/packages",
    image: "/images/real/DSC07724-1.webp",
    alt: "Suspension bridge crossing and canopy adventures",
  },
] as const;

export function AudiencePersonaGrid() {
  return (
    <section className="bg-[#faf9f6] pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Kenyir Lake For
            </h2>
          </div>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {PERSONAS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <Link
                href={item.href}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg shadow-ink/5"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent transition-opacity duration-300 group-hover:from-obsidian/95"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="inline-block rounded-full bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors group-hover:bg-gold-bright">
                    {item.title}
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
