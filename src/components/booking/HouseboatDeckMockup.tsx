"use client";

import { motion } from "framer-motion";
import { Bed, Users, Check, Ban, Navigation, Compass, Waves, Sparkles, Eye } from "lucide-react";
import type { CabinDeckSlot } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface HouseboatDeckMockupProps {
  activeDeck: "upper" | "main" | "lower";
  cabins: CabinDeckSlot[];
  selectedCabinIds: string[];
  onToggleCabin: (cabinId: string, status: string) => void;
  onSelectDeck: (deck: "upper" | "main" | "lower") => void;
}

const DECK_META = {
  upper: {
    name: "Upper Deck",
    subtitle: "Observation Sun Deck & Panorama Staterooms",
    level: "Deck 3",
    desc: "Highest vantage point aboard with open-air sun loungers and panoramic horizons.",
  },
  main: {
    name: "Main Deck",
    subtitle: "Deluxe Staterooms & Central Dining Saloon",
    level: "Deck 2",
    desc: "Direct access to the air-conditioned dining lounge, buffet galley, and forward veranda.",
  },
  lower: {
    name: "Lower Deck",
    subtitle: "Waterline Family Suites & Adventure Launch Bay",
    level: "Deck 1",
    desc: "Scenic waterline portholes and immediate boarding access to tender boats and kayaks.",
  },
};

