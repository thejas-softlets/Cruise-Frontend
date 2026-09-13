"use client";

import { useMemo } from "react";
import { Check, Users, Maximize2, Bed, Bath } from "lucide-react";
import type { DeckCabinSpot } from "@/lib/vessel-deck-plan";
import { SC_CABIN_SPOTS } from "@/lib/sc-deck-plan";
import { GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AquaDeckCabinPickerProps {
  vesselId: "summer-cruise" | "green-horizon";
  selectedSpotId: string | null;
  onSelectSpot: (spotId: string) => void;
  /** Spot IDs already claimed by OTHER cabin slots in this booking */
  otherSelectedSpotIds: string[];
  /** Guest count for this specific cabin (adults + children) */
  currentCabinPax: number;
  cabinIndex: number;
}

interface CabinVisualConfig {
  planLabel: string;
  categoryName: string;
  colorClass: string;
  textClass: string;
  isEarlyBird?: boolean;
}

const CABIN_CONFIGS: Record<string, CabinVisualConfig> = {
  // Summer Cruise
  "sc-1-1101": { planLabel: "1101", categoryName: "Master Suite", colorClass: "bg-[#355263] border-[#2A4250]", textClass: "text-white", isEarlyBird: true },
  "sc-1-1102": { planLabel: "1102", categoryName: "Master Suite", colorClass: "bg-[#355263] border-[#2A4250]", textClass: "text-white" },
  "sc-1-1103": { planLabel: "1103", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1104": { planLabel: "1104", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1105": { planLabel: "1105", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1106": { planLabel: "1106", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1107": { planLabel: "1107", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1108": { planLabel: "1108", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1109": { planLabel: "1109", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1110": { planLabel: "1110", categoryName: "Deluxe Double", colorClass: "bg-[#6A9AB0] border-[#558195]", textClass: "text-white" },
  "sc-1-1111": { planLabel: "1111", categoryName: "Family Suite", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "sc-1-1112": { planLabel: "1112", categoryName: "Family Suite", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },

  // Green Horizon
  "gh-2-1214": { planLabel: "1214", categoryName: "Premium Panorama", colorClass: "bg-[#254B5E] border-[#1C3B4A]", textClass: "text-white", isEarlyBird: true },
  "gh-2-1215": { planLabel: "1215", categoryName: "Premium Panorama", colorClass: "bg-[#254B5E] border-[#1C3B4A]", textClass: "text-white", isEarlyBird: true },
  "gh-2-1213": { planLabel: "1213", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1201": { planLabel: "1201", categoryName: "Premium Lake View", colorClass: "bg-[#4B7993] border-[#3C647B]", textClass: "text-white" },
  "gh-1-1202": { planLabel: "1202", categoryName: "Premium Lake View", colorClass: "bg-[#4B7993] border-[#3C647B]", textClass: "text-white" },
  "gh-1-1203": { planLabel: "1203", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1204": { planLabel: "1204", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1205": { planLabel: "1205", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1206": { planLabel: "1206", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1207": { planLabel: "1207", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1208": { planLabel: "1208", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1209": { planLabel: "1209", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1210": { planLabel: "1210", categoryName: "Deluxe Family", colorClass: "bg-[#A7C7D9] border-[#8FB4C9]", textClass: "text-slate-900" },
  "gh-1-1211": { planLabel: "1211", categoryName: "Premium Vista", colorClass: "bg-[#4B7993] border-[#3C647B]", textClass: "text-white" },
  "gh-1-1212": { planLabel: "1212", categoryName: "Premium Vista", colorClass: "bg-[#4B7993] border-[#3C647B]", textClass: "text-white" },
};

const ROOM_PHOTOS: Record<string, string> = {
  "sc-master": "/images/rooms/sc-master.webp",
  "sc-deluxe-double": "/images/rooms/sc-deluxe.webp",
  "sc-family": "/images/rooms/sc-family.webp",
  "gh-panorama": "/images/rooms/gh-panorama.webp",
  "gh-lake-view": "/images/rooms/gh-twin.webp",
  "gh-vista": "/images/rooms/gh-twin.webp",
  "gh-family": "/images/rooms/gh-family.webp",
};

export function AquaDeckCabinPicker({
  vesselId,
  selectedSpotId,
  onSelectSpot,
  otherSelectedSpotIds,
  currentCabinPax,
  cabinIndex,
}: AquaDeckCabinPickerProps) {
  const allSpots = vesselId === "summer-cruise" ? SC_CABIN_SPOTS : GH_CABIN_SPOTS;
  const bookableCabins = useMemo(() => allSpots.filter((s) => s.kind === "cabin"), [allSpots]);

  const selectedSpot = bookableCabins.find((s) => s.id === selectedSpotId) ?? null;
  const selectedConfig = selectedSpot ? CABIN_CONFIGS[selectedSpot.id] : null;

  // Group cabins into decks
  const decks = useMemo(() => {
    if (vesselId === "summer-cruise") {
      return [
        {
          id: "first-deck",
          name: "Accommodation Deck (Level 1)",
          bow: "right" as const,
          topRow: [
            bookableCabins.find((s) => s.id === "sc-1-1101"),
            bookableCabins.find((s) => s.id === "sc-1-1103"),
            bookableCabins.find((s) => s.id === "sc-1-1105"),
            bookableCabins.find((s) => s.id === "sc-1-1107"),
            bookableCabins.find((s) => s.id === "sc-1-1109"),
            bookableCabins.find((s) => s.id === "sc-1-1111"),
          ].filter(Boolean) as DeckCabinSpot[],
          bottomRow: [
            bookableCabins.find((s) => s.id === "sc-1-1102"),
            bookableCabins.find((s) => s.id === "sc-1-1104"),
            bookableCabins.find((s) => s.id === "sc-1-1106"),
            bookableCabins.find((s) => s.id === "sc-1-1108"),
            bookableCabins.find((s) => s.id === "sc-1-1110"),
            bookableCabins.find((s) => s.id === "sc-1-1112"),
          ].filter(Boolean) as DeckCabinSpot[],
        },
      ];
    } else {
      return [
        {
          id: "first-deck",
          name: "Accommodation Deck (1st Floor · 12 Staterooms)",
          bow: "left" as const,
          topRow: [
            bookableCabins.find((s) => s.id === "gh-1-1201"),
            bookableCabins.find((s) => s.id === "gh-1-1203"),
            bookableCabins.find((s) => s.id === "gh-1-1205"),
            bookableCabins.find((s) => s.id === "gh-1-1207"),
            bookableCabins.find((s) => s.id === "gh-1-1209"),
            bookableCabins.find((s) => s.id === "gh-1-1211"),
          ].filter(Boolean) as DeckCabinSpot[],
          bottomRow: [
            bookableCabins.find((s) => s.id === "gh-1-1202"),
            bookableCabins.find((s) => s.id === "gh-1-1204"),
            bookableCabins.find((s) => s.id === "gh-1-1206"),
            bookableCabins.find((s) => s.id === "gh-1-1208"),
            bookableCabins.find((s) => s.id === "gh-1-1210"),
            bookableCabins.find((s) => s.id === "gh-1-1212"),
          ].filter(Boolean) as DeckCabinSpot[],
        },
      ];
    }
  }, [vesselId, bookableCabins]);

  function isCabinDisabled(spot: DeckCabinSpot): { disabled: boolean; reason?: string } {
    // 1. Static booked/unavailable status
    if (spot.status === "unavailable") {
      return { disabled: true, reason: "Unavailable" };
    }
    // 2. Selected in another cabin slot in this multi-cabin booking
    if (otherSelectedSpotIds.includes(spot.id)) {
      return { disabled: true, reason: "Unavailable" };
    }
    // 3. Occupancy check: if current cabin pax exceeds room's maxOccupancy
    if (currentCabinPax > 0 && spot.maxOccupancy < currentCabinPax) {
      return { disabled: true, reason: "Max pax exceeded" };
    }
    return { disabled: false };
  }

  return (
    <div className="space-y-6">
      {/* Ship Hull Deck Renderings */}
      {decks.map((deck) => (
        <div key={deck.id} className="space-y-2">
          {/* Deck Pill Label */}
          <div className="inline-block rounded-md bg-[#334149] px-3 py-1 text-xs font-bold text-white tracking-wide shadow-sm">
            {deck.name}
          </div>

          {/* Boat Hull Silhouette SVG/CSS Container */}
          <div className="relative overflow-x-auto rounded-2xl border border-[#D5D3CC] bg-[#EDECE8] p-4 sm:p-6 shadow-inner">
            <div className="flex min-w-[580px] items-center justify-between gap-4">
              {/* If bow is on the left (Green Horizon) */}
              {deck.bow === "left" && (
                <div className="relative flex h-32 w-16 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 60 120" className="size-full fill-[#E1E0DC] stroke-[#C8C6BE] stroke-2">
                    <path d="M 55 5 C 20 20 5 45 5 60 C 5 75 20 100 55 115 Z" />
                  </svg>
                  <span className="absolute text-[10px] font-bold uppercase tracking-widest text-ink/40 [writing-mode:vertical-rl] rotate-180">
                    Bow
                  </span>
                </div>
              )}

              {/* Central Stateroom Grid (Bus-seat arrangement) */}
              <div className="flex-1 space-y-3">
                {/* Port Row */}
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[10px] font-bold uppercase text-ink/40">Port</span>
                  <div className="flex flex-1 items-center gap-2">
                    {deck.topRow.map((spot) => {
                      const cfg = CABIN_CONFIGS[spot.id] || {
                        planLabel: spot.planLabel,
                        categoryName: "Stateroom",
                        colorClass: "bg-[#7BA4C0] border-[#668FA8]",
                        textClass: "text-white",
                      };
                      const isSelected = selectedSpotId === spot.id;
                      const { disabled, reason } = isCabinDisabled(spot);

                      return (
                        <button
                          key={spot.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => onSelectSpot(spot.id)}
                          className={cn(
                            "relative flex h-14 flex-1 flex-col items-center justify-center rounded-lg border-2 p-1 text-xs font-bold transition-all shadow-sm",
                            isSelected
                              ? "z-10 border-gold-bright bg-obsidian text-white ring-4 ring-gold-bright/30 scale-105 shadow-md"
                              : disabled
                              ? "cursor-not-allowed border-zinc-300 bg-[#D8D7D3] text-zinc-400 opacity-60"
                              : `${cfg.colorClass} ${cfg.textClass} hover:brightness-95 hover:scale-102 cursor-pointer`
                          )}
                        >
                          {/* Early bird ribbon */}
                          {cfg.isEarlyBird && !disabled && !isSelected && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-semibold text-white shadow-xs">
                              Early bird
                            </span>
                          )}

                          {disabled ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-tighter text-zinc-500">
                                {reason || "Unavailable"}
                              </span>
                              <span className="text-[10px] font-medium text-zinc-400 line-through">
                                {spot.planLabel}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-xs font-extrabold tracking-tight">
                                {spot.planLabel}
                              </span>
                              {isSelected && (
                                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-gold-bright text-obsidian shadow">
                                  <Check className="size-2.5 stroke-[3]" />
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Starboard Row */}
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[10px] font-bold uppercase text-ink/40">Stbd</span>
                  <div className="flex flex-1 items-center gap-2">
                    {deck.bottomRow.map((spot) => {
                      const cfg = CABIN_CONFIGS[spot.id] || {
                        planLabel: spot.planLabel,
                        categoryName: "Stateroom",
                        colorClass: "bg-[#7BA4C0] border-[#668FA8]",
                        textClass: "text-white",
                      };
                      const isSelected = selectedSpotId === spot.id;
                      const { disabled, reason } = isCabinDisabled(spot);

                      return (
                        <button
                          key={spot.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => onSelectSpot(spot.id)}
                          className={cn(
                            "relative flex h-14 flex-1 flex-col items-center justify-center rounded-lg border-2 p-1 text-xs font-bold transition-all shadow-sm",
                            isSelected
                              ? "z-10 border-gold-bright bg-obsidian text-white ring-4 ring-gold-bright/30 scale-105 shadow-md"
                              : disabled
                              ? "cursor-not-allowed border-zinc-300 bg-[#D8D7D3] text-zinc-400 opacity-60"
                              : `${cfg.colorClass} ${cfg.textClass} hover:brightness-95 hover:scale-102 cursor-pointer`
                          )}
                        >
                          {cfg.isEarlyBird && !disabled && !isSelected && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-semibold text-white shadow-xs">
                              Early bird
                            </span>
                          )}

                          {disabled ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-tighter text-zinc-500">
                                {reason || "Unavailable"}
                              </span>
                              <span className="text-[10px] font-medium text-zinc-400 line-through">
                                {spot.planLabel}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-xs font-extrabold tracking-tight">
                                {spot.planLabel}
                              </span>
                              {isSelected && (
                                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-gold-bright text-obsidian shadow">
                                  <Check className="size-2.5 stroke-[3]" />
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* If bow is on the right (Summer Cruise) */}
              {deck.bow === "right" && (
                <div className="relative flex h-32 w-16 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 60 120" className="size-full fill-[#E1E0DC] stroke-[#C8C6BE] stroke-2">
                    <path d="M 5 5 C 40 20 55 45 55 60 C 55 75 40 100 5 115 Z" />
                  </svg>
                  <span className="absolute text-[10px] font-bold uppercase tracking-widest text-ink/40 [writing-mode:vertical-rl]">
                    Bow
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Aqua Category Legend */}
      <div className="space-y-2 border-t border-ink/10 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Category Legend
        </span>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-ink/80">
          {vesselId === "summer-cruise" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#2A4250] bg-[#355263]" />
                <span>Master Suite</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#558195] bg-[#6A9AB0]" />
                <span>Deluxe Double</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#8FB4C9] bg-[#A7C7D9]" />
                <span>Family Suite</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-zinc-400 bg-[#D8D7D3]" />
                <span>Unavailable / Booked</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#1C3B4A] bg-[#254B5E]" />
                <span>Premium Panorama</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#3C647B] bg-[#4B7993]" />
                <span>Premium Lake View / Vista</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-[#8FB4C9] bg-[#A7C7D9]" />
                <span>Deluxe Family</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded border border-zinc-400 bg-[#D8D7D3]" />
                <span>Unavailable / Booked</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Cabin Detail Preview Card (Aqua Expeditions style) */}
      {selectedSpot && (
        <div className="overflow-hidden rounded-2xl border-2 border-teal-deep/30 bg-white shadow-md animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Photo */}
            <div className="relative aspect-[16/10] md:col-span-5 md:aspect-auto">
              <img
                src={
                  (selectedSpot.roomCategoryId && ROOM_PHOTOS[selectedSpot.roomCategoryId]) ||
                  "/images/rooms/sc-master.webp"
                }
                alt={selectedSpot.name}
                className="size-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                {selectedConfig?.categoryName || selectedSpot.name}
              </div>
            </div>

            {/* Information Details */}
            <div className="p-4 sm:p-5 md:col-span-7">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-deep">
                    Selected for Cabin {cabinIndex + 1}
                  </span>
                  <h4 className="font-display text-lg font-medium text-ink sm:text-xl">
                    {selectedSpot.name}
                  </h4>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {formatPrice(selectedSpot.basePriceMYR)}/night
                </span>
              </div>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <Maximize2 className="size-3.5 text-teal-deep" />
                  <span>{selectedSpot.areaSqm} sqm / {Math.round(selectedSpot.areaSqm * 10.764)} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-teal-deep" />
                  <span>{selectedSpot.maxOccupancy} guests (max)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="size-3.5 text-teal-deep" />
                  <span>{selectedSpot.bedType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="size-3.5 text-teal-deep" />
                  <span>En-suite Bathroom</span>
                </div>
              </div>

              <div className="mt-4 border-t border-ink/10 pt-3 text-[11px] text-text-muted">
                Fully air-conditioned · Organic amenities · Panoramic water views
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
