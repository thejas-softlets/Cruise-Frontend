"use client";

import { ChevronDown, ChevronUp, Bookmark, Bed, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AquaDeckCabinPicker } from "./AquaDeckCabinPicker";
import {
  type CabinSlot,
  type VesselId,
  MONTHS_LIST,
  DAYS_LIST,
  CHILD_YEARS,
} from "./booking-types";
import type { DeckCabinSpot } from "@/lib/vessel-deck-plan";

interface Step1CabinSelectionProps {
  /** Number of active cabins in the booking */
  cabinCount: number;
  onCabinCountChange: (count: number) => void;
  /** Cabin slots array */
  cabinSlots: CabinSlot[];
  /** Slot updater callback */
  onUpdateSlot: (index: number, patch: Partial<CabinSlot>) => void;
  /** Active vessel ID for deck plan fallback */
  activeVesselId: VesselId;
  /** All cabin spots across both vessels */
  allCabinSpots: DeckCabinSpot[];
  /** Back button callback */
  onBackToStep0: () => void;
}

/**
 * Step 1: Multi-Cabin Stateroom & Guest Count Selection
 *
 * Implements Aqua Expeditions-caliber stateroom booking:
 * 1. Supports 1 to 5+ cabins in a single booking session.
 * 2. Independent guest party configuration per cabin (Adults, Kids, Kid DOBs).
 * 3. Interactive deck plan stateroom picker (`AquaDeckCabinPicker`) across the pooled fleet.
 * 4. Automatic backend age tier calculation derived from child DOB.
 */
