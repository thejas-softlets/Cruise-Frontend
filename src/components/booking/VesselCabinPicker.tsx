"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bed, Users, Check, Ban } from "lucide-react";
import type { RoomCategory } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DeckFloor, DeckCabinSpot } from "@/lib/vessel-deck-plan";

interface VesselCabinPickerProps {
  floors: DeckFloor[];
  spots: DeckCabinSpot[];
  roomCategories: RoomCategory[];
  selectedSpotIds: string[];
  onToggleSpot: (spotId: string) => void;
  /** Which side of the plan the bow (front of the ship) sits on. */
  bowSide: "left" | "right";
}

/**
 * Visual cabin selector — renders the vessel's real deck-plan photos with
 * clickable hotspots, Aqua Expeditions step-1 style. Only floors that
 * actually carry bookable staterooms are shown (pure-facility floors like
 * the dining deck are skipped here), stacked in one continuous view with no
 * deck-switching control to click through.
 */
export function VesselCabinPicker({
  floors,
  spots,
  roomCategories,
  selectedSpotIds,
  onToggleSpot,
  bowSide,
}: VesselCabinPickerProps) {
  const [focusId, setFocusId] = useState<string | null>(null);

  const cabinFloors = useMemo(() => floors.filter((f) => f.hasCabins), [floors]);
  const categoryById = useMemo(
    () => new Map(roomCategories.map((c) => [c.id, c])),
    [roomCategories]
  );

  const focusSpot = spots.find((s) => s.id === focusId) ?? null;
  const focusCategory = focusSpot?.roomCategoryId ? categoryById.get(focusSpot.roomCategoryId) : undefined;

  function toggle(spot: DeckCabinSpot) {
    if (spot.kind !== "cabin" || spot.status === "unavailable") return;
    onToggleSpot(spot.id);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
      <div className="space-y-8 p-4 sm:p-6">
        {cabinFloors.map((floor) => {
          const floorSpots = spots.filter((s) => s.floor === floor.id);
          const cabinCount = floorSpots.filter((s) => s.kind === "cabin").length;
          const availCount = floorSpots.filter((s) => s.kind === "cabin" && s.status === "available").length;

          return (
            <div key={floor.id}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h4 className="font-display text-lg font-medium text-ink sm:text-xl">{floor.name}</h4>
                  <p className="text-xs text-text-muted">{floor.tagline}</p>
                </div>
                <span className="text-xs font-medium text-text-muted">
                  {availCount} of {cabinCount} available
                </span>
              </div>

              <div className="relative mx-auto max-w-3xl">
                <img
                  src={floor.image}
                  alt={`${floor.name} plan`}
                  className="w-full rounded-xl border border-ink/8 bg-white"
                />
                <motion.div
                  className="absolute inset-0"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
                >
                  {floorSpots.map((spot) => {
                    const isSel = selectedSpotIds.includes(spot.id);
                    const isFocus = focusId === spot.id;
                    const isBooked = spot.status === "unavailable";
                    const isCabin = spot.kind === "cabin";
                    return (
                      <motion.button
                        key={spot.id}
                        type="button"
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        transition={{ duration: 0.25 }}
                        onClick={() => {
                          setFocusId(isFocus ? null : spot.id);
                          if (isCabin && !isBooked) toggle(spot);
                        }}
                        onMouseEnter={() => setFocusId(spot.id)}
                        onFocus={() => setFocusId(spot.id)}
                        aria-label={`${spot.name} — ${isBooked ? "unavailable" : `${formatPrice(spot.basePriceMYR)}/night, ${isSel ? "selected" : "tap to select"}`}`}
                        className={cn(
                          "group absolute rounded-md border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright",
                          isSel
                            ? "z-10 border-emerald-600 bg-emerald-500/25"
                            : isBooked
                              ? "cursor-not-allowed border-zinc-400/70 bg-zinc-500/20"
                              : isCabin
                                ? "cursor-pointer border-teal-deep/60 bg-teal-soft/30 hover:border-teal-deep hover:bg-teal-soft/60"
                                : "border-dashed border-ink/20 hover:bg-amber-100/50"
                        )}
                        style={{
                          left: `${spot.rect.x}%`,
                          top: `${spot.rect.y}%`,
                          width: `${spot.rect.w}%`,
                          height: `${spot.rect.h}%`,
                        }}
                      >
                        {isSel && (
                          <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                            <Check className="size-2.5" />
                          </span>
                        )}
                        {isBooked && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Ban className="size-3.5 text-zinc-500" />
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Bow marker — points to whichever side the hull's nose is drawn on */}
                <span
                  className={cn(
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-teal-deep/60 [writing-mode:vertical-rl]",
                    bowSide === "left" ? "left-1" : "right-1 rotate-180"
                  )}
                >
                  ← Bow
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focused cabin detail strip (hover / focus / tap) */}
      <div className="border-t border-ink/8 bg-[#FAFAF8] px-4 py-3 sm:px-6">
        {focusSpot && focusSpot.kind === "cabin" ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
            <span className="font-semibold text-ink">{focusSpot.name}</span>
            <span className="flex items-center gap-1 text-text-muted"><Bed className="size-3.5 text-teal-deep" />{focusSpot.bedType}</span>
            <span className="flex items-center gap-1 text-text-muted"><Users className="size-3.5 text-teal-deep" />Max {focusSpot.maxOccupancy}</span>
            {focusCategory && <span className="text-text-muted">{focusCategory.name}</span>}
            {focusSpot.status === "available" && (
              <span className="ml-auto font-semibold text-obsidian">{formatPrice(focusSpot.basePriceMYR)}/night</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-text-muted">Hover or tap a stateroom to see its details.</span>
        )}
      </div>
    </div>
  );
}
