"use client";

import { ArrowUpRight, Bed, Coffee, Compass, MapPin, Sparkles, Utensils } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

const PACKAGES_DATA = {
  "summer-cruise": {
    name: "Summer Cruise",
    title: "Leisure Package",
    tagline: "Explore Kenyir Lake with Summer Cruise",
    description:
      "Admire the breathtaking views of Kenyir Lake and take advantage of a range of water activities, nature trails, and authentic dining during your visit.",
    image: "/images/real/Leisure-package.webp",
    meetingPoint:
      "Land transfer available from TGG Sultan Mahmud Airport, MBKT Bus Station, Ming Paragon Hotel & Hotel Sri Malaysia, Kampung Cina.",
    boardingPoint: "Gawi Jetty, Pengkalan Gawi, Tasik Kenyir",
    checkIn: "12:00 PM (Friday / Monday)",
    checkOut3D2N: "04:00 PM (Sunday / Wednesday)",
    checkOut4D3N: "11:00 AM (Monday / Thursday)",
    packageSlug: "3d2n-kenyir-explorer",
  },
  "green-horizon": {
    name: "Green Horizon",
    title: "Grand Leisure Expedition",
    tagline: "Experience Southeast Asia's Largest Man-Made Lake on Green Horizon",
    description:
      "A grand voyage across 340+ rainforest islands featuring expansive observation decks, full-board gourmet meals, cave explorations, and secluded waterfall swims.",
    image: "/images/real/DJI_0911-min-scaled.webp",
    meetingPoint:
      "Land transfer available from TGG Sultan Mahmud Airport, MBKT Bus Station, Ming Paragon Hotel & Hotel Sri Malaysia, Kampung Cina.",
    boardingPoint: "Gawi Jetty, Pengkalan Gawi, Tasik Kenyir",
    checkIn: "12:00 PM (Friday / Monday)",
    checkOut3D2N: "04:00 PM (Sunday / Wednesday)",
    checkOut4D3N: "11:00 AM (Monday / Thursday)",
    packageSlug: "4d3n-kenyir-grand-voyage",
  },
};

const AMENITY_BADGES = [
  { icon: Bed, label: "Stay" },
  { icon: Compass, label: "Explore" },
  { icon: Sparkles, label: "Activities" },
  { icon: Utensils, label: "Food" },
  { icon: Coffee, label: "Tea" },
];

export function PackageScheduleSection() {
  const [selectedVessel, setSelectedVessel] = useState<"summer-cruise" | "green-horizon">("summer-cruise");
  const [selectedDuration, setSelectedDuration] = useState<"3D2N" | "4D3N">("3D2N");

  const pkg = PACKAGES_DATA[selectedVessel];

  return (
    <section id="packages" className="scroll-mt-20 bg-[#faf9f6] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Vessel Selector Tabs */}
        <FadeIn>
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-black/5 p-1.5 backdrop-blur">
              <button
                type="button"
                onClick={() => setSelectedVessel("summer-cruise")}
                className={cn(
                  "font-secondary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:text-sm",
                  selectedVessel === "summer-cruise"
                    ? "bg-obsidian text-white shadow-md"
                    : "text-ink/60 hover:text-ink",
                )}
              >
                Summer Cruise
              </button>
              <button
                type="button"
                onClick={() => setSelectedVessel("green-horizon")}
                className={cn(
                  "font-secondary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:text-sm",
                  selectedVessel === "green-horizon"
                    ? "bg-obsidian text-white shadow-md"
                    : "text-ink/60 hover:text-ink",
                )}
              >
                Green Horizon
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Feature Package Card */}
        <div className="mt-10">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-xl shadow-ink/5 lg:grid lg:grid-cols-12">
              {/* Left Image & Amenities Column */}
              <div className="relative min-h-[340px] bg-obsidian lg:col-span-6">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent"
                />

                {/* Floating Amenities Strip */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {AMENITY_BADGES.map((b) => {
                      const Icon = b.icon;
                      return (
                        <div key={b.label} className="flex flex-col items-center gap-1">
                          <div className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                            <Icon className="size-4" />
                          </div>
                          <span className="text-[0.6875rem] font-medium text-white/90">{b.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs font-medium text-white/80">
                    Marvel views at the stunning scenery of Kenyir Lake.
                  </p>
                </div>
              </div>

              {/* Right Content & Schedule Column */}
              <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-display text-3xl font-medium text-ink sm:text-4xl">
                      {pkg.title}
                    </h3>

                    {/* Duration Badges */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("3D2N")}
                        className={cn(
                          "rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider transition-colors",
                          selectedDuration === "3D2N"
                            ? "bg-obsidian text-white"
                            : "bg-ink/5 text-ink/70 hover:bg-ink/10",
                        )}
                      >
                        3D2N
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("4D3N")}
                        className={cn(
                          "rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider transition-colors",
                          selectedDuration === "4D3N"
                            ? "bg-obsidian text-white"
                            : "bg-ink/5 text-ink/70 hover:bg-ink/10",
                        )}
                      >
                        4D3N
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gold-bright">{pkg.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-text-muted">{pkg.description}</p>

                  {/* Transfer & Timings Info List */}
                  <div className="mt-6 space-y-4 border-t border-ink/8 pt-6 text-xs text-ink/80 sm:text-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink">
                        <MapPin className="size-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-ink">Meeting Point: </span>
                        <span className="text-text-muted">{pkg.meetingPoint}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink">
                        <MapPin className="size-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-ink">Boarding / De-boarding: </span>
                        <span className="text-text-muted">{pkg.boardingPoint}</span>
                      </div>
                    </div>

                    {/* Schedule times */}
                    <div className="rounded-2xl bg-ink/3 p-4 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <span className="font-semibold text-ink">Check-in: </span>
                        <span className="text-text-muted">{pkg.checkIn}</span>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="font-semibold text-ink">Check-out: </span>
                        <span className="inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-bright">
                          {selectedDuration === "3D2N" ? pkg.checkOut3D2N : pkg.checkOut4D3N}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/packages/${pkg.packageSlug}`}
                    className="font-secondary inline-flex min-h-12 items-center gap-2 rounded-full bg-obsidian px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-gold-bright"
                  >
                    Explore Package
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                  <Link
                    href="/the-lake"
                    className="font-secondary inline-flex min-h-12 items-center gap-1.5 rounded-full border border-ink/15 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
                  >
                    <Compass className="size-4" />
                    Voyage Map
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
