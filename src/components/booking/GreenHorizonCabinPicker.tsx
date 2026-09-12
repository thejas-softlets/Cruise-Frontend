"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Users, Layers, Check, Ban, Anchor, Languages, X } from "lucide-react";
import type { RoomCategory } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  GH_FLOORS,
  GH_CABIN_SPOTS,
  type GhCabinSpot,
  type GhFloorId,
} from "@/lib/gh-deck-plan";

interface GreenHorizonCabinPickerProps {
  roomCategories: RoomCategory[];
  selectedSpotIds: string[];
  onToggleSpot: (spotId: string) => void;
}

/**
 * Visual cabin selector — renders the actual Green Horizon deck diagrams with
 * clickable hotspots (Aqua Expeditions step-1 style), an EN/中文 plan toggle,
 * and a detail card for the focused spot.
 */
export function GreenHorizonCabinPicker({
  roomCategories,
  selectedSpotIds,
  onToggleSpot,
}: GreenHorizonCabinPickerProps) {
  const [floorId, setFloorId] = useState<GhFloorId>("first");
  const [showCn, setShowCn] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const floor = GH_FLOORS.find((f) => f.id === floorId) ?? GH_FLOORS[0];
  const spots = useMemo(() => GH_CABIN_SPOTS.filter((s) => s.floor === floorId), [floorId]);
  const focus = spots.find((s) => s.id === focusId) ?? null;
  const roomById = useMemo(
    () => new Map(roomCategories.map((r) => [r.id, r])),
    [roomCategories]
  );

  const toggle = (spot: GhCabinSpot) => {
    if (spot.status === "unavailable" || spot.kind === "facility") return;
    onToggleSpot(spot.id);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
      {/* ── Floor tabs + language toggle ─────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 bg-[#FAFAF8] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {GH_FLOORS.map((f) => {
            const floorSpots = GH_CABIN_SPOTS.filter((s) => s.floor === f.id && s.kind === "cabin");
            const avail = floorSpots.filter((s) => s.status === "available").length;
            const active = f.id === floorId;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => { setFloorId(f.id); setFocusId(null); }}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                  active
                    ? "bg-obsidian text-white shadow"
                    : "bg-ink/5 text-ink hover:bg-black/10"
                )}
              >
                {f.name}
                <span className={cn("ml-2 text-[10px] font-medium", active ? "text-white/70" : "text-text-muted")}>
                  {avail > 0 ? `${avail} available` : "facilities"}
                </span>
                {selectedSpotIds.some((id) => id.startsWith(`gh-${f.id === "ground" ? "g" : f.id === "first" ? "1" : "2"}`)) && (
                  <span className="ml-1.5 inline-block size-1.5 rounded-full bg-gold-bright align-middle" />
                )}
             </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowCn((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-[11px] font-semibold text-ink/70 transition hover:bg-ink/5"
          title="Toggle plan language"
        >
          <Languages className="size-3.5" />
          {showCn ? "中文图" : "EN plan"}
        </button>
      </div>

      {/* ── Deck plan with hotspots ──────────────────────────────────── */}
      <div className="p-4 sm:p-6">
        <div className="relative mx-auto max-w-3xl">
          <img
            src={showCn ? floor.imageCn : floor.imageEn}
            alt={`${floor.name} plan`}
            className="w-full rounded-xl border border-ink/8 bg-white"
          />
          {/* Hotspot layer — % rects aligned to the diagram */}
          <div className="absolute inset-0">
            {spots.map((spot) => {
              const isSel = selectedSpotIds.includes(spot.id);
              const isFocus = focusId === spot.id;
              const isBooked = spot.status === "unavailable";
              const isCabin = spot.kind === "cabin";
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => { setFocusId(isFocus ? null : spot.id); if (isCabin && !isBooked) toggle(spot); }}
                  onMouseEnter={() => setFocusId(spot.id)}
                  aria-label={`${spot.name} — ${isBooked ? "unavailable" : formatPrice(spot.basePriceMYR)}`}
                  className={cn(
                    "group absolute rounded-md border-2 transition-all duration-200",
                    isSel
                      ? "border-emerald-600 bg-emerald-500/25 z-10"
                      : isBooked
                        ? "border-zinc-400/70 bg-zinc-500/20 cursor-not-allowed"
                        : isCabin
                          ? "border-teal-deep/60 bg-teal-soft/30 hover:bg-teal-soft/60 hover:border-teal-deep cursor-pointer"
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
                </button>
              );
            })}
          </div>

          {/* Bow marker */}
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-teal-deep/60 [writing-mode:vertical-rl]">
            Bow →
          </span>
        </div>

        {/* ── Focused spot detail card ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {focus && (
            <motion.div
              key={focus.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="mt-4 flex flex-col gap-4 rounded-xl border border-teal-deep/25 bg-[#FAFAF8] p-4 sm:flex-row sm:items-center"
            >
              {focus.roomCategoryId && (
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                  <img
                    src={roomById.get(focus.roomCategoryId)?.image.src ?? undefined}
                    alt={focus.name}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-deep">
                      {floor.name} · {focus.planLabel}
                    </p>
                    <h4 className="font-display text-lg font-medium text-ink">{focus.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFocusId(null)}
                    className="text-ink/40 hover:text-ink"
                    aria-label="Close detail"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {focus.kind === "cabin" ? (
                  <>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Bed className="size-3.5 text-teal-deep" />{focus.bedType}</span>
                      <span className="flex items-center gap-1"><Users className="size-3.5 text-teal-deep" />Max {focus.maxOccupancy}</span>
                      <span className="flex items-center gap-1"><Layers className="size-3.5 text-teal-deep" />{focus.areaSqm} sqm</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display text-lg font-semibold text-obsidian">
                        {formatPrice(focus.basePriceMYR)} <span className="text-xs font-normal text-text-muted">/ night</span>
                      </span>
                      {focus.status === "unavailable" ? (
                        <span className="rounded-full bg-zinc-200 px-3 py-1 text-[11px] font-semibold text-zinc-600">Booked</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggle(focus)}
                          className={cn(
                            "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                            selectedSpotIds.includes(focus.id)
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-obsidian text-white hover:bg-gold-bright"
                          )}
                        >
                          {selectedSpotIds.includes(focus.id) ? "✓ Selected" : "Select cabin"}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-text-muted">
                    Shared facility — no booking needed, shown for orientation.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legend ───────────────────────────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border-2 border-teal-deep/60 bg-teal-soft/30" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border-2 border-emerald-600 bg-emerald-500/25" /> Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border-2 border-zinc-400/70 bg-zinc-500/20" /> Booked
          </span>
          <span className="flex items-center gap-1.5">
            <Anchor className="size-3 text-teal-deep" /> Facilities shown for orientation
          </span>
        </div>
      </div>
    </div>
  );
}
