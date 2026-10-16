"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Portal } from "@/components/ui/Portal";

import type { Package } from "@/types";
import { Link } from "@/lib/i18n/navigation";
import { formatPrice } from "@/lib/format";

interface VesselInfo {
  id: "summer-cruise" | "green-horizon";
  name: "Summer Cruise" | "Green Horizon";
  image: string;
  alt: string;
  meetingPoint: string;
  boardingPoint: string;
}

type PackageSlug = "3d2n-kenyir-explorer" | "4d3n-kenyir-grand-voyage";
type VesselId = "summer-cruise" | "green-horizon";

const VESSEL_DATA: Record<VesselId, VesselInfo> = {
  "summer-cruise": {
    id: "summer-cruise",
    name: "Summer Cruise",
    image: "/images/page-heroes/hero-packages.webp",
    alt: "Summer Cruise navigating through emerald bays of Tasik Kenyir",
    meetingPoint:
      "We provide Land transfer from TGG Airport, MBKT Bus station, Ming Paragon Hotel & Sri Malaysia Hotel, Kampung Cina.",
    boardingPoint: "Gawi Jetty, Pangkalan Gawi",
  },
  "green-horizon": {
    id: "green-horizon",
    name: "Green Horizon",
    image: "/images/real/about-1-Green-Horizon_summer-cruise.webp",
    alt: "Green Horizon luxury Lake Cruise on Kenyir Lake",
    meetingPoint:
      "We provide Land transfer from TGG Airport, MBKT Bus Station, Ming Paragon Hotel",
    boardingPoint: "Gawi Jetty, Pangkalan Gawi",
  },
};

const DURATION_PILLS: { slug: PackageSlug; label: string }[] = [
  { slug: "3d2n-kenyir-explorer", label: "3D2N" },
  { slug: "4d3n-kenyir-grand-voyage", label: "4D3N" },
];

