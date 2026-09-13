"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Ship,
  Anchor,
  Sparkles,
} from "lucide-react";
import type { Vessel, RoomCategory } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn, whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { getDepartureDates, type DepartureDate } from "@/lib/departure-dates";
import { CHARTER_MIN_PAX, quoteCharter, type CharterPackageId } from "@/lib/charter-pricing";
import { GH_FLOORS, GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";
import { SC_FLOORS, SC_CABIN_SPOTS } from "@/lib/sc-deck-plan";
import { VesselCabinPicker } from "./VesselCabinPicker";
import { CharterConfigurator } from "./CharterConfigurator";

type BookingMode = "cabin" | "charter";
type VesselId = "summer-cruise" | "green-horizon";

interface PackageTier {
  id: CharterPackageId;
  label: string;
  nights: number;
  overview: string;
  highlights: string[];
}

const PACKAGE_TIERS: PackageTier[] = [
  {
    id: "3d2n",
    label: "3 Days · 2 Nights",
    nights: 2,
    overview:
      "An unhurried passage through the lake's sheltered coves and emerald bays — secluded waterfall lagoons at Lasir, and dining on the open teak deck as twilight mist rises off the water.",
    highlights: ["Secluded swim in Lasir waterfall lagoons", "Dawn mist tea on the upper deck", "Starlit night-sounds drift, engines cut"],
  },
  {
    id: "4d3n",
    label: "4 Days · 3 Nights",
    nights: 3,
    overview:
      "An immersive four-day expedition into Kenyir's remote reaches — prehistoric limestone caverns, hidden rainforest trails, and starlit skies deep in the wilderness.",
    highlights: ["Prehistoric Bewah cavern exploration", "Melunak rainforest giant-tree trail", "Kelah Sanctuary fish spa"],
  },
];

const VESSEL_META: Record<VesselId, { name: string; checkIn: string; checkOut: Record<CharterPackageId, string> }> = {
  "summer-cruise": {
    name: "Summer Cruise",
    checkIn: "12:00pm (Friday / Monday)",
    checkOut: { "3d2n": "4:00pm (Sunday / Wednesday)", "4d3n": "11:00am (Monday / Thursday)" },
  },
  "green-horizon": {
    name: "Green Horizon",
    checkIn: "12:00pm (Friday / Monday)",
    checkOut: { "3d2n": "1:00pm (Sunday / Wednesday)", "4d3n": "11:00am (Monday / Thursday)" },
  },
};

interface BookingWizardProps {
  vessels: Vessel[];
  roomCategories: RoomCategory[];
  initialVesselId?: VesselId;
  initialMode?: BookingMode;
}

const STEP_ICONS = [Ship, Anchor, Sparkles, Calendar, Users, CheckCircle2];

export function BookingWizard({ vessels, roomCategories, initialVesselId, initialMode }: BookingWizardProps) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<BookingMode | null>(initialMode ?? null);
  const [vesselId, setVesselId] = useState<VesselId | null>(
    initialMode === "charter" ? "green-horizon" : initialVesselId ?? null
  );
  const [packageId, setPackageId] = useState<CharterPackageId | null>(null);
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>([]);
  const [charterPax, setCharterPax] = useState(CHARTER_MIN_PAX);
  const [nonMalaysianPax, setNonMalaysianPax] = useState(0);
  const [wantsInsurance, setWantsInsurance] = useState(false);
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);
  const [guest, setGuest] = useState({
    firstName: "Alexander",
    lastName: "Tan",
    email: "alexander.tan@example.com",
    phone: "+60 12-345 6789",
    country: "Malaysia",
    requests: "Anniversary trip — a quiet table for dinner if possible.",
    agreeTerms: true,
  });
  const [bookingRef] = useState(() => `SC-${Math.floor(100000 + Math.random() * 900000)}`);

  const departureDates = useMemo(() => getDepartureDates({ limit: 12 }), []);

  const vessel = vessels.find((v) => v.id === vesselId);
  const isCharter = mode === "charter";
  const cabinSpots = vesselId === "green-horizon" ? GH_CABIN_SPOTS : SC_CABIN_SPOTS;
  const cabinFloors = vesselId === "green-horizon" ? GH_FLOORS : SC_FLOORS;
  const bowSide: "left" | "right" = vesselId === "green-horizon" ? "left" : "right";
  const selectedSpots = cabinSpots.filter((s) => selectedSpotIds.includes(s.id));
  const vesselRoomCategories = roomCategories.filter((c) => c.vesselId === vesselId);

  const nights = packageId ? PACKAGE_TIERS.find((p) => p.id === packageId)!.nights : 0;
  const cabinNightlyTotal = selectedSpots.reduce((sum, s) => sum + s.basePriceMYR, 0);
  const cabinGrandTotal = cabinNightlyTotal * nights;
  const charterQuote =
    isCharter && packageId ? quoteCharter({ packageId, pax: charterPax, nonMalaysianPax, wantsInsurance }) : null;
  const grandTotal = isCharter ? charterQuote?.grandTotal ?? 0 : cabinGrandTotal;

  // ── Step gating ──────────────────────────────────────────────────────
  const steps = isCharter
    ? ["Booking Type", "Package & Charter", "Departure Date", "Your Details", "Confirmed"]
    : ["Booking Type", "Cruise", "Package & Cabins", "Departure Date", "Your Details", "Confirmed"];
  const lastStep = steps.length - 1;

  function canProceed(): boolean {
    if (step === 0) return mode !== null;
    if (!isCharter && step === 1) return vesselId !== null;
    if ((isCharter && step === 1) || (!isCharter && step === 2)) {
      if (!packageId) return false;
      return isCharter ? true : selectedSpotIds.length > 0;
    }
    if ((isCharter && step === 2) || (!isCharter && step === 3)) return selectedDateIso !== null;
    if ((isCharter && step === 3) || (!isCharter && step === 4)) {
      return Boolean(guest.firstName.trim() && guest.lastName.trim() && /\S+@\S+\.\S+/.test(guest.email) && guest.phone.trim() && guest.agreeTerms);
    }
    return true;
  }

  function next() {
    if (step === 0 && mode === "charter") {
      setVesselId("green-horizon");
    }
    setStep((s) => Math.min(s + 1, lastStep));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const selectedDate = departureDates.find((d) => d.iso === selectedDateIso);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Progress bar */}
      <div className="mb-10 flex items-center justify-between overflow-x-auto">
        {steps.map((label, i) => {
          const Icon = STEP_ICONS[i] ?? Check;
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isDone ? "border-teal-deep bg-teal-deep text-white" : isActive ? "border-teal-deep text-teal-deep" : "border-ink/15 text-ink/30"
                  )}
                >
                  {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
                </div>
                <span className={cn("hidden text-[10px] font-medium sm:block", isActive ? "text-ink" : "text-text-muted")}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1 rounded", isDone ? "bg-teal-deep" : "bg-ink/10")} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── STEP 0: booking type ─────────────────────────────────── */}
          {step === 0 && (
            <StepShell title="How would you like to book?" subtitle="Pick individual staterooms, or take the whole ship for a private group.">
              <div className="grid gap-4 sm:grid-cols-2">
                <ModeCard
                  active={mode === "cabin"}
                  icon={Users}
                  title="Book a Cabin"
                  desc="Choose your own stateroom on a scheduled sailing, alongside other guests."
                  onClick={() => setMode("cabin")}
                />
                <ModeCard
                  active={mode === "charter"}
                  icon={Ship}
                  title="Charter the Whole Boat"
                  desc="Private full-boat charter on Green Horizon — up to 60 guests, your own itinerary dates."
                  onClick={() => setMode("charter")}
                />
              </div>
            </StepShell>
          )}

          {/* ── STEP 1 (cabin only): choose cruise ──────────────────── */}
          {!isCharter && step === 1 && (
            <StepShell title="Choose a Cruise Ship" subtitle="Both ships sail every Friday & Monday at 12:00pm from Pengkalan Gawi Jetty.">
              <div className="grid gap-4 sm:grid-cols-2">
                {(["summer-cruise", "green-horizon"] as VesselId[]).map((id) => {
                  const v = vessels.find((x) => x.id === id);
                  if (!v) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVesselId(id)}
                      className={cn(
                        "overflow-hidden rounded-2xl border-2 text-left transition-all",
                        vesselId === id ? "border-teal-deep shadow-lg" : "border-ink/10 hover:border-ink/25"
                      )}
                    >
                      <div className="relative aspect-[16/10]">
                        <img src={v.heroImage.src ?? ""} alt={v.heroImage.alt} className="size-full object-cover" />
                        {vesselId === id && (
                          <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                            <Check className="size-4" />
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-display text-lg font-medium text-ink">{v.name}</h4>
                        <p className="mt-1 text-xs text-text-muted">{v.tagline}</p>
                        <p className="mt-2 text-[11px] text-text-muted">{v.roomCount} staterooms · up to {v.capacity} guests</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {/* ── STEP: package + cabins/charter ──────────────────────── */}
          {((isCharter && step === 1) || (!isCharter && step === 2)) && (
            <StepShell
              title={isCharter ? "Package & Charter Details" : "Configure Your Booking"}
              subtitle={isCharter ? "Choose your itinerary length, then set your guest count." : "Choose a package, then pick your staterooms on the deck plan."}
            >
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {PACKAGE_TIERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPackageId(p.id)}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left transition-all",
                        packageId === p.id ? "border-teal-deep bg-teal-soft/10 shadow-sm" : "border-ink/10 hover:border-ink/25"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-lg font-medium text-ink">{p.label}</h4>
                        {packageId === p.id && <Check className="size-4 text-teal-deep" />}
                      </div>
                      <p className="mt-1.5 text-xs text-text-muted">{p.overview}</p>
                      <ul className="mt-2 space-y-0.5">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-1.5 text-[11px] text-ink/70">
                            <Sparkles className="mt-0.5 size-2.5 shrink-0 text-gold-bright" /> {h}
                          </li>
                        ))}
                      </ul>
                      {vesselId && (
                        <p className="mt-2 text-[11px] font-medium text-teal-deep">
                          Check-in {VESSEL_META[vesselId].checkIn} · off {VESSEL_META[vesselId].checkOut[p.id]}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                {packageId && !isCharter && vesselId && (
                  <VesselCabinPicker
                    floors={cabinFloors}
                    spots={cabinSpots}
                    roomCategories={vesselRoomCategories}
                    selectedSpotIds={selectedSpotIds}
                    bowSide={bowSide}
                    onToggleSpot={(id) =>
                      setSelectedSpotIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
                    }
                  />
                )}

                {packageId && isCharter && (
                  <CharterConfigurator
                    packageId={packageId}
                    pax={charterPax}
                    onPaxChange={setCharterPax}
                    nonMalaysianPax={nonMalaysianPax}
                    onNonMalaysianPaxChange={setNonMalaysianPax}
                    wantsInsurance={wantsInsurance}
                    onWantsInsuranceChange={setWantsInsurance}
                  />
                )}

                {!isCharter && selectedSpots.length > 0 && (
                  <div className="rounded-xl border border-ink/8 bg-[#FAFAF8] p-4 text-sm">
                    <span className="font-semibold text-ink">{selectedSpots.length} stateroom{selectedSpots.length > 1 ? "s" : ""} selected</span>
                    <span className="mx-2 text-ink/30">·</span>
                    <span className="text-text-muted">{formatPrice(cabinNightlyTotal)}/night</span>
                    {nights > 0 && (
                      <>
                        <span className="mx-2 text-ink/30">·</span>
                        <span className="font-semibold text-obsidian">{formatPrice(cabinGrandTotal)} total for {nights} nights</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </StepShell>
          )}

          {/* ── STEP: departure date ─────────────────────────────────── */}
          {((isCharter && step === 2) || (!isCharter && step === 3)) && (
            <StepShell title="Choose Your Departure Date" subtitle="Every Friday & Monday, up to a year ahead.">
              <div className="grid gap-3 sm:grid-cols-3">
                {departureDates.map((d) => (
                  <DateCard key={d.iso} d={d} active={selectedDateIso === d.iso} onClick={() => setSelectedDateIso(d.iso)} />
                ))}
              </div>
            </StepShell>
          )}

          {/* ── STEP: guest details ──────────────────────────────────── */}
          {((isCharter && step === 3) || (!isCharter && step === 4)) && (
            <StepShell title="Your Details" subtitle="We'll send the confirmation here.">
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["firstName", "First name*"],
                    ["lastName", "Last name*"],
                    ["email", "Email*"],
                    ["phone", "Phone / WhatsApp*"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-text-muted">{label}</label>
                    <input
                      type="text"
                      value={guest[key]}
                      onChange={(e) => setGuest((g) => ({ ...g, [key]: e.target.value }))}
                      className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep/40"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Special requests</label>
                  <textarea
                    rows={2}
                    value={guest.requests}
                    onChange={(e) => setGuest((g) => ({ ...g, requests: e.target.value }))}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep/40"
                  />
                </div>
                <label className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={guest.agreeTerms}
                    onChange={(e) => setGuest((g) => ({ ...g, agreeTerms: e.target.checked }))}
                    className="size-4 accent-teal-deep"
                  />
                  <span className="text-xs text-text-muted">I agree to the booking terms and cancellation policy.</span>
                </label>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-2xl border border-ink/8 bg-[#FAFAF8] p-5 text-sm">
                <h4 className="mb-3 font-semibold text-ink">Booking summary</h4>
                <SummaryRow label="Mode" value={isCharter ? "Full charter" : "Cabin booking"} />
                <SummaryRow label="Vessel" value={vessel?.name ?? "—"} />
                <SummaryRow label="Package" value={packageId ? PACKAGE_TIERS.find((p) => p.id === packageId)!.label : "—"} />
                <SummaryRow label="Departure" value={selectedDate?.label ?? "—"} />
                {!isCharter && <SummaryRow label="Staterooms" value={selectedSpots.map((s) => s.planLabel).join(", ") || "—"} />}
                {isCharter && <SummaryRow label="Guests" value={`${charterPax} (${nonMalaysianPax} non-Malaysian)`} />}
                <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-display text-xl font-medium text-obsidian">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </StepShell>
          )}

          {/* ── STEP: confirmation ───────────────────────────────────── */}
          {step === lastStep && (
            <StepShell title="Bon Voyage!" subtitle="Your booking is confirmed — a confirmation email is on its way.">
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-teal-deep text-white">
                  <Check className="size-8" />
                </span>
                <p className="mt-4 font-mono text-sm text-text-muted">REF: {bookingRef}</p>
                <div className="mt-6 w-full max-w-md rounded-2xl border border-ink/8 bg-[#FAFAF8] p-5 text-left text-sm">
                  <SummaryRow label="Guest" value={`${guest.firstName} ${guest.lastName}`} />
                  <SummaryRow label="Vessel" value={vessel?.name ?? "—"} />
                  <SummaryRow label="Departure" value={selectedDate?.label ?? "—"} />
                  <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                    <span className="font-semibold text-ink">Total paid</span>
                    <span className="font-display text-xl font-medium text-obsidian">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, `Hi! My booking ref is ${bookingRef} — looking forward to the trip.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
                >
                  <MessageCircle className="size-4" /> Message us on WhatsApp
                </a>
              </div>
            </StepShell>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      {step < lastStep && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 transition hover:text-ink disabled:opacity-0"
          >
            <ChevronLeft className="size-4" /> Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canProceed()}
            className="inline-flex items-center gap-1.5 rounded-full bg-obsidian px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-30"
          >
            {step === lastStep - 1 ? "Confirm Booking" : "Continue"} <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ModeCard({
  active,
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-6 text-left transition-all",
        active ? "border-teal-deep bg-teal-soft/10 shadow-md" : "border-ink/10 hover:border-ink/25"
      )}
    >
      <span
        className={cn(
          "mb-3 flex size-11 items-center justify-center rounded-xl",
          active ? "bg-teal-deep text-white" : "bg-ink/5 text-ink/60"
        )}
      >
        <Icon className="size-5" />
      </span>
      <h4 className="font-display text-lg font-medium text-ink">{title}</h4>
      <p className="mt-1 text-sm text-text-muted">{desc}</p>
    </button>
  );
}

function DateCard({ d, active, onClick }: { d: DepartureDate; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 p-3.5 text-left transition-all",
        active ? "border-teal-deep bg-teal-soft/10" : "border-ink/10 hover:border-ink/25"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{d.label}</span>
        {active && <Check className="size-4 text-teal-deep" />}
      </div>
      <span
        className={cn(
          "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
          d.demand === "selling-fast" ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
        )}
      >
        {d.demand === "selling-fast" ? "Selling fast" : "Available"}
      </span>
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
