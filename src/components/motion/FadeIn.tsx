"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Buttery scroll reveal: rise + de-blur with an expo ease. Runs once per
 * element; reduced motion renders fully static (no hidden states).
 */
export function FadeIn({
  children,
  delay = 0,
  className,
  y = 28,
  blur = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduce, delay, y, blur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
