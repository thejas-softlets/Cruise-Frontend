"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Buttery Lenis smooth scroll synced into GSAP's ticker so ScrollTrigger
 * animations scrub against the eased scroll position with zero double-smoothing.
 * Under prefers-reduced-motion both are disabled entirely (native scroll).
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.65, // heavier resistance — long glide, strong decel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.78, // more drag per wheel tick
      touchMultiplier: 1.05,
    });

    // Single RAF source: GSAP's ticker drives Lenis (never two loops —
    // double-raf'ing makes Lenis step twice per frame = visible jitter).
    const syncGsap = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(syncGsap);
    gsap.ticker.lagSmoothing(0);

    // Images decoding late change layout heights — re-measure pinned sections.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad, { once: true });

    // Ensure route navigation always resets to the top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    lenis.scrollTo(0, { immediate: true });

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(syncGsap);
      lenis.destroy();
    };
  }, [reduce]);

  // Recalculate pinned/parallax triggers and reset scroll position on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const id = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      if (!reduce) {
        ScrollTrigger.refresh();
      }
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname, reduce]);

  return null;
}
