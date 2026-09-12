"use client";

import { useTranslations } from "next-intl";

const ANCHORS = [
  { href: "#overview", key: "overview", label: "OVERVIEW" },
  { href: "#cruises", key: "cruises", label: "OUR CRUISES" },
  { href: "#packages", key: "packages", label: "PACKAGES & SCHEDULES" },
  { href: "#excursions", key: "excursions", label: "EXCURSIONS & ACTIVITIES" },
  { href: "#travel-guide", key: "travelGuide", label: "TRAVEL GUIDE" },
] as const;

export function HeroAnchorStrip() {
  const t = useTranslations("home");

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Section anchors"
      className="sticky top-16 z-30 border-y border-white/10 bg-obsidian/95 py-3.5 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 overflow-x-auto px-4 sm:gap-8 sm:px-8">
        {ANCHORS.map((anchor) => (
          <a
            key={anchor.href}
            href={anchor.href}
            onClick={(e) => scrollTo(e, anchor.href)}
            className="font-secondary whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-gold sm:text-xs"
          >
            {anchor.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
