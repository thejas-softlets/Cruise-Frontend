"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ExperienceItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  description?: string;
  href?: string;
}

interface Props {
  items: ExperienceItem[];
  className?: string;
}

export function ExperiencesInfiniteMarquee({ items, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const rafId = useRef<number | null>(null);

  // Repeat items 3 times for seamless infinite wrapping
  const repeatedItems = [...items, ...items, ...items];

  // Continuous auto-scroll loop with bidirectional infinite wrap — NEVER pauses on hover
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Center scroll on middle set initially
    const setInitialScroll = () => {
      if (el.scrollWidth > 0) {
        const singleSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft === 0) {
          el.scrollLeft = singleSetWidth;
        }
      }
    };
    const timer = setTimeout(setInitialScroll, 120);

    const speed = 0.65; // smooth ambient drift speed in px/frame

    const step = () => {
      if (el && el.scrollWidth > 0) {
        const singleSetWidth = el.scrollWidth / 3;

        // Continue movement continuously — only pause if actively dragging with pointer held down
        if (!isDraggingRef.current && !reduce) {
          el.scrollLeft += speed;
        }

        // Seamless wrap in both directions
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 2) {
          el.scrollLeft += singleSetWidth;
        }
      }
      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reduce]);

  // Pointer drag handling (mouse & touch)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX;
    scrollStartRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const delta = e.pageX - startXRef.current;
    dragDistanceRef.current = Math.abs(delta);
    el.scrollLeft = scrollStartRef.current - delta;
  };

  const onPointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Button scroll controls
  const scrollStep = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative w-full overflow-hidden select-none", className)}>
      {/* Top action row with scroll indicator and left/right controls */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted/80">
          Drag or swipe to explore →
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollStep("left")}
            aria-label="Scroll left"
            className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-xs transition-all hover:border-teal hover:bg-teal hover:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollStep("right")}
            aria-label="Scroll right"
            className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-xs transition-all hover:border-teal hover:bg-teal hover:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Marquee Track Container */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        className={cn(
          "flex overflow-x-auto scrollbar-none will-change-transform py-4",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "auto",
        }}
      >
        <div ref={trackRef} className="flex shrink-0 items-stretch gap-5 sm:gap-6 pl-5 sm:pl-8 pr-5 sm:pr-8">
          {repeatedItems.map((item, index) => {
            const href = item.href ?? "/experiences";
            return (
              <div
                key={`${item.id}-${index}`}
                className="group relative h-[420px] w-[82vw] shrink-0 overflow-hidden rounded-[2rem] sm:h-[460px] sm:w-[45vw] lg:h-[480px] lg:w-[28vw] shadow-md transition-all duration-500 hover:shadow-2xl"
              >
                <Link
                  href={href}
                  onClick={(e) => {
                    // Prevent accidental click when dragging
                    if (dragDistanceRef.current > 8) {
                      e.preventDefault();
                    }
                  }}
                  className="block size-full"
                >
                  {/* Photo */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-[2.2s] ease-out group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Editorial scrim */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/30 to-black/15 transition-opacity duration-500 group-hover:from-obsidian/90"
                  />

                  {/* Category Tag Badge */}
                  <div className="absolute left-5 top-5 z-10">
                    <span className="inline-block rounded-full border border-white/25 bg-black/40 px-3.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  {/* Bottom Content Info */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-medium leading-tight text-white tracking-tight sm:text-3xl drop-shadow-sm">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-xs sm:text-sm font-light leading-relaxed text-white/80">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-teal group-hover:bg-teal">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
