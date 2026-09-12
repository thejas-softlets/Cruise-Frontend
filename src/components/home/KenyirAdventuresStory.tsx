"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";

export function KenyirAdventuresStory() {
  return (
    <section id="overview" className="relative scroll-mt-28 bg-[#faf9f6] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Collage — Organic geometric arched shapes */}
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-4">
                {/* Left column shapes */}
                <div className="flex flex-col gap-4">
                  {/* Top arched pill */}
                  <div className="relative h-56 w-full overflow-hidden rounded-t-full rounded-b-2xl shadow-xl shadow-ink/8 sm:h-64">
                    <Image
                      src="/images/real/DSC07724-1.webp"
                      alt="Hiker walking across suspension bridge overlooking Lake Kenyir"
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Bottom curved shape */}
                  <div className="relative h-44 w-full overflow-hidden rounded-b-full rounded-t-2xl shadow-xl shadow-ink/8 sm:h-52">
                    <Image
                      src="/images/real/495.webp"
                      alt="Exploring prehistoric limestone cave chambers in Kenyir"
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Right column: Tall oval pill */}
                <div className="relative flex items-center pt-8 sm:pt-12">
                  <div className="relative h-[22rem] w-full overflow-hidden rounded-full shadow-xl shadow-ink/8 sm:h-[26rem]">
                    <Image
                      src="/images/real/DSC07934-scaled.webp"
                      alt="Red kayak paddling across pristine Lake Kenyir waters"
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column — Editorial Story */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.15}>
              <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
                Kenyir Lake Adventures
              </h2>
              <p className="mt-4 font-serif text-lg italic text-ink/85 sm:text-xl">
                &ldquo;Embark on an Unforgettable Cruise Experience at Kenyir Lake&rdquo;
              </p>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
                <p>
                  Set sail on an extraordinary journey through Kenyir Lake, a hidden gem nestled within
                  Malaysia&apos;s most biodiverse rainforest. This serene haven, often called the &lsquo;natural paradise&rsquo;,
                  is home to an astounding variety of flora and fauna, making it a must-visit destination for nature
                  enthusiasts and adventurers alike.
                </p>
                <p>
                  With over 340 islands, cascading waterfalls, and lush tropical rainforests, Kenyir Lake, the largest
                  man-made lake in Southeast Asia, promises endless discoveries and breathtaking scenery. It&apos;s a sanctuary
                  where new species are continually being discovered, adding to the region&apos;s rich biodiversity.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/the-lake"
                  className="font-secondary inline-flex min-h-12 items-center gap-2 rounded-full bg-obsidian px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-gold-bright"
                >
                  About Kenyir Lake
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* GPS Coordinates accent */}
        <div className="mt-20 text-center">
          <p className="font-mono text-xs font-medium tracking-[0.28em] text-ink/40">
            5°00&apos;26.9&quot;N 102°37&apos;31.7&quot;E
          </p>
        </div>
      </div>
    </section>
  );
}
