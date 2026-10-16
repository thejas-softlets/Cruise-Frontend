"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, MapPin, ChevronRight, ChevronLeft, Sparkles, Ship, Calendar, Waves } from "lucide-react";
import type { MapWaypoint } from "@/types";
import {
  WATER_NAVIGATION_CHANNELS,
  MOCK_WAYPOINTS,
  CRUISE_SEASON_ROUTES,
} from "@/lib/api/mock/booking";
import { cn } from "@/lib/utils";

const RealCruiseMap = dynamic(() => import("./RealCruiseMap"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full min-h-[520px] flex-col items-center justify-center bg-[#d5e8ee] p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/80 shadow-md backdrop-blur-sm">
        <Compass className="size-7 text-teal-deep animate-spin-slow" />
      </div>
      <span className="mt-3 text-xs font-bold uppercase tracking-widest text-teal-deep">
        Loading Lake Kenyir Cartography...
      </span>
      <span className="mt-1 text-[11px] text-text-muted">
        Calibrating water channels & lake topography (No land routes)
      </span>
    </div>
  ),
});

interface DynamicCruiseMapProps {
  waypoints?: MapWaypoint[];
  packageSlug?: string;
  packageTitle?: string;
  durationLabel?: string;
  className?: string;
}

export function DynamicCruiseMap({
  waypoints: initialWaypoints,
  packageSlug = "3d2n-kenyir-explorer",
  packageTitle,
  durationLabel,
  className,
}: DynamicCruiseMapProps) {
  // Determine initial route key
  const defaultRouteKey =
    packageSlug === "4d3n-kenyir-grand-voyage" ? "mar-oct-4d3n" : "mar-oct-3d2n";

  const [activeRouteKey, setActiveRouteKey] = useState<string>(defaultRouteKey);
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);

  // Active route metadata
  const activeRouteMeta =
    CRUISE_SEASON_ROUTES.find((r) => r.id === activeRouteKey) ||
    CRUISE_SEASON_ROUTES[0];

  // Active waypoints & navigation path for the selected route
  const currentWaypoints =
    MOCK_WAYPOINTS[activeRouteKey] ||
    initialWaypoints ||
    MOCK_WAYPOINTS["mar-oct-3d2n"];

  const currentNavigationPath =
    WATER_NAVIGATION_CHANNELS[activeRouteKey] ||
    WATER_NAVIGATION_CHANNELS["mar-oct-3d2n"];

  const activeWaypoint =
    currentWaypoints[activeWaypointIndex] || currentWaypoints[0];

  const handleRouteChange = (routeId: string) => {
    setActiveRouteKey(routeId);
    setActiveWaypointIndex(0);
  };

  const handlePrev = () => {
    setActiveWaypointIndex((prev) =>
      prev > 0 ? prev - 1 : currentWaypoints.length - 1
    );
  };

  const handleNext = () => {
    setActiveWaypointIndex((prev) =>
      prev < currentWaypoints.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-ink/10 bg-[#EBF3F5] shadow-xl",
        className
      )}
    >
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-teal-soft/20 text-teal-deep">
            <Ship className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-ink">
              Kenyir Lake Passenger Route Chart
            </h3>
            <p className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
              <Waves className="size-3 text-teal-deep" />
              <span>Strict lake water passage only · No land routes</span>
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-400 shadow-sm" />
            Active Landmark
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-cyan-700 shadow-sm" />
            Lake Fairway (Water Only)
          </span>
        </div>
      </div>

      {/* 4 Seasonal Route Selector Tabs */}
      <div className="border-b border-ink/8 bg-slate-50/90 px-6 py-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-gold-deep" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/80">
              Select Passenger Route:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
            {CRUISE_SEASON_ROUTES.map((route) => {
              const isSelected = route.id === activeRouteKey;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => handleRouteChange(route.id)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    isSelected
                      ? "bg-teal-deep text-white shadow-sm ring-1 ring-teal-deep"
                      : "bg-white text-ink/70 hover:bg-white/80 hover:text-ink border border-ink/10"
                  )}
                >
                  <span>{route.seasonLabel}</span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      isSelected ? "bg-amber-400 text-obsidian" : "bg-ink/10 text-ink"
                    )}
                  >
                    {route.durationLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Route Summary Callout */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-teal-soft/15 px-3.5 py-2 text-xs text-teal-deep">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">{activeRouteMeta.title}:</span>
            <span className="text-text-muted">{activeRouteMeta.description}</span>
          </div>
          <span className="font-semibold text-gold-deep">
            {activeRouteMeta.seasonTag}
          </span>
        </div>
      </div>

      {/* Main Map Body: Real Leaflet Map + Detail Drawer */}
      <div className="relative grid min-h-[540px] lg:grid-cols-[1fr_370px]">
        {/* Left / Center: Real Lake Kenyir Map */}
        <div className="relative min-h-[460px] w-full">
          <RealCruiseMap
            waypoints={currentWaypoints}
            activeWaypointIndex={activeWaypointIndex}
            onSelectWaypoint={(idx) => setActiveWaypointIndex(idx)}
            navigationPath={currentNavigationPath}
            className="size-full min-h-[460px]"
          />
        </div>

        {/* Right: Waypoint Detail Drawer */}
        <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-ink/8 bg-white p-6 sm:p-7 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeRouteKey}-${activeWaypoint?.id || activeWaypointIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Waypoint Header & Day Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft/20 px-3 py-1 text-xs font-semibold text-teal-deep">
                  <Sparkles className="size-3 text-gold-bright" />
                  Day {activeWaypoint?.dayNumber}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {activeWaypoint?.type}
                </span>
              </div>

              <div>
                <h4 className="font-display text-2xl font-medium tracking-tight text-ink">
                  {activeWaypoint?.title}
                </h4>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-teal-deep">
                  <MapPin className="size-3.5" />
                  {activeWaypoint?.name}
                </p>
                {activeWaypoint?.lat && (
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Coordinates: {activeWaypoint.lat.toFixed(4)}° N, {activeWaypoint.lng.toFixed(4)}° E
                  </p>
                )}
              </div>

              {/* Waypoint Real Photo */}
              {activeWaypoint?.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink/5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeWaypoint.imageUrl}
                    alt={activeWaypoint.title || activeWaypoint.name}
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2.5 left-3 text-[11px] font-medium uppercase tracking-wider text-white/90">
                    {activeWaypoint.name}
                  </span>
                </div>
              )}

              {/* Short Narrative Description */}
              <p className="text-xs leading-relaxed text-text-muted">
                {activeWaypoint?.shortDesc}
              </p>

              {/* Signature Activities Chips */}
              {activeWaypoint?.activities && activeWaypoint.activities.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/70">
                    Signature Experiences
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {activeWaypoint.activities.map((act) => (
                      <span
                        key={act}
                        className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-medium text-ink/80 border border-ink/8"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Booking CTA button */}
          <div className="mt-6 pt-4 border-t border-ink/8">
            <a
              href="#book-cabins"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-deep px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-teal-900"
            >
              <span>Reserve Stateroom On This Route</span>
              <ChevronRight className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Route Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 bg-white/95 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {currentWaypoints.map((wp, idx) => {
            const isActive = idx === activeWaypointIndex;
            return (
              <button
                key={`${wp.id}-${idx}`}
                type="button"
                onClick={() => setActiveWaypointIndex(idx)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-teal-deep text-white shadow-md"
                    : "bg-ink/5 text-text-muted hover:bg-ink/10 hover:text-ink"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive ? "bg-amber-400 text-obsidian" : "bg-ink/15 text-ink"
                  )}
                >
                  {wp.dayNumber}
                </span>
                <span>{wp.name}</span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous waypoint"
            className="flex size-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-black/5"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs font-semibold text-ink px-1">
            {activeWaypointIndex + 1} / {currentWaypoints.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next waypoint"
            className="flex size-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-black/5"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
