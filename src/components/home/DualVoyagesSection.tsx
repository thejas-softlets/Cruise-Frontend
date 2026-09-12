"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";

interface CruisePackageInfo {
  id: "summer-cruise" | "green-horizon";
  name: "Summer Cruise" | "Green Horizon";
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  packageSlug: string;
  meetingPoint: string;
  boardingPoint: string;
  checkIn: string;
  checkOut3D2N: string;
  checkOut4D3N: string;
}

const CRUISE_DATA: Record<"summer-cruise" | "green-horizon", CruisePackageInfo> = {
  "summer-cruise": {
    id: "summer-cruise",
    name: "Summer Cruise",
    subtitle: "Explore Kenyir Lake with Summercruise",
    description:
      "Admire the breathtaking views of kenyir lake and take advantage of a range of water activities during your visit.",
    image: "/images/page-heroes/hero-packages.webp",
    alt: "Summer Cruise navigating through emerald bays of Tasik Kenyir",
    packageSlug: "/packages/3d2n-kenyir-explorer",
    meetingPoint:
      "We provide Land transfer from TGG Airport, MBKT Bus station, Ming Paragon Hotels & Sri Malaysia Hotel, Kampung Cina.",
    boardingPoint: "Gawi Jetty, Pangkalan Gawi",
    checkIn: "12:00PM (Friday / Monday)",
    checkOut3D2N: "04:00PM(Sunday / Wednesday)",
    checkOut4D3N: "11:00AM(Monday / Thursday)",
  },
  "green-horizon": {
    id: "green-horizon",
    name: "Green Horizon",
    subtitle: "Explore Kenyir Lake with Green Horizon",
    description:
      "Admire the breathtaking views of kenyir lake and take advantage of a range of water activities during your visit.",
    image: "/images/real/about-1-Green-Horizon_summer-cruise.webp",
    alt: "Green Horizon luxury houseboat on Kenyir Lake",
    packageSlug: "/packages/4d3n-kenyir-grand-voyage",
    meetingPoint:
      "We provide Land transfer from TGG Aiport, MBKT Bus Station, Ming Paragon Hotel",
    boardingPoint: "Gawi Jetty, Pangkalan Gawi",
    checkIn: "12:00PM (Friday / Monday)",
    checkOut3D2N: "01:00PM(Sunday / Wednesday)",
    checkOut4D3N: "11:00AM(Monday / Thursday)",
  },
};

export function DualVoyagesSection() {
  const [activeTab, setActiveTab] = useState<"summer-cruise" | "green-horizon">("summer-cruise");
  const [showMapModal, setShowMapModal] = useState(false);

  const activeCruise = CRUISE_DATA[activeTab];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal-deep">05 — Voyages</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Choose your days on the lake
          </h2>
        </div>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep transition-colors hover:text-ink"
        >
          All packages →
        </Link>
      </div>

      {/* Segmented Vessel Switcher */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-2xl border border-black/5 bg-black/[0.04] p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("summer-cruise")}
            className={`relative rounded-xl px-7 py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === "summer-cruise"
                ? "bg-obsidian text-white shadow-md shadow-obsidian/20"
                : "text-ink/75 hover:bg-white/60 hover:text-ink"
            }`}
          >
            Summer Cruise
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("green-horizon")}
            className={`relative rounded-xl px-7 py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === "green-horizon"
                ? "bg-obsidian text-white shadow-md shadow-obsidian/20"
                : "text-ink/75 hover:bg-white/60 hover:text-ink"
            }`}
          >
            Green Horizon
          </button>
        </div>
      </div>

      {/* Main Luxury Package Card */}
      <div className="mt-8 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-black/5 bg-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-obsidian/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
          >
            {/* Left Column: Unified Media & Amenities Card */}
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-[#0e1d22] shadow-lg lg:col-span-6 flex flex-col">
              {/* Photo Showcase Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden group">
                <img
                  src={activeCruise.image}
                  alt={activeCruise.alt}
                  className="size-full object-cover object-center transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#0e1d22]/40 via-transparent to-black/10 pointer-events-none"
                />

                {/* Vessel Badge without dot */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                  <span className="inline-flex items-center rounded-full bg-obsidian/85 px-3.5 py-1.5 text-[0.65rem] sm:text-xs font-semibold tracking-wide text-white backdrop-blur-md border border-white/15 shadow-sm">
                    {activeCruise.name}
                  </span>
                </div>
              </div>

              {/* Luxury Amenities & Scenery Highlights Bar (Seamlessly Attached) */}
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

            {/* Right Information & Schedule Panel */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                {/* Header Title + Duration Pills */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
                    Leisure Package
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink">
                      <MoonIcon className="size-3.5 fill-current text-ink/70" />
                      3D2N
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink">
                      <MoonIcon className="size-3.5 fill-current text-ink/70" />
                      4D3N
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="mt-2 text-base font-semibold text-teal-deep sm:text-lg">
                  {activeCruise.subtitle}
                </p>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {activeCruise.description}
                </p>

                {/* Logistics Items */}
                <div className="mt-6 space-y-4">
                  {/* Meeting Point */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-obsidian text-white">
                      <MeetingIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink">Meeting Point</h4>
                      <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-text-muted">
                        {activeCruise.meetingPoint}
                      </p>
                    </div>
                  </div>

                  {/* Boarding Point */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-obsidian text-white">
                      <PinIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink">Boarding / De-boarding Point</h4>
                      <p className="mt-0.5 text-xs sm:text-sm text-text-muted">
                        {activeCruise.boardingPoint}
                      </p>
                    </div>
                  </div>

                  {/* Check-in / Check-out Matrix */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-gray-200/80 bg-[#f8fafc] p-4 sm:p-5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-obsidian text-white">
                      <CheckCircleIcon className="size-5" />
                    </div>
                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink">Check-in</h4>
                        <p className="mt-1 text-xs sm:text-sm text-text-muted">
                          {activeCruise.checkIn}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink">Check-out</h4>
                        <div className="mt-1.5 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-block rounded-full border border-teal-deep/30 bg-teal/10 px-2 py-0.5 text-[0.65rem] font-bold text-teal-deep">
                              3D2N
                            </span>
                            <span className="text-xs sm:text-sm text-text-muted">
                              {activeCruise.checkOut3D2N}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block rounded-full border border-teal-deep/30 bg-teal/10 px-2 py-0.5 text-[0.65rem] font-bold text-teal-deep">
                              4D3N
                            </span>
                            <span className="text-xs sm:text-sm text-text-muted">
                              {activeCruise.checkOut4D3N}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-ink transition-colors hover:text-teal-deep"
                >
                  <PinIcon className="size-4 text-teal-deep transition-transform duration-300 group-hover:scale-110" />
                  <span>Voyage Map</span>
                </button>

                <Link
                  href={activeCruise.packageSlug}
                  className="inline-flex items-center gap-2 rounded-xl bg-obsidian px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-teal hover:shadow-lg hover:scale-[1.02]"
                >
                  <span>Explore Package</span>
                  <span aria-hidden className="text-base leading-none">↗</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Voyage Map Modal Lightbox */}
      <AnimatePresence>
        {showMapModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/75 p-4 backdrop-blur-sm"
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink">
                    {activeCruise.name} — Voyage Route
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
                      // Fallback if specific render isn't there
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
                    href={activeCruise.packageSlug}
                    className="inline-flex items-center gap-2 rounded-xl bg-obsidian px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal"
                  >
                    View Detailed Itinerary ↗
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