export function Step1CabinSelection({
  cabinCount,
  onCabinCountChange,
  cabinSlots,
  onUpdateSlot,
  activeVesselId,
  allCabinSpots,
  onBackToStep0,
}: Step1CabinSelectionProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header & Cabin Count Dropdown */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToStep0}
            className="mb-1 text-xs font-semibold text-teal-deep hover:underline"
          >
            &larr; Change Package / Sailing
          </button>
          <h2 className="font-display text-3xl font-medium text-ink">Cabin Selection</h2>
          <p className="mt-1 text-xs text-text-muted">
            Choose your staterooms on the ship deck plan. Each cabin can be assigned its own adult and child guest count.
          </p>
        </div>

        {/* Number of Cabins Dropdown (Aqua Expeditions style: 1 to 5 cabins) */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-text-muted">Number of cabins:</label>
          <select
            value={cabinCount}
            onChange={(e) => onCabinCountChange(parseInt(e.target.value, 10))}
            className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
          >
            <option value={1}>1 cabin</option>
            <option value={2}>2 cabins</option>
            <option value={3}>3 cabins</option>
            <option value={4}>4 cabins</option>
            <option value={5}>5 cabins</option>
          </select>
        </div>
      </div>

      {/* Per-Cabin Accordion Cards */}
      <div className="space-y-6">
        {cabinSlots.map((slot, idx) => {
          const otherClaimedSpotIds = cabinSlots
            .filter((_, otherIdx) => otherIdx !== idx)
            .map((s) => s.selectedSpotId)
            .filter(Boolean) as string[];

          const currentPax = slot.adults + slot.children;
          const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);

          return (
            <div
              key={slot.id}
              className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Cabin Card Header */}
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-medium text-ink">
                      Cabin {idx + 1}
                      {assignedSpot && (
                        <span className="ml-2 font-sans text-sm font-normal text-teal-deep">
                          ({assignedSpot.name} · {assignedSpot.planLabel})
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {slot.adults} Adult{slot.adults > 1 ? "s" : ""}
                    {slot.children > 0 ? ` + ${slot.children} Child${slot.children > 1 ? "ren" : ""}` : ""}
                    {assignedSpot ? ` · Stateroom ${assignedSpot.planLabel} assigned` : " · No stateroom selected"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdateSlot(idx, { isOpen: !slot.isOpen })}
                  className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink transition"
                >
                  {slot.isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                </button>
              </div>

              {slot.isOpen && (
                <div className="mt-6 space-y-6">
                  {/* Number of Adults & Children Dropdowns */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text-muted">
                        Number of Adults*
                      </label>
                      <select
                        value={slot.adults}
                        onChange={(e) => onUpdateSlot(idx, { adults: parseInt(e.target.value, 10) })}
                        className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                      >
                        <option value={1}>1 Adult (Single Occupancy)</option>
                        <option value={2}>2 Adults (Standard Double)</option>
                        <option value={3}>3 Adults (Triple Sharing)</option>
                        <option value={4}>4 Adults (Family Quad)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text-muted">
                        Number of Children (Ages 0–11)
                      </label>
                      <select
                        value={slot.children}
                        onChange={(e) => onUpdateSlot(idx, { children: parseInt(e.target.value, 10) })}
                        className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                      >
                        <option value={0}>0 Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                      </select>
                    </div>
                  </div>

                  {/* Child Date of Birth Dropdowns */}
                  {slot.children > 0 && (
                    <div className="space-y-4 rounded-2xl border border-teal-deep/15 bg-teal-soft/10 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-deep">
                          Child Guest Details for Cabin {idx + 1}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          DOB required for automatic tier classification
                        </span>
                      </div>

                      {Array.from({ length: slot.children }).map((_, childIdx) => {
                        const dob = slot.childBirthDates[childIdx] || {
                          month: "March",
                          day: "7",
                          year: "2018",
                        };

                        return (
                          <div key={childIdx} className="space-y-2">
                            <label className="block text-xs font-semibold text-ink">
                              Child {childIdx + 1}&apos;s Date of Birth*
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={dob.month}
                                onChange={(e) => {
                                  const nextDates = [...slot.childBirthDates];
                                  nextDates[childIdx] = { ...dob, month: e.target.value };
                                  onUpdateSlot(idx, { childBirthDates: nextDates });
                                }}
                                className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                              >
                                {MONTHS_LIST.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={dob.day}
                                onChange={(e) => {
                                  const nextDates = [...slot.childBirthDates];
                                  nextDates[childIdx] = { ...dob, day: e.target.value };
                                  onUpdateSlot(idx, { childBirthDates: nextDates });
                                }}
                                className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                              >
                                {DAYS_LIST.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={dob.year}
                                onChange={(e) => {
                                  const nextDates = [...slot.childBirthDates];
                                  nextDates[childIdx] = { ...dob, year: e.target.value };
                                  onUpdateSlot(idx, { childBirthDates: nextDates });
                                }}
                                className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                              >
                                {CHILD_YEARS.map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}

                      <p className="text-[11px] leading-relaxed text-text-muted">
                        Classification policy: Under 2 years: Infant (FOC complimentary); 2–3 years: Toddler (nominal amenities fee); 4–11 years: Child (50% package fare with dedicated bed). 12+ years: Adult rates apply.
                      </p>
                    </div>
                  )}

                  {/* Early Bird Promo Banner */}
                  <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-4 text-xs text-text-muted">
                    <Bookmark className="size-4 shrink-0 fill-emerald-600 text-emerald-600" />
                    <span>
                      Select <strong className="text-ink">Cabin 1101</strong> or <strong className="text-ink">Cabin 1201</strong> to enjoy our complimentary Early Bird Bonus and lake-sunrise viewpoint.
                    </span>
                  </div>

                  {/* Bus-like Deck Plan Cabin Picker */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink">
                        Select stateroom on deck for Cabin {idx + 1}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {currentPax} guest{currentPax > 1 ? "s" : ""} in this cabin
                      </span>
                    </div>

                    <AquaDeckCabinPicker
                      vesselId={activeVesselId}
                      selectedSpotId={slot.selectedSpotId}
                      onSelectSpot={(spotId) => {
                        onUpdateSlot(idx, {
                          selectedSpotId: slot.selectedSpotId === spotId ? null : spotId,
                        });
                      }}
                      otherSelectedSpotIds={otherClaimedSpotIds}
                      currentCabinPax={currentPax}
                      cabinIndex={idx}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
