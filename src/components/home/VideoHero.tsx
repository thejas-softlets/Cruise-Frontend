"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";

const VIDEO_SRC = "/videos/sc-hero.mp4";
const POSTER = "/images/vessels/sc-hero.webp";

/**
 * Cinematic video hero — ambient looping background film,
 * bottom-left luxury serif statement:
 * "Tasik Kenyir · Terengganu · Malaysia"
 * "Kenyir Lake Cruises"
 * with bottom-centered video play/pause toggle.
 */
export function VideoHero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const reduce = useReducedMotion();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Entrance choreography
  useEffect(() => {
    if (!root.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .fromTo(
          "[data-hero-eyebrow]",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" }
        )
        .fromTo(
          "[data-hero-word]",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          "-=0.9"
        )
        .fromTo(
          "[data-hero-cue]",
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power1.out" },
          "-=0.4"
        );

      // Scroll-out parallax: content drifts up & fades as you leave the hero
      gsap.to(content.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: 1.2 },
      });
      // Poster/video slow zoom for the "alive" feel
      gsap.fromTo("[data-hero-media]", { scale: 1.1 }, { scale: 1, duration: 6, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen-safe flex-col justify-end overflow-hidden bg-obsidian text-white"
    >
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
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/25 to-obsidian/40" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_45%,rgba(12,43,51,0.45)_100%)]" />
      </div>

      {/* ── Content (Bottom-left aligned editorial text) ── */}
      <div
        ref={content}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-28 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
      >
        <p
          data-hero-eyebrow
          className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-soft/90 sm:text-[0.75rem]"
        >
          Tasik Kenyir · Terengganu · Malaysia
        </p>

        <h1 className="font-display mt-3 text-[clamp(3.3rem,13.5vw,4.5rem)] font-medium leading-[0.96] tracking-tight text-white sm:mt-4 sm:whitespace-nowrap sm:text-[clamp(2.2rem,6.5vw,6.5rem)] sm:leading-[1.02] lg:text-[clamp(2.6rem,7.5vw,7.5rem)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
          <span aria-label="Kenyir Lake Cruises" className="sr-only">
            Kenyir Lake Cruises
          </span>
          <span aria-hidden className="block">
            <span data-hero-word className="block sm:inline">
              Kenyir Lake{" "}
            </span>
            <span data-hero-word className="block sm:inline">
              Cruises
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom video play/pause toggle button */}
      <div data-hero-cue className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
          className="flex size-10 items-center justify-center text-white/70 transition-colors duration-300 hover:text-white"
        >
          {isPlaying ? (
            <Pause className="size-5 stroke-[1.5]" aria-hidden />
          ) : (
            <Play className="size-5 stroke-[1.5] translate-x-0.5" aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
