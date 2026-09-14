"use client";

import { useState } from "react";
import {
  Check,
  Bookmark,
  Sparkles,
  Ship,
  Crown,
  ArrowRight,
  MapPin,
  X,
  Users,
} from "lucide-react";
import type { Package, Vessel } from "@/types";
import { cn } from "@/lib/utils";
import { GraphicalDateSelector } from "./GraphicalDateSelector";
import { DynamicCruiseMap } from "./DynamicCruiseMap";
import { MOCK_WAYPOINTS } from "@/lib/api/mock/booking";
import type { BookingMode, VesselId } from "./booking-types";
import type { DepartureDate } from "@/lib/departure-dates";

interface Step0PackageAndDateProps {
  /** Mode: Individual cabin stateroom booking vs Private charter buyout */
  mode: BookingMode;
  onSetMode: (mode: BookingMode) => void;
  /** Available packages (strictly 3D2N Kenyir Explorer and 4D3N Kenyir Grand Voyage) */
  packages: Package[];
  selectedPackageSlug: string;
  onSelectPackageSlug: (slug: string) => void;
  /** Fleet departure dates */
  departures: DepartureDate[];
  selectedDateIso: string;
  onSelectDateIso: (iso: string) => void;
  /** Initial guest counters */
  initialAdults: number;
  onInitialAdultsChange: (n: number) => void;
  initialChildren: number;
  onInitialChildrenChange: (n: number) => void;
  /** Charter mode vessel selection */
  charterVesselId: VesselId;
  onCharterVesselIdChange: (id: VesselId) => void;
  /** Action to continue to Step 1 */
  onContinueToCabins: () => void;
  onContinueToCharter: () => void;
  /** Vessels list for charter specs */
  vessels: Vessel[];
}

/**
 * Step 0: Expedition Package & Departure Date Selection
 *
 * Core Enhancements:
 * 1. Fleet Unified as One Pool: Guests directly choose between the 2 core packages
 *    without having to pick a cruise ship upfront.
 * 2. Clean Package Names: "3D2N Kenyir Explorer" and "4D3N Kenyir Grand Voyage".
 * 3. Interactive Graphical Calendar with live Kenyir fleet departures.
 * 4. Full-Vessel Charter Buyout Option available on 100% open departure dates.
 */
