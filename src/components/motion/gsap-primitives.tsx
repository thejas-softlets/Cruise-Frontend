"use client";

/**
 * GSAP scroll-animation primitives — the heavy-motion toolkit for the landing
 * page. Every primitive respects prefers-reduced-motion (falls back to a
 * static, fully-visible render) and animates only transform/opacity.
 */
import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power3.out"; // slow decel — the "clean resistance" curve
const DUR = 1.4; // heavy, slow reveals

/* ------------------------------------------------------------------ */
/* 1. SplitText-style headline reveal (word-by-word rise + blur)       */
/* ------------------------------------------------------------------ */
export function SplitHeadline({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    gsap.set(words, { yPercent: 120, opacity: 0, rotate: 2 });
    const tween = gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: DUR,
      ease: EASE,
      delay,
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: once ? "play none none none" : "play none none reverse" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, delay, once]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <span data-word className="inline-block will-change-transform">{w + "\u00A0"}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Fade-rise on scroll (replaces FadeIn for heavy sections)         */
/* ------------------------------------------------------------------ */
export function Rise({
  children,
  className,
  delay = 0,
  y = 64,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    gsap.set(el, { y, opacity: 0 });
    const tween = gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: DUR,
      ease: EASE,
      delay,
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, delay, y]);

  return <div ref={ref} className={className}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* 3. Stagger grid — children rise in sequence                         */
/* ------------------------------------------------------------------ */
export function StaggerGrid({
  children,
  className,
  duration = DUR,
  stagger = 0.14,
  y = 72,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const items = el.children;
    gsap.set(items, { y, opacity: 0 });
    const tween = gsap.to(items, {
      y: 0,
      opacity: 1,
      duration,
      ease: EASE,
      stagger,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, duration, stagger, y]);

  return <div ref={ref} className={className}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* 4. Scroll-scrubbed parallax (image drifts inside its clip)          */
/* ------------------------------------------------------------------ */
export function ParallaxLayer({
  children,
  className,
  speed = 0.18,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { yPercent: -speed * 100 },
      {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Curtain image reveal — clip-path wipes open, image scales down   */
/* ------------------------------------------------------------------ */
export function CurtainReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!wrap.current || !inner.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      })
        .fromTo(
          wrap.current,
          {
            clipPath: "inset(18% 6% 18% 6% round 32px)",
            opacity: 0.35,
            y: 40,
            scale: 0.94,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
          }
        )
        .fromTo(
          inner.current,
          { scale: 1.2, filter: "brightness(0.8)" },
          { scale: 1, filter: "brightness(1)", duration: 1.5, ease: "power2.out" },
          0
        );
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={wrap}
      className={cn("overflow-hidden will-change-[clip-path,transform,opacity]", className)}
      style={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
    >
      <div ref={inner} className="size-full will-change-[transform,filter]">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Unpinned horizontal scroll strip (natural sideways scroll/swipe) */
/* ------------------------------------------------------------------ */
export function HorizontalScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  panelSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    isDown.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className={cn(
        "relative flex w-full cursor-grab overflow-x-auto overflow-y-hidden pb-4 pt-2 select-none active:cursor-grabbing [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="flex shrink-0 items-stretch gap-4 px-5 sm:gap-6 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Scroll-scrubbed drift (large decorative elements)                */
/* ------------------------------------------------------------------ */
export function DriftScrub({
  children,
  className,
  distance = 120,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { y: distance / 2, rotate: rotate / 2 },
      {
        y: -distance / 2,
        rotate: -rotate / 2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.5 },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, distance, rotate]);

  return <div ref={ref} className={cn("will-change-transform", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* 8. Stat counter — counts up when scrolled into view                 */
/* ------------------------------------------------------------------ */
export function StatCounter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) {
      if (el) el.textContent = String(value);
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 2.4,
      ease: "power2.out",
      onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce, value]);

  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Magnetic button — cursor pull with springy return                */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, strength]);

  return <div ref={ref} className={cn("inline-block will-change-transform", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* 10. SVG line draw on scroll                                         */
/* ------------------------------------------------------------------ */
export function LineDraw({
  path,
  className,
  viewBox = "0 0 1200 120",
}: {
  path: string;
  className?: string;
  viewBox?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    const tween = gsap.to(el, {
      strokeDashoffset: 0,
      duration: 2.6,
      ease: "power2.inOut",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce]);

  return (
    <svg viewBox={viewBox} fill="none" className={className} aria-hidden>
      <path ref={ref} d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Section pin + content crossfade (Aqua-style chaptered reveal)   */
/* ------------------------------------------------------------------ */
export function PinFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0.15, scale: 0.965 },
      {
        opacity: 1,
        scale: 1,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 75%", end: "center center", scrub: 1.3 },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduce]);

  return <div ref={ref} className={cn("will-change-transform", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* 12b. Auto-gliding gallery — slow ambient drift, pauses on hover      */
/* ------------------------------------------------------------------ */
export function AutoGallery({
  children,
  className,
  baseDuration = 42,
}: {
  children: ReactNode;
  className?: string;
  baseDuration?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    const wrapEl = wrap.current;
    if (!el || reduce) return;
    const tween = gsap.to(el, { xPercent: -50, duration: baseDuration, ease: "none", repeat: -1 });
    tweenRef.current = tween;
    const pause = () => tween.pause();
    const play = () => tween.play();
    wrapEl?.addEventListener("mouseenter", pause);
    wrapEl?.addEventListener("mouseleave", play);
    return () => {
      wrapEl?.removeEventListener("mouseenter", pause);
      wrapEl?.removeEventListener("mouseleave", play);
      tween.kill();
    };
  }, [reduce, baseDuration]);

  return (
    <div ref={wrap} className={cn("overflow-hidden", className)}>
      <div ref={track} className="flex w-max items-stretch will-change-transform">
        <div className="flex items-stretch gap-6 pr-6">{children}</div>
        <div className="flex items-stretch gap-6 pr-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* 12c. Center-split doors — the screen parts from the middle, pinned.  */
/*      Aqua-style cinematic intro: two obsidian doors carry half a word */
/*      each, then slide apart on scroll to reveal the chapter beneath.  */
/* ------------------------------------------------------------------ */
export function SplitDoors({
  children,
  className,
  leftWord = "Kenyir",
  rightWord = "Lake",
}: {
  children: ReactNode;
  className?: string;
  leftWord?: string;
  rightWord?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !left.current || !right.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top", // fires only once the hero is fully out of screen
          end: "+=130%",
          pin: true,
          scrub: 1.2,
        },
      })
        // 0–0.07: doors hold closed for a beat after the hero fully clears
        .to(left.current, { xPercent: -102, duration: 0.93 }, 0.07)
        .to(right.current, { xPercent: 102, duration: 0.93 }, 0.07)
        .to("[data-door-word]", { opacity: 0, duration: 0.2 }, 0.07)
        .fromTo("[data-reveal-content]", { scale: 1.14 }, { scale: 1, duration: 0.93 }, 0.07)
        .fromTo(
          "[data-reveal-rise]",
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: EASE },
          0.4
        );
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  const doorBase = "absolute -top-2 -bottom-2 w-[calc(50%+4px)] overflow-hidden bg-obsidian will-change-transform border-0 outline-0 shadow-none";

  return (
    <div
      ref={ref}
      data-nav-transparent
      className={cn("relative h-screen-safe overflow-hidden bg-obsidian border-0 outline-0", className)}
    >
      <div data-reveal-content className="absolute inset-0 will-change-transform">
        {children}
      </div>
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <div ref={left} className={cn(doorBase, "left-0")}>
            <span
              data-door-word
              className="font-display absolute inset-y-0 right-0 flex items-center pr-[3vw] text-[13vw] font-medium leading-none tracking-tight text-white/95 select-none"
            >
              {leftWord}
            </span>
          </div>
          <div ref={right} className={cn(doorBase, "right-0")}>
            <span
              data-door-word
              className="font-display absolute inset-y-0 left-0 flex items-center pl-[3vw] text-[13vw] font-medium leading-none tracking-tight text-white/95 select-none"
            >
              {rightWord}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Infinite text marquee (scrub-optional, CSS-free via GSAP)       */
/* ------------------------------------------------------------------ */
export function GsapMarquee({
  items,
  className,
  baseDuration = 28,
}: {
  items: string[];
  className?: string;
  baseDuration?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el || reduce) return;
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: baseDuration,
      ease: "none",
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reduce, baseDuration]);

  const row = [...items, ...items];
  return (
    <div className={cn("overflow-hidden", className)} aria-hidden>
      <div ref={track} className="flex w-max items-center gap-10 will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {item}
            <svg viewBox="0 0 24 24" className="size-3 fill-current"><circle cx="12" cy="12" r="4" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}
