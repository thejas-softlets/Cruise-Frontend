"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, BedDouble, Music, Layers, Eye, Users, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/Portal";

interface Feature {
  title: string;
  desc: string;
  icon: string;
  image?: string;
}

interface FloorData {
  id: "ground" | "first" | "second";
  name: "Ground Floor" | "First Floor" | "Second Floor";
  tagline: string;
  image: string;
  features: Feature[];
}

const FLOORS: FloorData[] = [
  {
    id: "ground",
    name: "Ground Floor",
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
        image: "/images/deck/sc-dining-area.webp",
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
    tagline: "12 Private Air-Conditioned Staterooms & Bridge",
    image: "/images/deck/1st-floor-scaled.webp",
    features: [
      {
        title: "12 Private Staterooms",
        desc: "Premium, Deluxe & Superior cabins with private en-suite baths",
        icon: "bed",
        image: "/images/rooms/sc-premium.webp",
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
    tagline: "Multipurpose Hall, Karaoke KTV & Sun Deck",
    image: "/images/deck/2nd-floor-scaled.webp",
    features: [
      {
        title: "Multipurpose Hall",
        desc: "Open gathering space for events, briefings & cinema",
        icon: "users",
        image: "/images/deck/sc-multipurpose-hall.webp",
      },
      {
        title: "Karaoke KTV Rooms",
        desc: "Soundproofed entertainment suites with modern audio systems",
        icon: "music",
        image: "/images/deck/sc-karaoke-ktv.webp",
      },
      {
        title: "Top Panoramic Deck",
        desc: "Open-air 360-degree stargazing & sunrise viewing platform",
        icon: "eye",
        image: "/images/deck/sc-panoramic-deck.webp",
      },
    ],
  },
];

export function SummerCruiseDeckPlan({ className }: { className?: string }) {
  const [activeFloorId, setActiveFloorId] = useState<FloorData["id"]>("ground");
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);
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
                  "rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
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
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-medium text-text-muted">
            {activeFloor.tagline}
          </p>
        </div>

        {/* Interactive Floor Plan Grid: Diagram (Left) + Highlights (Right) */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
          {/* Floor Plan Image */}
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-[#faf8f5] p-4 flex flex-col items-center justify-center min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFloor.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeFloor.image}
                  alt={`${activeFloor.name} Floor Plan`}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-lg cursor-zoom-in"
                  onClick={() => setModalImage({ url: activeFloor.image, title: `${activeFloor.name} Floor Plan` })}
                />
                <button
                  type="button"
                  onClick={() => setModalImage({ url: activeFloor.image, title: `${activeFloor.name} Floor Plan` })}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <Maximize2 className="size-3.5" />
                  Click to enlarge floor diagram
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floor Highlights Card List */}
          <div className="space-y-3.5">
            {activeFloor.features.map((feat, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-ink/8 bg-ink/[0.02] p-4 transition-all hover:bg-ink/[0.04] hover:border-ink/15"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-soft/20 text-teal-deep">
                    {feat.icon === "dining" && <Utensils className="size-4" />}
                    {feat.icon === "bed" && <BedDouble className="size-4" />}
                    {feat.icon === "music" && <Music className="size-4" />}
                    {feat.icon === "layers" && <Layers className="size-4" />}
                    {feat.icon === "users" && <Users className="size-4" />}
                    {feat.icon === "eye" && <Eye className="size-4" />}
                    {feat.icon === "waves" && <Layers className="size-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-sm font-semibold text-ink">
                      {feat.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-text-muted leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                {/* Attached Facility Real Photo */}
                {feat.image && (
                  <div
                    onClick={() => setModalImage({ url: feat.image!, title: feat.title })}
                    className="group relative mt-3 aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl border border-ink/10 bg-ink/5 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[11px] font-medium tracking-wide">
                        {feat.title}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                        <Maximize2 className="size-2.5" />
                        View Photo
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Facility Photos and Floor Plan */}
      {modalImage && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-md transition-opacity"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5 bg-bg-base/50">
                <h3 className="font-display text-base font-semibold text-ink">
                  {modalImage.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalImage(null)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-ink/10 hover:text-ink transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-2 sm:p-4 bg-[#faf8f5] flex items-center justify-center max-h-[80vh] overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={modalImage.url}
                  alt={modalImage.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}