export function Step0PackageAndDate({
  mode,
  onSetMode,
  packages,
  selectedPackageSlug,
  onSelectPackageSlug,
  departures,
  selectedDateIso,
  onSelectDateIso,
  initialAdults,
  onInitialAdultsChange,
  initialChildren,
  onInitialChildrenChange,
  charterVesselId,
  onCharterVesselIdChange,
  onContinueToCabins,
  onContinueToCharter,
  vessels,
}: Step0PackageAndDateProps) {
  const [showItineraryModal, setShowItineraryModal] = useState(false);

  // Active selected package
  const selectedPkg = packages.find((p) => p.slug === selectedPackageSlug) || packages[0];
  const selectedDate = departures.find((d) => d.iso === selectedDateIso) || departures[0];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Top Segmented Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-ink/5 p-1.5 border border-ink/10 shadow-inner">
          <button
            type="button"
            onClick={() => onSetMode("cabin")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
              mode === "cabin"
                ? "bg-white text-ink shadow-md"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Ship className="size-4 text-teal-deep" />
            <span>Stateroom Booking (Individual Cabins)</span>
          </button>

          <button
            type="button"
            onClick={() => onSetMode("charter")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
              mode === "charter"
                ? "bg-white text-ink shadow-md"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Crown className="size-4 text-amber-500 fill-amber-400" />
            <span>Private Full-Vessel Charter (Exclusive Buyout)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: INDIVIDUAL CABIN BOOKING (FLEET AS ONE BIG POOL)     */}
      {/* ============================================================ */}
      {mode === "cabin" && (
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-deep">
              Tasik Kenyir Luxury Expeditions
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Select Your Voyage &amp; Dates
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Choose your expedition package duration and sailing date from Pengkalan Gawi Berth.
              Staterooms across the unified Kenyir fleet are available.
            </p>
          </div>

          {/* Section 1: The 2 Core Packages Only */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                1. Select Expedition Package
              </span>
              <span className="text-xs text-text-muted">
                All departures sail from Pengkalan Gawi Terminal · Unified Lake Fleet
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Package 1: 3D2N Kenyir Explorer */}
              <button
                type="button"
                onClick={() => onSelectPackageSlug("3d2n-kenyir-explorer")}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                  selectedPackageSlug === "3d2n-kenyir-explorer"
                    ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                    : "border-ink/10 bg-white hover:border-ink/30"
                )}
              >
                {selectedPackageSlug === "3d2n-kenyir-explorer" && (
                  <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                    <Bookmark className="size-3.5 fill-teal-deep text-teal-deep" />
                    3 Days · 2 Nights (Departs Friday)
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                    3D2N Kenyir Explorer
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    Weekend Voyage · Departs 12:00 PM Friday from Pengkalan Gawi
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    An unhurried weekend voyage through Kenyir&apos;s emerald bays. Two peaceful
                    nights beneath ancient rainforest canopies, swimming in secluded waterfall
                    lagoons at Lasir, and twilight deck dining.
                  </p>

                  <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Secluded swim in multi-tiered Lasir waterfall cascades</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Natural Kelah Sanctuary freshwater fish spa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Full board artisanal lake-to-table cuisine included</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4">
                  <div>
                    <span className="text-[11px] text-text-muted">Base Fare per adult:</span>
                    <div className="font-display text-2xl font-bold text-obsidian">
                      RM 1,898{" "}
                      <span className="text-xs font-normal text-text-muted">/ adult</span>
                    </div>
                    <span className="text-[11px] text-teal-deep font-medium">
                      Standard Double Occupancy (Single Occupancy: RM 2,898)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-deep">
                    Fri–Sun Voyage
                  </span>
                </div>
              </button>

              {/* Package 2: 4D3N Kenyir Grand Voyage */}
              <button
                type="button"
                onClick={() => onSelectPackageSlug("4d3n-kenyir-grand-voyage")}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                  selectedPackageSlug === "4d3n-kenyir-grand-voyage"
                    ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                    : "border-ink/10 bg-white hover:border-ink/30"
                )}
              >
                {selectedPackageSlug === "4d3n-kenyir-grand-voyage" && (
                  <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                    <Bookmark className="size-3.5 fill-teal-deep text-teal-deep" />
                    4 Days · 3 Nights (Departs Monday)
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                    4D3N Kenyir Grand Voyage
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    Midweek Expedition · Departs 12:00 PM Monday from Pengkalan Gawi
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    An immersive four-day expedition into Kenyir&apos;s untamed remote reaches —
                    prehistoric limestone caverns at Bewah, dramatic Tembat river canyon drifts,
                    and starlit open-air roof deck dining.
                  </p>

                  <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Expedition cruise to prehistoric Bewah Limestone Caves</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Tembat River upstream drift &amp; nature trek</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Lasir waterfall lagoon swimming &amp; Kelah spa sanctuary</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4">
                  <div>
                    <span className="text-[11px] text-text-muted">Base Fare per adult:</span>
                    <div className="font-display text-2xl font-bold text-obsidian">
                      RM 2,698{" "}
                      <span className="text-xs font-normal text-text-muted">/ adult</span>
                    </div>
                    <span className="text-[11px] text-teal-deep font-medium">
                      Standard Double Occupancy (Single Occupancy: RM 4,098)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-deep">
                    Mon–Thu Voyage
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Departure Date Selector (Unified Fleet Calendar) */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                2. Select Sailing Departure Date
              </span>
              <button
                type="button"
                onClick={() => setShowItineraryModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-deep hover:underline"
              >
                <MapPin className="size-3.5" />
                <span>View Route Map &amp; Waypoints</span>
              </button>
            </div>

            <GraphicalDateSelector
              departures={departures}
              selectedDateIso={selectedDateIso}
              onSelectDateIso={onSelectDateIso}
              vesselId="summer-cruise"
              packageSlug={selectedPackageSlug}
              durationNights={selectedPkg?.durationNights}
              onOpenItineraryModal={() => setShowItineraryModal(true)}
            />
          </div>

          {/* Section 3: Initial Travel Party & Advance Button */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-deep flex items-center gap-1.5">
                  <Users className="size-4" />
                  Travel Party Estimate
                </span>
                <h4 className="mt-1 font-display text-xl font-medium text-ink">
                  How many guests are traveling?
                </h4>
                <p className="mt-1 text-xs text-text-muted">
                  You can fine-tune cabins, adults, and child DOBs in the next step.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-text-muted">Adults:</label>
                  <select
                    value={initialAdults}
                    onChange={(e) => onInitialAdultsChange(parseInt(e.target.value, 10))}
                    className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-text-muted">Kids:</label>
                  <select
                    value={initialChildren}
                    onChange={(e) => onInitialChildrenChange(parseInt(e.target.value, 10))}
                    className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-xs"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Kid{n === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={onContinueToCabins}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-obsidian px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-lg"
                >
                  <span>Continue to Cabin Selection</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: PRIVATE VESSEL CHARTER (EXCLUSIVE BUYOUT)             */}
      {/* ============================================================ */}
      {mode === "charter" && (
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1.5">
              <Crown className="size-4 fill-amber-500 text-amber-500" />
              Exclusive Private Buyout
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Private Full-Vessel Charter
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Full private vessel charters are available on sailing dates with 100% open inventory
              (zero individual cabins booked).
            </p>
          </div>

          {/* Vessel Selection for Charter */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onCharterVesselIdChange("summer-cruise")}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all",
                charterVesselId === "summer-cruise"
                  ? "border-teal-deep bg-teal-deep text-white shadow-md ring-2 ring-teal-deep/30"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40"
              )}
            >
              <Ship className="size-4" />
              <span>Summer Cruise (12 Lakeview Staterooms · Max 24 Pax)</span>
            </button>

            <button
              type="button"
              onClick={() => onCharterVesselIdChange("green-horizon")}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all",
                charterVesselId === "green-horizon"
                  ? "border-teal-deep bg-teal-deep text-white shadow-md ring-2 ring-teal-deep/30"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40"
              )}
            >
              <Ship className="size-4" />
              <span>Green Horizon (12 Balcony Suites / 15 Rooms · Max 30 Pax)</span>
            </button>
          </div>

          {/* Date Selector for Charter */}
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
              Select 100% Unreserved Charter Date
            </div>

            <GraphicalDateSelector
              departures={departures}
              selectedDateIso={selectedDateIso}
              onSelectDateIso={onSelectDateIso}
              vesselId={charterVesselId}
              packageSlug={selectedPackageSlug}
              durationNights={selectedPkg?.durationNights}
              isCharterMode={true}
              onOpenItineraryModal={() => setShowItineraryModal(true)}
            />
          </div>

          {/* Charter Action Cards */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Ready to reserve the full boat?
                </span>
                <h4 className="mt-1 font-display text-xl font-medium text-ink">
                  {charterVesselId === "green-horizon" ? "Green Horizon" : "Summer Cruise"} Buyout
                </h4>
                <p className="mt-1 text-xs text-text-muted">
                  Includes all staterooms, dedicated executive chef, crew, and custom route itinerary.
                </p>
              </div>

              <button
                type="button"
                onClick={onContinueToCharter}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-obsidian px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-lg"
              >
                <span>Configure Charterer Details</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Map Itinerary Modal */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6 animate-fade-in">
          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-deep">
                  Lake Kenyir Route &amp; Waypoints
                </span>
                <h3 className="font-display text-xl font-medium text-ink">
                  {selectedPkg?.title} · {selectedPkg?.durationLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowItineraryModal(false)}
                className="flex size-9 items-center justify-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/15"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6">
              <DynamicCruiseMap
                waypoints={MOCK_WAYPOINTS[selectedPkg?.slug] || MOCK_WAYPOINTS["3d2n-kenyir-explorer"]}
                packageSlug={selectedPkg?.slug}
                packageTitle={selectedPkg?.title}
                durationLabel={selectedPkg?.durationLabel}
              />
            </div>

            <div className="flex justify-end border-t border-ink/10 bg-[#FAFAF8] px-6 py-3">
              <button
                type="button"
                onClick={() => setShowItineraryModal(false)}
                className="rounded-xl bg-teal-deep px-5 py-2 text-xs font-bold uppercase tracking-wider text-white"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
