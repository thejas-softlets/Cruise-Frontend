"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Bed,
  Layers,
  MessageCircle,
} from "lucide-react";
import type { RoomCategory, Package } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn, WHATSAPP_NUMBER } from "@/lib/utils";
import { GreenHorizonCabinPicker } from "./GreenHorizonCabinPicker";
import { GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";

interface GreenHorizonBookingFlowProps {
  pkg: Package;
  roomCategories: RoomCategory[];
}

const GH_DEPARTURES = [
  { id: "gh-dep-1", date: "24 Oct – 26 Oct 2026", label: "Canyon & Stars Weekend", status: "Available" },
  { id: "gh-dep-2", date: "07 Nov – 09 Nov 2026", label: "Full Moon Stargazing", status: "Selling Fast" },
  { id: "gh-dep-3", date: "21 Nov – 23 Nov 2026", label: "Rainforest Bloom Voyage", status: "Available" },
  { id: "gh-dep-4", date: "05 Dec – 07 Dec 2026", label: "Year-End Charter", status: "Few Suites Left" },
];

const STEPS = [
  { num: 1, label: "Cabin Selection" },
  { num: 2, label: "Personal Details" },
  { num: 3, label: "Summary" },
  { num: 4, label: "Confirm" },
];

/**
 * Green Horizon booking flow — same wizard grammar as AquaBookingFlow, but
 * step 1 is the interactive deck-plan visual selector built from the real
 * Green Horizon cruise-structure diagrams.
 */
export function GreenHorizonBookingFlow({ pkg, roomCategories }: GreenHorizonBookingFlowProps) {
  const [step, setStep] = useState(1);
  const [departure, setDeparture] = useState(GH_DEPARTURES[0]);
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>([]);
  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Malaysia",
    requests: "",
    agreeTerms: false,
  });
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const bookableSpots = useMemo(() => GH_CABIN_SPOTS.filter((s) => s.kind === "cabin"), []);
  const selectedSpots = bookableSpots.filter((s) => selectedSpotIds.includes(s.id));
  const subtotal = selectedSpots.reduce((sum, s) => sum + s.basePriceMYR, 0);
  const sst = Math.round(subtotal * 0.06);
  const total = subtotal + sst;
  const guests = selectedSpots.reduce((sum, s) => sum + s.maxOccupancy, 0);

  const toggleSpot = (spotId: string) => {
    setSelectedSpotIds((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  };

  const canProceedStep2 = selectedSpotIds.length > 0 && guest.agreeTerms;
  const canProceedStep3 =
    guest.firstName.trim() && guest.lastName.trim() && /\S+@\S+\.\S+/.test(guest.email) && guest.phone.trim();

  const handleConfirm = () => {
    setBookingRef(`GH-BK-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(4);
  };

  const whatsappText = encodeURIComponent(
    `Hello! I'd like to book Green Horizon (${departure.date}) — cabins: ${selectedSpots.map((s) => s.name).join(", ") || "TBD"}. Total estimate RM ${total.toLocaleString()}.`
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-[#FAFAF8] shadow-2xl">
      {/* Wizard progress bar */}
      <div className="border-b border-ink/10 bg-obsidian px-6 py-4 text-white sm:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {STEPS.map((st, i) => {
            const isActive = step === st.num;
            const isDone = step > st.num;
            return (
              <div key={st.num} className="flex items-center gap-2 sm:gap-3">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isActive && "bg-white text-obsidian ring-4 ring-gold-bright/40",
                    isDone && "bg-gold-bright text-obsidian",
                    !isActive && !isDone && "bg-white/15 text-white/60"
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : st.num}
                </div>
                <span className={cn("hidden text-xs font-medium uppercase tracking-wider sm:inline", isActive ? "text-white" : "text-white/60")}>
                  {st.label}
                </span>
                {i < STEPS.length - 1 && <span className="hidden h-px w-8 bg-white/20 md:inline lg:w-16" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_380px]">
        {/* ── Steps column ── */}
        <div>
          <AnimatePresence mode="wait">
            {/* STEP 1 — visual cabin selection */}
            {step === 1 && (
              <motion.div key="gh-s1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">Cabin Selection</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Tap a highlighted room on the Green Horizon deck plan to select it. Facilities are outlined for orientation.
                  </p>
                </div>

                {/* Departure dates */}
                <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-obsidian">
                      <Calendar className="size-4 text-teal-deep" /> Select Departure
                    </span>
                    <span className="text-xs text-text-muted">{pkg.durationLabel}</span>
                  </div>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {GH_DEPARTURES.map((dep) => (
                      <button
                        key={dep.id}
                        type="button"
                        onClick={() => setDeparture(dep)}
                        className={cn(
                          "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                          departure.id === dep.id ? "border-teal-deep bg-teal-soft/10 ring-2 ring-teal-deep/20" : "border-ink/8 bg-white hover:bg-black/2"
                        )}
                      >
                        <span className="text-sm font-semibold text-ink">{dep.date}</span>
                        <div className="mt-1 flex w-full items-center justify-between text-xs text-text-muted">
                          <span>{dep.label}</span>
                          <span className={cn("font-medium", dep.status === "Selling Fast" ? "text-amber-600" : "text-teal-deep")}>{dep.status}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual deck-plan picker */}
                <GreenHorizonCabinPicker
                  roomCategories={roomCategories}
                  selectedSpotIds={selectedSpotIds}
                  onToggleSpot={toggleSpot}
                />

                {/* Selected cabins list */}
                {selectedSpots.length > 0 && (
                  <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">
                      Selected Staterooms ({selectedSpots.length})
                    </span>
                    <div className="mt-3 space-y-2">
                      {selectedSpots.map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-xl border border-teal-deep/20 bg-teal-soft/10 px-4 py-2.5">
                          <div>
                            <span className="text-sm font-semibold text-ink">{s.name}</span>
                            <span className="ml-2 text-xs text-text-muted">{s.bedType} · Max {s.maxOccupancy}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-obsidian">{formatPrice(s.basePriceMYR)}</span>
                            <button type="button" onClick={() => toggleSpot(s.id)} className="text-xs font-medium text-rose-600 hover:underline">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={selectedSpotIds.length === 0}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-obsidian px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-gold-bright disabled:opacity-50"
                  >
                    Continue <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — personal details */}
            {step === 2 && (
              <motion.div key="gh-s2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">Personal Details</h3>
                  <p className="mt-1 text-sm text-text-muted">Lead guest information for the booking.</p>
                </div>

                <div className="grid gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-sm sm:grid-cols-2">
                  {([
                    ["firstName", "First name*", "Alexander"],
                    ["lastName", "Last name*", "Tan"],
                    ["email", "Email*", "you@example.com"],
                    ["phone", "Phone / WhatsApp*", "+60 12-345 6789"],
                    ["country", "Country", "Malaysia"],
                  ] as const).map(([field, label, ph]) => (
                    <label key={field} className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-ink/80">{label}</span>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={guest[field]}
                        placeholder={ph}
                        onChange={(e) => setGuest((g) => ({ ...g, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
                      />
                    </label>
                  ))}
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold text-ink/80">Special requests</span>
                    <textarea
                      rows={3}
                      value={guest.requests}
                      onChange={(e) => setGuest((g) => ({ ...g, requests: e.target.value }))}
                      placeholder="Dietary needs, celebrations, accessibility…"
                      className="w-full resize-none rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
                    />
                  </label>
                  <label className="flex items-start gap-2.5 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={guest.agreeTerms}
                      onChange={(e) => setGuest((g) => ({ ...g, agreeTerms: e.target.checked }))}
                      className="mt-0.5 size-4 rounded border-ink/20 accent-teal-deep"
                    />
                    <span className="text-xs text-text-muted">
                      I agree to the booking terms, cancellation policy and house rules.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-ink">
                    <ChevronLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2 || !canProceedStep3}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-obsidian px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-gold-bright disabled:opacity-50"
                  >
                    Review Booking <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — summary */}
            {step === 3 && (
              <motion.div key="gh-s3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">Booking Summary</h3>
                  <p className="mt-1 text-sm text-text-muted">Review everything before confirming.</p>
                </div>

                <div className="space-y-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                  <SummaryRow label="Voyage" value={`Green Horizon · ${pkg.title}`} />
                  <SummaryRow label="Departure" value={`${departure.date} — ${departure.label}`} />
                  <SummaryRow label="Lead guest" value={`${guest.firstName} ${guest.lastName}`} />
                  <SummaryRow label="Contact" value={`${guest.email} · ${guest.phone}`} />
                  {guest.requests && <SummaryRow label="Requests" value={guest.requests} />}
                  <div className="border-t border-ink/8 pt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">Cabins</span>
                    <div className="mt-2 space-y-1.5">
                      {selectedSpots.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink">{s.name} <span className="text-xs text-text-muted">({s.bedType})</span></span>
                          <span className="font-medium text-obsidian">{formatPrice(s.basePriceMYR)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-ink">
                    <ChevronLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-obsidian px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-gold-bright"
                  >
                    <ShieldCheck className="size-4" /> Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — confirmation */}
            {step === 4 && (
              <motion.div key="gh-s4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="size-8" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-medium text-ink">Booking Confirmed</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Reference <span className="font-mono font-semibold text-obsidian">{bookingRef}</span> — a confirmation email is on its way to {guest.email}.
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-ink/8 bg-white p-5 text-left text-sm shadow-sm">
                  <SummaryRow label="Voyage" value={`Green Horizon · ${pkg.title}`} />
                  <SummaryRow label="Departure" value={departure.date} />
                  <SummaryRow label="Cabins" value={selectedSpots.map((s) => s.name).join(", ")} />
                  <SummaryRow label="Total" value={formatPrice(total)} />
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition hover:bg-emerald-700"
                >
                  <MessageCircle className="size-4" /> Chat us on WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sticky order summary ── */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-ink/10 bg-white p-6 shadow-lg">
          <h4 className="font-display text-lg font-medium text-ink">Green Horizon</h4>
          <p className="mt-0.5 text-xs text-text-muted">{pkg.title}</p>
          <div className="mt-4 space-y-2 border-t border-ink/8 pt-4 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>Departure</span>
              <span className="text-right font-medium text-ink">{departure.date}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span className="flex items-center gap-1"><Users className="size-3.5" /> Guests (max)</span>
              <span className="font-medium text-ink">{guests || "—"}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-ink/8 pt-4 text-sm">
            {selectedSpots.length === 0 && (
              <p className="text-xs text-text-muted">No cabins selected yet — tap a room on the deck plan.</p>
            )}
            {selectedSpots.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2 text-ink">
                  <Bed className="mt-0.5 size-3.5 shrink-0 text-teal-deep" />
                  <span>
                    {s.name}
                    <span className="block text-[11px] text-text-muted">{s.bedType}</span>
                  </span>
                </span>
                <span className="font-medium text-obsidian">{formatPrice(s.basePriceMYR)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-ink/8 pt-4 text-sm">
            <div className="flex justify-between text-text-muted"><span>Subtotal</span><span className="text-ink">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-text-muted"><span>SST & port fees (6%)</span><span className="text-ink">{formatPrice(sst)}</span></div>
            <div className="flex justify-between border-t border-ink/8 pt-2 font-display text-lg font-semibold text-obsidian">
              <span>Total (MYR)</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          {step < 4 && (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && selectedSpotIds.length === 0) return;
                setStep((s) => Math.min(4, s + 1));
              }}
              disabled={step === 1 && selectedSpotIds.length === 0}
              className="mt-5 w-full rounded-full bg-obsidian py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition hover:bg-gold-bright disabled:opacity-50"
            >
              {step === 3 ? "Confirm Booking" : "Next"}
            </button>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
            <Layers className="size-3" /> Free cancellation up to 14 days before departure
          </p>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-1 text-sm">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  );
}
