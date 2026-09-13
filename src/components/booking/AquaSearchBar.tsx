"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Users, Calendar, Ship, Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AquaSearchBarProps {
  vesselId: string;
  onVesselChange: (vessel: string) => void;
  selectedMonth: { year: number; month: number } | null; // month is 0-indexed (0 = Jan)
  onMonthChange: (month: { year: number; month: number } | null) => void;
  adults: number;
  onAdultsChange: (adults: number) => void;
  childrenCount: number;
  onChildrenCountChange: (children: number) => void;
  onSearch: () => void;
  onCharterSwitch?: () => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Months that have early-bird specials
const EARLY_BIRD_MONTHS = new Set(["2026-9", "2026-10", "2026-11", "2027-1", "2027-2", "2027-5"]);
const EXPLORERS_MONTHS = new Set(["2026-11", "2027-3", "2027-7"]);

export function AquaSearchBar({
  vesselId,
  onVesselChange,
  selectedMonth,
  onMonthChange,
  adults,
  onAdultsChange,
  childrenCount,
  onChildrenCountChange,
  onSearch,
  onCharterSwitch,
}: AquaSearchBarProps) {
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [activeYear, setActiveYear] = useState(selectedMonth?.year ?? 2026);

  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datesRef.current && !datesRef.current.contains(event.target as Node)) {
        setDatesOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setGuestsOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setDestinationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const guestLabel = `${adults} Adult${adults > 1 ? "s" : ""}${
    childrenCount > 0 ? ` and ${childrenCount} Child${childrenCount > 1 ? "ren" : ""}` : ""
  }`;

  const destinationLabel =
    vesselId === "summer-cruise"
      ? "Summer Cruise · Kenyir Lake"
      : vesselId === "green-horizon"
      ? "Green Horizon · Kenyir Lake"
      : "All Lake Kenyir Expeditions";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-ink/10 bg-white p-2.5 shadow-lg sm:rounded-3xl sm:p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
          {/* Destination Selector */}
          <div ref={destRef} className="relative md:col-span-4">
            <button
              type="button"
              onClick={() => {
                setDestinationOpen((v) => !v);
                setDatesOpen(false);
                setGuestsOpen(false);
              }}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-ink/15 bg-white px-4 text-left text-sm transition hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Ship className="size-4 shrink-0 text-teal-deep" />
                <span className="truncate font-medium text-ink">{destinationLabel}</span>
              </div>
              <ChevronDown className={cn("size-4 shrink-0 text-ink/40 transition-transform", destinationOpen && "rotate-180")} />
            </button>

            {destinationOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[260px] rounded-2xl border border-ink/10 bg-white p-2 shadow-2xl">
                {[
                  { id: "all", label: "All Lake Kenyir Expeditions", sub: "Browse both vessels & all itineraries" },
                  { id: "summer-cruise", label: "Summer Cruise", sub: "24 Guests · 12 Lakeview Staterooms" },
                  { id: "green-horizon", label: "Green Horizon", sub: "60 Guests · 15 Panorama & Balcony Suites" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onVesselChange(item.id);
                      setDestinationOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl p-3 text-left transition",
                      vesselId === item.id ? "bg-teal-soft/15 font-semibold text-teal-deep" : "hover:bg-ink/5 text-ink"
                    )}
                  >
                    <div>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-[11px] text-text-muted">{item.sub}</div>
                    </div>
                    {vesselId === item.id && <Check className="size-4 text-teal-deep" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Departure Period Selector */}
          <div ref={datesRef} className="relative md:col-span-4">
            <button
              type="button"
              onClick={() => {
                setDatesOpen((v) => !v);
                setDestinationOpen(false);
                setGuestsOpen(false);
              }}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-ink/15 bg-white px-4 text-left text-sm transition hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calendar className="size-4 shrink-0 text-teal-deep" />
                {selectedMonth ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-deep/10 px-2 py-0.5 text-xs font-semibold text-teal-deep">
                    {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMonthChange(null);
                      }}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-teal-deep/20"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                ) : (
                  <span className="text-sm font-medium text-ink/70">Departure Dates*</span>
                )}
              </div>
              <ChevronDown className={cn("size-4 shrink-0 text-ink/40 transition-transform", datesOpen && "rotate-180")} />
            </button>

            {/* Aqua Expeditions style Month Picker Modal */}
            {datesOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[320px] rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl sm:min-w-[360px]">
                {/* Badges legend */}
                <div className="mb-3 flex flex-wrap items-center gap-3 border-b border-ink/10 pb-3 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <Bookmark className="size-3 fill-emerald-600 text-emerald-600" />
                    <span>Early bird special</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="size-3 fill-sky-600 text-sky-600" />
                    <span>Explorer Departure</span>
                  </span>
                </div>

                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Select departure period
                </div>

                {/* Year tabs */}
                <div className="mb-3 flex rounded-xl bg-ink/5 p-1 text-xs font-semibold">
                  {[2026, 2027, 2028].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setActiveYear(year)}
                      className={cn(
                        "flex-1 rounded-lg py-1.5 text-center transition",
                        activeYear === year ? "bg-obsidian text-white shadow-sm" : "text-ink/70 hover:text-ink"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {/* 12-month grid */}
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_NAMES.map((name, mIndex) => {
                    const key = `${activeYear}-${mIndex}`;
                    const isEarly = EARLY_BIRD_MONTHS.has(key);
                    const isExplorer = EXPLORERS_MONTHS.has(key);
                    const isSelected = selectedMonth?.year === activeYear && selectedMonth?.month === mIndex;

                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          onMonthChange({ year: activeYear, month: mIndex });
                        }}
                        className={cn(
                          "relative flex h-11 flex-col items-center justify-center rounded-xl border text-xs font-medium transition",
                          isSelected
                            ? "border-teal-deep bg-teal-deep text-white font-bold shadow"
                            : "border-ink/10 hover:border-teal-deep/50 hover:bg-teal-soft/10 text-ink"
                        )}
                      >
                        <span>{name}</span>
                        {/* Ribbon indicator */}
                        {isEarly && (
                          <Bookmark
                            className={cn(
                              "absolute right-1 top-1 size-2.5",
                              isSelected ? "fill-white text-white" : "fill-emerald-600 text-emerald-600"
                            )}
                          />
                        )}
                        {!isEarly && isExplorer && (
                          <Bookmark
                            className={cn(
                              "absolute right-1 top-1 size-2.5",
                              isSelected ? "fill-white text-white" : "fill-sky-600 text-sky-600"
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                  <button
                    type="button"
                    onClick={() => onMonthChange(null)}
                    className="text-xs text-text-muted hover:text-ink"
                  >
                    Clear dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatesOpen(false)}
                    className="rounded-lg bg-teal-deep px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-obsidian"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guests Stepper Selector */}
          <div ref={guestsRef} className="relative md:col-span-2">
            <button
              type="button"
              onClick={() => {
                setGuestsOpen((v) => !v);
                setDestinationOpen(false);
                setDatesOpen(false);
              }}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-ink/15 bg-white px-4 text-left text-sm transition hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Users className="size-4 shrink-0 text-teal-deep" />
                <span className="truncate font-medium text-ink">{guestLabel}</span>
              </div>
              <ChevronDown className={cn("size-4 shrink-0 text-ink/40 transition-transform", guestsOpen && "rotate-180")} />
            </button>

            {/* Aqua Expeditions style Stepper Popover */}
            {guestsOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-full min-w-[280px] rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl">
                {/* Adults row */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-semibold text-ink">Adults</div>
                    <div className="text-[11px] text-text-muted">Ages 12+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                      className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-base font-bold text-ink transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-display text-base font-bold text-ink">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 10}
                      onClick={() => onAdultsChange(adults + 1)}
                      className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-base font-bold text-ink transition hover:bg-ink/5 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children row */}
                <div className="flex items-center justify-between border-t border-ink/10 py-2">
                  <div>
                    <div className="text-sm font-semibold text-ink">Children</div>
                    <div className="text-[11px] text-text-muted">Ages 5 – 11</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={() => onChildrenCountChange(Math.max(0, childrenCount - 1))}
                      className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-base font-bold text-ink transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-display text-base font-bold text-ink">{childrenCount}</span>
                    <button
                      type="button"
                      disabled={childrenCount >= 6}
                      onClick={() => onChildrenCountChange(childrenCount + 1)}
                      className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-base font-bold text-ink transition hover:bg-ink/5 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-2 rounded-xl bg-ink/5 p-2.5 text-[11px] text-text-muted leading-relaxed">
                  Children ages 5–11 enjoy special junior expedition rates. Under 5s travel with private charter arrangements.
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setGuestsOpen(false)}
                    className="rounded-lg bg-teal-deep px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-obsidian"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={onSearch}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-obsidian px-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-md"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {/* Aqua style footer charter notice */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-text-muted sm:justify-between sm:px-2">
        <span>
          Looking for private charters or 10+ guests?{" "}
          {onCharterSwitch && (
            <button
              type="button"
              onClick={onCharterSwitch}
              className="font-semibold text-teal-deep underline underline-offset-2 hover:text-obsidian"
            >
              Configure Private Charter
            </button>
          )}
        </span>
        <span className="text-[11px] text-text-muted/80">
          All Kenyir departures sail every Friday & Monday at 12:00pm
        </span>
      </div>
    </div>
  );
}
