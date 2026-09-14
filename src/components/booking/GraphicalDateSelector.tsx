"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check, Ship, Crown, AlertCircle } from "lucide-react";
import type { DepartureDate, AvailabilityStatus } from "@/lib/departure-dates";
import { cn } from "@/lib/utils";

interface GraphicalDateSelectorProps {
  departures: DepartureDate[];
  selectedDateIso: string;
  onSelectDateIso: (iso: string) => void;
  vesselId: "summer-cruise" | "green-horizon";
  packageSlug?: string;
  durationNights?: number;
  isCharterMode?: boolean;
  onOpenItineraryModal?: () => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function GraphicalDateSelector({
  departures,
  selectedDateIso,
  onSelectDateIso,
  vesselId,
  packageSlug,
  durationNights,
  isCharterMode = false,
  onOpenItineraryModal,
}: GraphicalDateSelectorProps) {
  // Group departures by Year-Month
  const monthGroups = useMemo(() => {
    const map = new Map<string, { key: string; label: string; items: DepartureDate[] }>();

    departures.forEach((dep) => {
      const year = dep.date.getFullYear();
      const monthIdx = dep.date.getMonth();
      const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
      const label = `${MONTH_NAMES[monthIdx]} ${year}`;

      if (!map.has(key)) {
        map.set(key, { key, label, items: [] });
      }
      map.get(key)!.items.push(dep);
    });

    return Array.from(map.values());
  }, [departures]);

  // Selected Month tab
  const [activeMonthKey, setActiveMonthKey] = useState<string>(() => {
    if (selectedDateIso) {
      const prefix = selectedDateIso.slice(0, 7);
      if (monthGroups.some((g) => g.key === prefix)) return prefix;
    }
    return monthGroups[0]?.key || "";
  });

  const activeGroup = useMemo(() => {
    return monthGroups.find((g) => g.key === activeMonthKey) || monthGroups[0];
  }, [monthGroups, activeMonthKey]);

  const activeMonthIdx = monthGroups.findIndex((g) => g.key === activeMonthKey);

  function handlePrevMonth() {
    if (activeMonthIdx > 0) {
      setActiveMonthKey(monthGroups[activeMonthIdx - 1].key);
    }
  }

  function handleNextMonth() {
    if (activeMonthIdx < monthGroups.length - 1) {
      setActiveMonthKey(monthGroups[activeMonthIdx + 1].key);
    }
  }

  // Duration & Base per-adult rate indicator
  const is4D3N = durationNights === 3 || (packageSlug ? packageSlug.includes("4d3n") : false);
  const baseRatePerAdult = is4D3N ? 2050 : 1450;
  const vesselName = vesselId === "green-horizon" ? "Green Horizon" : "Summer Cruise";
  const durationText = is4D3N ? "4D3N (Mon–Thu/Fri)" : "3D2N (Fri–Sun)";

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header & Itinerary Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
            <Ship className="size-4" />
            <span>
              {isCharterMode ? "Private Full-Vessel Charter Dates" : "Departure Sailing Calendar"}
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl sm:text-2xl font-medium text-ink">
            {isCharterMode ? "Choose an 100% Unreserved Charter Date" : "Select Your Sailing Date"}
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            {isCharterMode
              ? "Exclusive vessel charters require 100% open cabin inventory (no individual guest bookings on board)."
              : `All expeditions depart from Pengkalan Gawi Jetty · ${durationText} on ${vesselName}`}
          </p>
        </div>

        {onOpenItineraryModal && (
          <button
            type="button"
            onClick={onOpenItineraryModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:text-obsidian underline underline-offset-4"
          >
            <span>Preview Route Map & Itinerary</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      {/* Month Carousel Tabs */}
      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={activeMonthIdx <= 0}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-ink/5 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {monthGroups.map((g) => {
            const isTabActive = g.key === activeMonthKey;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setActiveMonthKey(g.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all",
                  isTabActive
                    ? "bg-obsidian text-white shadow-sm"
                    : "bg-ink/5 text-ink/80 hover:bg-ink/10"
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={activeMonthIdx >= monthGroups.length - 1}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-ink/5 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Availability Color Combos Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f7f9fa] px-4 py-3 text-[11px] font-medium text-text-muted">
        <span className="font-semibold text-ink">Availability Guide:</span>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <strong className="text-emerald-800">Green:</strong> High (8+ Cabins / Charter Eligible)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-400 shadow-sm" />
            <strong className="text-amber-800">Yellow:</strong> Filling Fast (4–7 Cabins)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-orange-500 shadow-sm" />
            <strong className="text-orange-800">Orange:</strong> Last Cabins (1–3 Left)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500 shadow-sm" />
            <strong className="text-rose-800">Red:</strong> Sold Out
          </span>
        </div>
      </div>

      {/* Date Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(activeGroup?.items || []).map((dep) => {
          const inv = dep.vessels[vesselId];
          const isSelected = selectedDateIso === dep.iso;

          // In Charter Mode: strictly allowed ONLY IF all 12 cabins are unbooked (canCharter === true)
          const isCharterAllowed = isCharterMode ? inv.canCharter : true;
          const isSoldOut = inv.status === "red" || (!isCharterAllowed && isCharterMode);

          // Card color combo styles based on inv.status
          const statusStyles: Record<AvailabilityStatus, { bg: string; text: string; dot: string; border: string }> = {
            green: {
              bg: "bg-emerald-50/70",
              text: "text-emerald-800",
              dot: "bg-emerald-500",
              border: "border-emerald-400/40",
            },
            yellow: {
              bg: "bg-amber-50/70",
              text: "text-amber-800",
              dot: "bg-amber-400",
              border: "border-amber-400/40",
            },
            orange: {
              bg: "bg-orange-50/70",
              text: "text-orange-800",
              dot: "bg-orange-500",
              border: "border-orange-400/40",
            },
            red: {
              bg: "bg-rose-50/60",
              text: "text-rose-800",
              dot: "bg-rose-500",
              border: "border-rose-300/40",
            },
          };

          const curStyle = statusStyles[inv.status];

          return (
            <button
              key={dep.iso}
              type="button"
              disabled={isSoldOut}
              onClick={() => onSelectDateIso(dep.iso)}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200 shadow-sm",
                isSelected
                  ? "border-[#254B5E] bg-[#254B5E] text-white shadow-lg ring-4 ring-[#254B5E]/20 scale-[1.01]"
                  : isSoldOut
                  ? "border-ink/10 bg-gray-50/80 text-ink/40 opacity-60 cursor-not-allowed"
                  : cn("bg-white hover:border-ink/30 hover:shadow", curStyle.border)
              )}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-white text-[#254B5E] shadow-md">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
              )}

              <div>
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight",
                      isSelected
                        ? "bg-white/20 text-white"
                        : cn(curStyle.bg, curStyle.text)
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        isSelected ? "bg-emerald-300" : curStyle.dot
                      )}
                    />
                    {isCharterMode ? (
                      inv.canCharter ? (
                        <span className="flex items-center gap-1 font-extrabold text-emerald-900">
                          <Crown className="size-3 text-amber-500 fill-amber-400" />
                          100% Open · Charter Eligible
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold">Charter Unavailable</span>
                      )
                    ) : (
                      inv.statusLabel
                    )}
                  </span>
                </div>

                {/* Date Label */}
                <div
                  className={cn(
                    "mt-3 font-display text-lg font-semibold tracking-tight",
                    isSelected ? "text-white" : "text-ink"
                  )}
                >
                  {dep.label}
                </div>

                <div
                  className={cn(
                    "mt-1 text-xs",
                    isSelected ? "text-white/80" : "text-text-muted"
                  )}
                >
                  Departure: 12:00 PM · Pengkalan Gawi Jetty
                </div>
              </div>

              {/* Price / Charter Info Footer */}
              <div
                className={cn(
                  "mt-5 flex items-baseline justify-between border-t pt-3",
                  isSelected ? "border-white/15" : "border-ink/8"
                )}
              >
                {isCharterMode ? (
                  inv.canCharter ? (
                    <div>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          isSelected ? "text-white/70" : "text-text-muted"
                        )}
                      >
                        Full Ship Buyout
                      </span>
                      <div
                        className={cn(
                          "font-display text-base font-bold",
                          isSelected ? "text-white" : "text-ink"
                        )}
                      >
                        {is4D3N
                          ? (vesselId === "green-horizon" ? "RM 26,000" : "RM 22,000")
                          : (vesselId === "green-horizon" ? "RM 20,000" : "RM 18,000")}{" "}
                        <span className="text-[11px] font-normal opacity-80">/ voyage</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>Individual cabins booked</span>
                    </div>
                  )
                ) : (
                  <div>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider",
                        isSelected ? "text-white/70" : "text-text-muted"
                      )}
                    >
                      Starting from
                    </span>
                    <div
                      className={cn(
                        "font-display text-base font-bold",
                        isSelected ? "text-white" : "text-ink"
                      )}
                    >
                      RM {baseRatePerAdult.toLocaleString()}{" "}
                      <span className="text-[11px] font-normal opacity-80">/ adult</span>
                    </div>
                  </div>
                )}

                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isSelected ? "text-emerald-300" : "text-teal-deep"
                  )}
                >
                  {isCharterMode && inv.canCharter ? "12 Cabins Included" : "Early Bird -5%"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
