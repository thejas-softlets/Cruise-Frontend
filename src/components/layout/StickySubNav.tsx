"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface SubNavItem {
  id: string;
  label: string;
}

/**
 * Sticky anchor sub-nav for Tier 4 detail pages (§11.5), with a shared
 * layoutId underline (§12) and IntersectionObserver scroll-spy.
 */
export function StickySubNav({ items }: { items: SubNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-ink/10 bg-[#faf9f6]/90 px-4 backdrop-blur-md print:hidden">
      <nav aria-label="Section" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-1.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "font-secondary relative whitespace-nowrap px-3.5 py-2.5 text-[0.875rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
              active === item.id ? "text-ink" : "text-text-muted hover:text-ink",
            )}
          >
            {active === item.id && (
              <motion.span
                layoutId="subnav-underline"
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-bright"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
