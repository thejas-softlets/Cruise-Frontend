"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, BedDouble, Music, Layers, Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorData {
  id: "ground" | "first" | "second";
  name: "Ground Floor" | "First Floor" | "Second Floor";
  chineseName: string;
  tagline: string;
  image: string;
  features: { title: string; desc: string; icon: string }[];
}

const FLOORS: FloorData[] = [
  {
    id: "ground",
    name: "Ground Floor",
    chineseName: "底楼",
    tagline: "Dining Saloon, Full Galley & Boarding Decks",
    image: "/images/deck/Ground-floor.webp",
    features: [
      {
        title: "Rear Deck",
        desc: "Aft embarkation & water sport access area",
        icon: "waves",
      },
      {
        title: "Dining Area",
        desc: "Spacious communal dining hall for lake-view dining",
        icon: "dining",
      },
      {
        title: "Front Deck",
        desc: "Open forward observation deck and scenic seating",
        icon: "eye",
      },
    ],
  },
  {
    id: "first",
    name: "First Floor",
    chineseName: "一楼",
    tagline: "12 Private Air-Conditioned Staterooms & Bridge",
    image: "/images/deck/1st-floor-scaled.webp",
    features: [
      {
        title: "12 Private Staterooms",
        desc: "Premium, Deluxe & Superior cabins with private en-suite baths",
        icon: "bed",
      },
      {
        title: "Passenger Lift",
        desc: "Fully accessible elevator connecting all vessel levels",
        icon: "layers",
      },
      {
        title: "Captain's Bridge",
        desc: "Forward navigation station and observation lounge",
        icon: "eye",
      },
    ],
  },
  {
    id: "second",
    name: "Second Floor",
    chineseName: "二楼",
    tagline: "Multipurpose Hall, Karaoke KTV & Sun Deck",
    image: "/images/deck/2nd-floor-scaled.webp",
    features: [
      {
        title: "Multipurpose Hall",
        desc: "Open gathering space for events, briefings & cinema",
        icon: "users",
      },
      {
        title: "Karaoke KTV Rooms",
        desc: "Soundproofed entertainment suites with modern audio systems",
        icon: "music",
      },
      {
        title: "Top Panoramic Deck",
        desc: "Open-air 360-degree stargazing & sunrise viewing platform",
        icon: "eye",
      },
    ],
  },
];

export function SummerCruiseDeckPlan({ className }: { className?: string }) {
  const [activeFloorId, setActiveFloorId] = useState<FloorData["id"]>("ground");
  const activeFloor = FLOORS.find((f) => f.id === activeFloorId) || FLOORS[0];

  return (
    <section id="deck-plan" className={cn("scroll-mt-28 pt-20", className)}>
      <div className="mb-6">
        <span className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
          Deck Plan
        </span>
        <h2 className="font-display mt-1 text-3xl font-medium text-ink sm:text-4xl">
          Embrace The Beauty of Every Moment Aboard Summer Cruise.
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-xl sm:p-8">
        {/* Floor Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-ink/8 pb-6">
          {FLOORS.map((floor) => {
            const isSelected = floor.id === activeFloorId;
            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => setActiveFloorId(floor.id)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                  isSelected
                    ? "bg-obsidian text-white shadow-md ring-1 ring-obsidian"
                    : "bg-ink/5 text-ink/70 hover:bg-ink/10 hover:text-ink"
                )}
              >
                {floor.name}
              </button>
            );
          })}
        </div>

        {/* Floor Details Header */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-obsidian px-3 py-1 font-display text-base font-semibold text-white">
              {activeFloor.name} {activeFloor.chineseName}
            </span>
            <span className="text-xs font-medium text-text-muted">
              {activeFloor.tagline}
            </span>
          </div>
        </div>

        {/* Interactive Floor Plan Grid: Diagram (Left) + Highlights (Right) */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] items-center">
          {/* Floor Plan Image */}
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-[#faf8f5] p-4 flex items-center justify-center min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFloor.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeFloor.image}
                  alt={`${activeFloor.name} Floor Plan`}
                  className="max-h-[420px] w-auto max-w-full object-contain rounded-lg"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floor Highlights Card List */}
          <div className="space-y-3">
            {activeFloor.features.map((feat, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 rounded-2xl border border-ink/8 bg-ink/[0.02] p-4 transition-all hover:bg-ink/[0.05] hover:border-ink/15"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-soft/20 text-teal-deep">
                  {feat.icon === "dining" && <Utensils className="size-4" />}
                  {feat.icon === "bed" && <BedDouble className="size-4" />}
                  {feat.icon === "music" && <Music className="size-4" />}
                  {feat.icon === "layers" && <Layers className="size-4" />}
                  {feat.icon === "users" && <Users className="size-4" />}
                  {feat.icon === "eye" && <Eye className="size-4" />}
                  {feat.icon === "waves" && <Layers className="size-4" />}
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-ink">
                    {feat.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
