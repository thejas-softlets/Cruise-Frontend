"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/gsap-primitives";

const VIDEO_SRC = "/videos/sc-hero.mp4";
const POSTER = "/images/vessels/sc-hero.webp";

/**
 * Cinematic video hero — native ambient looping 1080p film background,
 * masked headline word-rise, magnetic CTAs, animated stat counters,
 * and a scroll cue with zero external player UI or control flashes.
 */
export function VideoHero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Entrance choreography
  useEffect(() => {
    if (!root.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .fromTo("[data-hero-eyebrow]", { y: 40, opacity: 0, letterSpacing: "0.6em" }, { y: 0, opacity: 1, letterSpacing: "0.32em", duration: 1.6, ease: "power3.out" })
        .fromTo("[data-hero-word]", { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power4.out", stagger: 0.12 }, "-=1.1")
        .fromTo("[data-hero-cta]", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: EASE_OUT, stagger: 0.1 }, "-=0.8")
        .fromTo("[data-hero-cue]", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.out" }, "-=0.4");

      // Scroll-out parallax: content drifts up & fades as you leave the hero
      gsap.to(content.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: 1.2 },
      });
      // Poster/video slow zoom for the "alive" feel
      gsap.fromTo("[data-hero-media]", { scale: 1.12 }, { scale: 1, duration: 6, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={root} className="relative flex min-h-screen-safe flex-col overflow-hidden bg-obsidian text-white">
      {/* ── Media layer ── */}
      <div data-hero-media className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={POSTER}
          preload="auto"
          className="size-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Cinematic scrims: lagoon gradient bottom, whisper of top dark for nav legibility */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/15 to-obsidian/25" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_45%,rgba(12,43,51,0.45)_100%)]" />
      </div>

      {/* ── Content ── */}
      <div ref={content} className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-24 pt-40 sm:px-8 sm:pb-28">
        <p data-hero-eyebrow className="text-[0.75rem] font-semibold uppercase tracking-[0.32em] text-teal-soft/90">
          Tasik Kenyir · Terengganu · Malaysia
        </p>

        <h1 className="font-display mt-5 whitespace-normal text-[clamp(2.4rem,10.5vw,7.5rem)] font-medium leading-[0.98] tracking-tight text-white xl:whitespace-nowrap">
          <span aria-label="Kenyir Lake Cruises" className="sr-only">Kenyir Lake Cruises</span>
          <span aria-hidden className="block overflow-hidden">
            <span data-hero-word className="block">Kenyir&nbsp;Lake&nbsp;Cruises</span>
          </span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div data-hero-cta>
            <Magnetic>
              <Button href="/packages" size="lg" className="bg-teal hover:bg-white hover:text-obsidian">
                Book Your Voyage
              </Button>
            </Magnetic>
          </div>
          <div data-hero-cta>
            <Magnetic>
              <Button href="/vessels" size="lg" variant="ghostLight">
                Explore the Fleet
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-cue className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <ChevronDown className="size-6 animate-bounce text-white/60" aria-hidden />
      </div>
    </section>
  );
}

const EASE_OUT = "power3.out";
