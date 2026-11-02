"use client";

import { useState } from "react";
import { Clock, Download, Calendar, Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/types";

interface PackageItinerarySectionProps {
  itinerary: ItineraryDay[];
  seasonalItineraries?: Record<string, ItineraryDay[]>;
  pdfUrl?: string;
  dayLabel?: string;
}

export function PackageItinerarySection({
  itinerary,
  seasonalItineraries,
  pdfUrl = "/documents/summer-cruise-route-and-itinerary.pdf",
  dayLabel = "Day",
}: PackageItinerarySectionProps) {
  const [activeSeason, setActiveSeason] = useState<"mar-oct" | "oct-mar">("mar-oct");

  const currentItinerary =
    (seasonalItineraries && seasonalItineraries[activeSeason]) || itinerary;

  return (
    <section id="itinerary" className="scroll-mt-28 pt-20">
      {/* Header with Season Tabs and Download PDF Button */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <span className="font-secondary text-xs font-semibold uppercase tracking-widest text-gold-deep">
            Voyage Schedule
          </span>
          <h2 className="font-display mt-1 text-3xl font-medium text-ink sm:text-4xl">
            Expedition Itinerary
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-muted flex items-center gap-1.5">
            <Compass className="size-4 text-teal-deep shrink-0" />
            <span>
              Both <strong>Summer Cruise</strong> &amp; <strong>Green Horizon</strong> follow the same scenic lake route and itinerary.
            </span>
          </p>
        </div>

        {/* Action: Download PDF */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 rounded-2xl border border-teal-deep/20 bg-teal-soft/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-teal-deep transition-all hover:bg-teal-deep hover:text-white shadow-sm"
          >
            <Download className="size-4 stroke-[2.5]" />
            Download Itinerary PDF
          </a>
        )}
      </div>

      {/* Season Switcher Tabs */}
      {seasonalItineraries && (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/8 bg-white p-2 shadow-sm sm:inline-flex">
          <button
            type="button"
            onClick={() => setActiveSeason("mar-oct")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeSeason === "mar-oct"
                ? "bg-teal-deep text-white shadow-md"
                : "text-text-muted hover:text-ink hover:bg-ink/5"
            )}
          >
            <Calendar className="size-3.5" />
            <span>March – October</span>
            <span className={cn(
              "ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              activeSeason === "mar-oct" ? "bg-white/20 text-white" : "bg-teal-soft/30 text-teal-deep"
            )}>
              Kelah Sanctuary
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSeason("oct-mar")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeSeason === "oct-mar"
                ? "bg-teal-deep text-white shadow-md"
                : "text-text-muted hover:text-ink hover:bg-ink/5"
            )}
          >
            <Calendar className="size-3.5" />
            <span>October – March</span>
            <span className={cn(
              "ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              activeSeason === "oct-mar" ? "bg-white/20 text-white" : "bg-gold/20 text-gold-deep"
            )}>
              Elephant Village
            </span>
          </button>
        </div>
      )}

      {/* Daily Itinerary Cards */}
      <ol className="space-y-6">
        {currentItinerary.map((day) => {
          return (
            <li
              key={day.day}
              className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm transition-all duration-300 hover:border-ink/15 hover:shadow-md"
            >
              {/* Header: Day Number + Day Title + Meals */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/6 bg-[#FAF9F6] px-6 py-4 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-deep text-xs font-bold text-white shadow-sm">
                    {day.day}
                  </span>
                  <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">
                    {dayLabel} {day.day}: {day.title}
                  </h3>
                </div>
                {day.meals && day.meals.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {day.meals.map((meal) => (
                      <span
                        key={meal}
                        className="rounded-full bg-gold/10 px-3 py-1 font-secondary text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-deep border border-gold/20"
                      >
                        {meal}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule Body */}
              <div className="p-6 sm:p-8">
                {day.schedule && day.schedule.length > 0 ? (
                  <div className="divide-y divide-ink/8">
                    {day.schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-3.5 first:pt-0 last:pb-0"
                      >
                        {/* Time Slot Badge */}
                        <div className="shrink-0 sm:w-48">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-deep/10 bg-teal-deep/5 px-2.5 py-1 font-secondary text-xs font-semibold tracking-wide text-teal-deep">
                            <Clock className="size-3 shrink-0" />
                            {item.time}
                          </span>
                        </div>

                        {/* Activity Description */}
                        <p className="font-body text-sm font-normal text-ink/85 leading-relaxed">
                          {item.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm leading-relaxed text-text-muted">
                    {day.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Program Disclaimer */}
      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-amber-50/70 p-4 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
        <Sparkles className="size-4 shrink-0 text-amber-600 mt-0.5" />
        <span>
          <strong>Note:</strong> The schedule of programs is subject to change according to weather conditions and other unforeseen lake circumstances, without prior notice.
        </span>
      </div>
    </section>
  );
}
