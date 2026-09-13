"use client";

import { useState } from "react";
import { Sparkles, Bookmark, Ship, ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react";
import type { Package, Vessel } from "@/types";
import { formatPrice } from "@/lib/format";
import { getDepartureDates, type DepartureDate } from "@/lib/departure-dates";
import { DynamicCruiseMap } from "./DynamicCruiseMap";
import { MOCK_WAYPOINTS } from "@/lib/api/mock/booking";

interface AvailableCruisesListProps {
  packages: Package[];
  vessels: Vessel[];
  vesselFilter: string;
  selectedMonth: { year: number; month: number } | null;
  adults: number;
  childrenCount: number;
  onSelectSailing: (pkg: Package, vessel: Vessel, date: DepartureDate) => void;
}

const VESSEL_SPECS: Record<string, { guests: number; crew: number; cabins: number; highlights: string[] }> = {
  "summer-cruise": {
    guests: 24,
    crew: 10,
    cabins: 12,
    highlights: [
      "Luxurious cabins from 14 to 22 sqm including two Master Suites",
      "Comfortable King-sized/double bed or family configurations",
      "Deluxe private en suite bathroom with hot freshwater showers",
      "Panoramic lake-view windows or private balconies",
      "Full board dining: authentic Terengganu & international cuisine",
      "Fully air-conditioned staterooms & karaoke lounge",
    ],
  },
  "green-horizon": {
    guests: 60,
    crew: 14,
    cabins: 15,
    highlights: [
      "Luxury suites from 17 to 26 sqm including signature Premium Panorama suites",
      "Private walk-out balconies overlooking emerald lake bays",
      "Deluxe private en suite bathrooms with organic amenities",
      "Spacious dining saloon, open-air sun deck & karaoke lounge",
      "Full board dining with afternoon tea & sunset canapés",
      "Full central air-conditioning across all accommodation decks",
    ],
  },
};

export function AvailableCruisesList({
  packages,
  vessels,
  vesselFilter,
  selectedMonth,
  onSelectSailing,
}: AvailableCruisesListProps) {
  const [itineraryModalPkg, setItineraryModalPkg] = useState<Package | null>(null);
  const [expandedDatesPkg, setExpandedDatesPkg] = useState<string | null>(null);

  // Generate departure dates
  const allDepartures = getDepartureDates({ limit: 16 });

  // Filter departures by month if user chose a month
  const filteredDepartures = selectedMonth
    ? allDepartures.filter((d) => {
        const dateObj = new Date(d.iso);
        return dateObj.getFullYear() === selectedMonth.year && dateObj.getMonth() === selectedMonth.month;
      })
    : allDepartures;

  // Filter packages by vessel
  const filteredPackages = packages.filter((pkg) => {
    if (vesselFilter !== "all" && pkg.vesselId !== vesselFilter) return false;
    return true;
  });

  return (
    <div className="space-y-16 py-8">
      {filteredPackages.map((pkg) => {
        const vessel = vessels.find((v) => v.id === pkg.vesselId) ?? vessels[0];
        const specs = VESSEL_SPECS[vessel.id] || VESSEL_SPECS["summer-cruise"];
        const departuresToShow = filteredDepartures.slice(0, 4);
        const isDatesExpanded = expandedDatesPkg === pkg.slug;

        return (
          <article key={pkg.slug} className="border-b border-ink/10 pb-16 last:border-b-0">
            {/* Top Package Header */}
            <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Photo */}
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-3xl shadow-lg lg:w-[480px]">
                <img
                  src={pkg.heroImage?.src || vessel?.heroImage?.src || "/images/vessels/sc-hero.webp"}
                  alt={pkg.title}
                  className="size-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow backdrop-blur-md">
                  <Bookmark className="size-3.5 fill-white text-white" />
                  Early bird eligible
                </div>
              </div>

              {/* Title & Overview */}
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-deep">
                  <Bookmark className="size-3.5 fill-teal-deep text-teal-deep" />
                  {pkg.durationNights} NIGHTS · {pkg.durationLabel}
                </div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                  {pkg.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {pkg.overview}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft/20 px-3 py-1 text-xs font-medium text-teal-deep"
                    >
                      <Sparkles className="size-3 text-gold-bright" />
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setExpandedDatesPkg(isDatesExpanded ? null : pkg.slug)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep hover:text-obsidian"
                  >
                    <span>{isDatesExpanded ? "Hide Departure Dates" : "See Departure Dates"}</span>
                    {isDatesExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Vessel Detail Specs Card (Aqua style) */}
            <div className="mt-6 rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                {/* Vessel mini photo */}
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl lg:col-span-4">
                  <img
                    src={vessel?.heroImage?.src || "/images/vessels/sc-hero.webp"}
                    alt={vessel.name}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                    {vessel.name}
                  </span>
                </div>

                {/* Vessel specs & bullets */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-2">
                    <Ship className="size-5 text-teal-deep" />
                    <h4 className="font-display text-xl font-medium text-ink">{vessel.name}</h4>
                  </div>

                  <div className="mt-1 text-xs font-medium text-text-muted">
                    {specs.guests} Guests | {specs.crew} Crew | {specs.cabins} Cabins
                  </div>

                  <ul className="mt-4 space-y-1.5 text-xs text-text-muted">
                    {specs.highlights.slice(0, 4).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-teal-deep" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Actions Box */}
                <div className="flex flex-col justify-center rounded-2xl border border-ink/10 bg-[#FAFAF8] p-5 lg:col-span-3">
                  <span className="text-xs text-text-muted">Starting from</span>
                  <div className="mt-0.5 font-display text-2xl font-medium text-obsidian">
                    {formatPrice(pkg.fromPriceMYR)}
                    <span className="text-xs font-normal text-text-muted"> / adult</span>
                  </div>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Inclusive of all artisanal dining, excursions & park fees
                  </p>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => setItineraryModalPkg(pkg)}
                      className="w-full rounded-xl border border-ink/20 bg-white py-2 text-xs font-bold uppercase tracking-wider text-ink transition hover:border-ink/40 hover:bg-ink/5"
                    >
                      View Itinerary
                    </button>
                    {departuresToShow[0] && (
                      <button
                        type="button"
                        onClick={() => onSelectSailing(pkg, vessel, departuresToShow[0])}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-obsidian py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Departure Date Cards (Aqua Expeditions Dark Slate Cards) */}
              <div className="mt-8 border-t border-ink/10 pt-6">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Available Scheduled Departures ({departuresToShow.length})
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {departuresToShow.map((dep) => (
                    <div
                      key={dep.iso}
                      className="group relative flex flex-col justify-between rounded-2xl bg-[#2A3B43] p-4 text-white shadow transition-all hover:bg-[#1f2c32] hover:shadow-lg"
                    >
                      {/* Early bird ribbon */}
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <Bookmark className="size-2.5 fill-emerald-300" />
                        Early bird
                      </span>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-white/60">
                          Pengkalan Gawi &gt; Pengkalan Gawi
                        </span>
                        <div className="mt-1 font-display text-base font-medium text-white">
                          {dep.label}
                        </div>
                        <div className="mt-2 text-xs text-white/80">
                          From <span className="font-semibold text-white">{formatPrice(pkg.fromPriceMYR)}</span> / adult
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setItineraryModalPkg(pkg)}
                          className="flex-1 rounded-lg border border-white/20 py-1.5 text-center text-[11px] font-semibold text-white transition hover:bg-white/10"
                        >
                          Itinerary
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectSailing(pkg, vessel, dep)}
                          className="flex-1 rounded-lg bg-teal-deep py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-teal-600 shadow"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* Itinerary Map Modal (Aqua Expeditions style View Itinerary screen) */}
      {itineraryModalPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6 animate-fade-in">
          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-deep">
                  Expedition Route & Daily Waypoints
                </span>
                <h3 className="font-display text-xl font-medium text-ink">
                  {itineraryModalPkg.title} · {itineraryModalPkg.durationLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItineraryModalPkg(null)}
                className="flex size-9 items-center justify-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/15"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Map & Itinerary Content */}
            <div className="overflow-y-auto p-4 sm:p-6">
              <DynamicCruiseMap
                waypoints={MOCK_WAYPOINTS[itineraryModalPkg.slug] || MOCK_WAYPOINTS["3d2n-kenyir-explorer"]}
                packageSlug={itineraryModalPkg.slug}
                packageTitle={itineraryModalPkg.title}
                durationLabel={itineraryModalPkg.durationLabel}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-ink/10 bg-[#FAFAF8] px-6 py-3">
              <button
                type="button"
                onClick={() => setItineraryModalPkg(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-text-muted hover:text-ink"
              >
                Close
              </button>
              {filteredDepartures[0] && (
                <button
                  type="button"
                  onClick={() => {
                    const vessel = vessels.find((v) => v.id === itineraryModalPkg.vesselId) ?? vessels[0];
                    onSelectSailing(itineraryModalPkg, vessel, filteredDepartures[0]);
                    setItineraryModalPkg(null);
                  }}
                  className="rounded-xl bg-teal-deep px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-obsidian shadow"
                >
                  Book This Expedition
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