export function HouseboatDeckMockup({
  activeDeck,
  cabins,
  selectedCabinIds,
  onToggleCabin,
  onSelectDeck,
}: HouseboatDeckMockupProps) {
  const currentCabins = cabins.filter((c) => c.deck === activeDeck);
  const meta = DECK_META[activeDeck];

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-7 shadow-sm">
      {/* Deck Mockup Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-ink/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-soft/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-deep">
              {meta.level}
            </span>
            <h4 className="font-display text-xl font-medium text-ink sm:text-2xl">
              {meta.name} Layout Mockup
            </h4>
          </div>
          <p className="mt-1 text-xs text-text-muted">{meta.desc}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-teal-deep/30 bg-teal-soft/10" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-teal-deep text-white flex items-center justify-center text-[8px]">
              ✓
            </span>
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-zinc-200 border border-zinc-300" />
            Booked
          </span>
        </div>
      </div>

      {/* Houseboat Vessel Hull Outline (Bus/Airplane seat selection style) */}
      <div className="mt-6 mx-auto max-w-2xl">
        <div className="relative rounded-3xl border-2 border-dashed border-teal-deep/25 bg-[#F4F7F8] p-4 sm:p-8 shadow-inner overflow-hidden">
          {/* Navigation Orientation Banner (Bow / Stern) */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-teal-deep/70 pb-4 border-b border-teal-deep/10">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              ▲ BOW (Forward Lake Views)
            </span>
            <span className="text-[10px] text-text-muted font-normal">
              Port (Left) · Starboard (Right)
            </span>
            <span className="flex items-center gap-1.5">
              STERN (Aft) ▼
              <span className="size-2 rounded-full bg-rose-500" />
            </span>
          </div>

          {/* Forward Vessel Zone */}
          <div className="my-4 rounded-xl border border-teal-deep/10 bg-white/70 p-3 text-center text-xs font-medium text-teal-deep shadow-xs">
            {activeDeck === "upper" && (
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles className="size-3.5 text-gold-bright" />
                Forward Sun Deck & 360° Observation Veranda
              </span>
            )}
            {activeDeck === "main" && (
              <span className="flex items-center justify-center gap-1.5">
                <Compass className="size-3.5 text-teal-deep" />
                Forward Observation Balcony & Helm
              </span>
            )}
            {activeDeck === "lower" && (
              <span className="flex items-center justify-center gap-1.5">
                <Waves className="size-3.5 text-teal-deep" />
                Forward Anchor Bay & Crew Quarters
              </span>
            )}
          </div>

          {/* Interactive Staterooms Grid (Mockup Rooms) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {currentCabins.map((cabin) => {
              const isSelected = selectedCabinIds.includes(cabin.id);
              const isUnavailable = cabin.status === "unavailable";

              return (
                <motion.div
                  key={cabin.id}
                  whileHover={!isUnavailable ? { scale: 1.02 } : {}}
                  whileTap={!isUnavailable ? { scale: 0.98 } : {}}
                  onClick={() => onToggleCabin(cabin.id, cabin.status)}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl border-2 p-4 transition-all duration-200 select-none",
                    isUnavailable
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-60"
                      : "cursor-pointer",
                    isSelected
                      ? "border-teal-deep bg-teal-deep text-white shadow-lg ring-2 ring-gold-bright/50"
                      : "border-ink/10 bg-white hover:border-teal-deep/50 hover:shadow-md"
                  )}
                >
                  {/* Top Status & Cabin Label */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          isSelected ? "text-gold-bright" : "text-text-muted"
                        )}
                      >
                        {cabin.deckLabel} · {cabin.slotPosition?.label || cabin.cabinNumber}
                      </span>
                      <h5
                        className={cn(
                          "font-display text-base font-semibold leading-snug mt-0.5",
                          isSelected ? "text-white" : "text-ink"
                        )}
                      >
                        {cabin.name}
                      </h5>
                    </div>

                    {/* Badge */}
                    <div>
                      {isUnavailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                          <Ban className="size-3" /> Booked
                        </span>
                      ) : isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-bright px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-obsidian shadow-sm">
                          <Check className="size-3" /> Selected
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-teal-deep/20 bg-teal-soft/10 px-2 py-0.5 text-[10px] font-semibold text-teal-deep">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Spec Icons */}
                  <div
                    className={cn(
                      "my-3 flex flex-wrap items-center gap-3 text-xs border-y py-2",
                      isSelected
                        ? "border-white/15 text-white/80"
                        : "border-ink/6 text-text-muted"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <Bed className="size-3.5" />
                      {cabin.bedType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      Up to {cabin.maxOccupancy}
                    </span>
                    <span>{cabin.areaSqft} sq ft</span>
                  </div>

                  {/* Bottom Price & Action Tag */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          isSelected ? "text-white/60" : "text-text-muted"
                        )}
                      >
                        Voyage Fare
                      </span>
                      <p
                        className={cn(
                          "text-base font-bold",
                          isSelected ? "text-gold-bright" : "text-ink"
                        )}
                      >
                        {formatPrice(cabin.basePriceMYR)}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                        isUnavailable
                          ? "hidden"
                          : isSelected
                          ? "bg-white text-teal-deep"
                          : "bg-teal-deep/10 text-teal-deep group-hover:bg-teal-deep group-hover:text-white"
                      )}
                    >
                      {isSelected ? "Remove" : "Select Room"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Central Gangway Divider */}
          <div className="my-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-teal-deep/50 py-1 border-y border-dashed border-teal-deep/15">
            <span>◄ Central Houseboat Gangway & Hallway ►</span>
          </div>

          {/* Aft Vessel Zone */}
          <div className="rounded-xl border border-teal-deep/10 bg-white/70 p-3 text-center text-xs font-medium text-teal-deep shadow-xs">
            {activeDeck === "upper" && (
              <span className="flex items-center justify-center gap-1.5">
                Shaded Sunset Lounge & Observation Bar (Stern)
              </span>
            )}
            {activeDeck === "main" && (
              <span className="flex items-center justify-center gap-1.5">
                Central Air-Conditioned Saloon, Dining & Galley (Stern)
              </span>
            )}
            {activeDeck === "lower" && (
              <span className="flex items-center justify-center gap-1.5">
                <Waves className="size-3.5 text-teal-deep" />
                Catamaran Swim Platform, Kayak Bay & Tender Launch (Stern)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