export function DualVoyagesSection({ packages }: { packages: Package[] }) {
  const [activePackageSlug, setActivePackageSlug] =
    useState<PackageSlug>("3d2n-kenyir-explorer");
  const [activeVesselId, setActiveVesselId] =
    useState<VesselId>("summer-cruise");
  const [showMapModal, setShowMapModal] = useState(false);

  const activePackage = packages.find((p) => p.slug === activePackageSlug);
  const activeVessel = VESSEL_DATA[activeVesselId];

  useEffect(() => {
    if (!showMapModal) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMapModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [showMapModal]);

  if (!activePackage) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">
            03 — Packages &amp; Charters
          </p>
          <Link
            href="/packages"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-teal-deep/25 bg-teal-deep/5 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep transition-all duration-300 hover:bg-teal-deep hover:text-white shadow-xs"
          >
            Packages Detailed Page →
          </Link>
        </div>
        <h2 className="font-display mt-1 w-full max-w-none text-[clamp(1.6rem,3.2vw,3.2rem)] font-medium leading-tight tracking-tight text-ink whitespace-normal lg:whitespace-nowrap">
          Unforgettable Kenyir Lake Cruise Packages.
        </h2>
      </div>

      {/* PRIMARY — Segmented Package Switcher (both cruises share every package) */}
      <div className="mt-7 flex justify-center">
        <div className="inline-flex rounded-2xl border border-black/5 bg-black/[0.04] p-1.5 shadow-inner">
          {packages.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActivePackageSlug(p.slug as PackageSlug)}
              className={`rounded-xl px-5 py-3 text-sm sm:px-7 sm:text-base font-medium transition-all duration-300 ${
                activePackageSlug === p.slug
                  ? "bg-obsidian text-white shadow-md shadow-obsidian/20"
                  : "text-ink/75 hover:bg-white/60 hover:text-ink"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Luxury Package Card — the package is the hero, vessel is secondary */}
      <div className="mt-8 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-black/5 bg-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-obsidian/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePackageSlug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12"
          >
            {/* Left Column: Selected Vessel Image + Amenities */}
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-[#0e1d22] shadow-lg lg:col-span-6 flex flex-col">
              <div className="relative w-full overflow-hidden group aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[340px]">
                <img
                  src={activeVessel.image}
                  alt={activeVessel.alt}
                  className="size-full object-cover object-center transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#0e1d22]/40 via-transparent to-black/10 pointer-events-none"
                />

                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                  <span className="inline-flex items-center rounded-full bg-obsidian/85 px-3.5 py-1.5 text-[0.65rem] sm:text-xs font-semibold tracking-wide text-white backdrop-blur-md border border-white/15 shadow-sm">
                    {activePackage.title}
                  </span>
                </div>
                <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3.5 py-1.5 text-[0.65rem] sm:text-xs font-medium tracking-wide text-white backdrop-blur-md border border-white/15 shadow-sm">
                    aboard {activeVessel.name}
                  </span>
                </div>
              </div>

              {/* Amenities Highlights Bar */}
              <div className="p-4 sm:p-5 text-white">
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-white/10 text-white/95 mb-1">
                      <BedIcon className="size-3.5 sm:size-4" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-medium text-white/90">Stay</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-white/10 text-white/95 mb-1">
                      <ExploreIcon className="size-3.5 sm:size-4" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-medium text-white/90">Explore</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-white/10 text-white/95 mb-1">
                      <ActivitiesIcon className="size-3.5 sm:size-4" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-medium text-white/90">Activities</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-white/10 text-white/95 mb-1">
                      <FoodIcon className="size-3.5 sm:size-4" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-medium text-white/90">Food</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-white/10 text-white/95 mb-1">
                      <TeaIcon className="size-3.5 sm:size-4" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-medium text-white/90">Tea</span>
                  </div>
                </div>
                <p className="mt-3 border-t border-white/10 pt-2.5 text-center text-[0.7rem] sm:text-xs font-light tracking-wide text-white/80">
                  Marvel views at the stunning scenery of Kenyir Lake.
                </p>
              </div>
            </div>

            {/* Right Panel: Package Content */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                {/* Eyebrow + Duration Pills */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-teal-deep">
                      The Package
                    </p>
                    <h3 className="font-display mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
                      {activePackage.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {DURATION_PILLS.map((pill) => (
                      <button
                        key={pill.slug}
                        type="button"
                        onClick={() => setActivePackageSlug(pill.slug)}
                        aria-pressed={activePackageSlug === pill.slug}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                          activePackageSlug === pill.slug
                            ? "border-obsidian bg-obsidian text-white"
                            : "border-ink/20 text-ink hover:border-obsidian hover:text-obsidian"
                        }`}
                      >
                        <MoonIcon className="size-3.5 fill-current opacity-70" />
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price + Duration */}
                <p className="mt-3 text-sm font-semibold text-ink sm:text-base">
                  {activePackage.customPriceLabel ? (
                    <span className="text-teal-deep">{activePackage.customPriceLabel}</span>
                  ) : (
                    <>
                      {activePackage.durationLabel} · from{" "}
                      <span className="text-teal-deep">
                        {formatPrice(activePackage.fromPriceMYR)}
                      </span>{" "}
                      per guest (full board)
                    </>
                  )}
                </p>

                {/* Highlights */}
                <ul className="mt-4 space-y-2">
                  {activePackage.highlights.slice(0, 4).map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-teal-deep" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Secondary — Choose your cruise */}
                <div className="mt-5 rounded-2xl border border-gray-200/80 bg-[#f8fafc] p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-semibold text-ink">
                    Choose your cruise — {activePackage.title} sails on both vessels
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {(Object.keys(VESSEL_DATA) as VesselId[]).map((vid) => (
                      <button
                        key={vid}
                        type="button"
                        onClick={() => setActiveVesselId(vid)}
                        aria-pressed={activeVesselId === vid}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                          activeVesselId === vid
                            ? "border-obsidian bg-obsidian text-white shadow-md shadow-obsidian/20"
                            : "border-black/10 bg-white text-ink/80 hover:border-obsidian hover:text-obsidian"
                        }`}
                      >
                        <ShipIcon className="size-4 shrink-0" />
                        {VESSEL_DATA[vid].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logistics (vessel-specific) */}
                <div className="mt-5 rounded-2xl border border-gray-200/80 bg-[#f8fafc] p-4 sm:p-5">
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-obsidian text-white">
                        <MeetingIcon className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink">Meeting Point</h4>
                        <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-text-muted">
                          {activeVessel.meetingPoint}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-gray-200/70 pt-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-obsidian text-white">
                        <PinIcon className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink">Boarding / De-boarding Point</h4>
                        <p className="mt-0.5 text-xs sm:text-sm text-text-muted">
                          {activeVessel.boardingPoint}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="group inline-flex min-h-9 items-center gap-2 text-xs sm:text-sm font-medium text-ink transition-colors hover:text-teal-deep"
                >
                  <PinIcon className="size-4 text-teal-deep transition-transform duration-300 group-hover:scale-110" />
                  <span>Voyage Map</span>
                </button>

                <Link
                  href={`/packages/${activePackage.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-obsidian px-6 py-3.5 text-xs sm:w-auto sm:text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-teal hover:shadow-lg hover:scale-[1.02]"
                >
                  <span>Explore Package</span>
                  <span aria-hidden className="text-base leading-none">↗</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Voyage Map Modal Lightbox rendered via Portal */}
      <AnimatePresence>
        {showMapModal && (
          <Portal>
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-sm w-screen h-screen overflow-y-auto"
              onClick={() => setShowMapModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-auto"
              >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink">
                    {activePackage.title} — Voyage Route
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Tasik Kenyir Navigation Chart & Primary Anchorages
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-ink hover:bg-gray-200"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src="/images/lake/kenyir-map-render.webp"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/lake/kenyir-shoreline.webp";
                    }}
                    alt="Tasik Kenyir Navigation Route Map"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-soft">
                      Departure: Pengkalan Gawi Jetty
                    </p>
                    <p className="text-sm font-light text-white/90">
                      Anchorages: Lasir Waterfall · Bewah Cave · Saok Falls · Kelah Sanctuary
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-text-muted">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <span className="font-semibold text-ink">Check-in Terminal:</span>
                    <p className="mt-0.5">Pengkalan Gawi Passenger Hub (Transfer Available)</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <span className="font-semibold text-ink">Waterway Coverage:</span>
                    <p className="mt-0.5">Central Basin, Southern Canyons & Waterfall Bays</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/packages/${activePackage.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-obsidian px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal"
                  >
                    View Detailed Itinerary ↗
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
      </AnimatePresence>
    </section>
  );
}

/* ========================================================================= */
/* Custom SVG Icons matching the reference UI                                 */
/* ========================================================================= */

function BedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v3M10 8v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExploreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ActivitiesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M2 16c2 1 4-1 6 0s4 1 6 0 4-1 6 0M2 20c2 1 4-1 6 0s4 1 6 0 4-1 6 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8M6 7h12M6 10h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FoodIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M18 10V6a2 2 0 0 0-2-2h-3v6h5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 14a6 6 0 0 1 12 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 2c1 2 1 3 0 4M10 2c1 2 1 3 0 4M14 2c1 2 1 3 0 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MeetingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M8 4l4 4-4 4M16 4l-4 4 4 4M8 20l4-4-4-4M16 20l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden>
      <path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" strokeLinecap="round" />
      <path d="M4 16l1.2-7h8.6L15 16M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M6 13h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}