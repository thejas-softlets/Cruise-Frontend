"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll synced to GSAP's ticker (the current SSR-safe pattern),
 * so ScrollTriggers and Lenis share one clock. Gated on reduced motion —
 * native instant scroll is the respectful reduced state.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.09, // slightly heavier = more buttery glide
      anchors: { offset: -96 },
    });

    const syncGsap = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(syncGsap);
    gsap.ticker.lagSmoothing(0);

    // Refresh triggers once fonts settle so pinned/measured sections are exact.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(syncGsap);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
