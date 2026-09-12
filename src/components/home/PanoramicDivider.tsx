"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion";

export function PanoramicDivider() {
  return (
    <section className="relative overflow-hidden bg-obsidian py-32 text-center sm:py-40">
      <Image
        src="/images/real/DJI_0117-min-scaled.webp"
        alt="Panoramic aerial view of Lake Kenyir tropical rainforest islands"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-obsidian/60 backdrop-blur-[1px]"
      />

      <FadeIn className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
          Enjoy Nature, Be Part Of Nature
        </h2>
        <p className="mt-4 font-serif text-lg italic text-gold sm:text-xl">
          Summer Cruise in Kenyir Lake
        </p>
      </FadeIn>
    </section>
  );
}
