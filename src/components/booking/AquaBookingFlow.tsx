"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Bed,
  Layers,
  FileCheck,
  Eye,
} from "lucide-react";
import type { CabinDeckSlot, Package } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn, whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { HouseboatDeckMockup } from "./HouseboatDeckMockup";

interface AquaBookingFlowProps {
  pkg: Package;
  availableCabins: CabinDeckSlot[];
  onCompleteBooking?: (data: Record<string, unknown>) => void;
}

const DEPARTURE_DATES = [
  { id: "dep-1", date: "15 Oct - 17 Oct 2026", label: "Early Autumn Drift", status: "Selling Fast" },
  { id: "dep-2", date: "22 Oct - 24 Oct 2026", label: "Canopy & Waterfall Passage", status: "Available" },
  { id: "dep-3", date: "05 Nov - 07 Nov 2026", label: "Full Moon Stargazing", status: "Few Suites Left" },
  { id: "dep-4", date: "19 Nov - 21 Nov 2026", label: "Rainforest Bloom Expedition", status: "Available" },
];

export function AquaBookingFlow({ pkg, availableCabins }: AquaBookingFlowProps) {
  // Wizard steps: 1 = Cabin Selection, 2 = Guest Details, 3 = Summary & Review, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Selected date
  const [selectedDate, setSelectedDate] = useState(DEPARTURE_DATES[0]);

  // Selected cabins state (set of cabin slot IDs)
  const [selectedCabinIds, setSelectedCabinIds] = useState<string[]>(["slot-301"]);

  // Active deck filter view (upper | main | lower)
  const [activeDeckTab, setActiveDeckTab] = useState<"upper" | "main" | "lower">("upper");

  // Guest details form state
  const [guestDetails, setGuestDetails] = useState({
    firstName: "Alexander",
    lastName: "Tan",
    email: "alexander.tan@mhgcruise.test",
    phone: "+60 12-889 9123",
    country: "Malaysia",
    dob: "1988-06-15",
    specialDiet: "Halal / Seafood preferred",
    agreeTerms: true,
  });

  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [showDeckPlan, setShowDeckPlan] = useState(false);

  const DECK_PLAN_IMAGES: Record<string, { title: string; image: string; desc: string }> = {
    upper: {
      title: "Upper Deck Architectural Blueprint",
      image: "/images/deck/2nd-floor-scaled.webp",
      desc: "Features the open-air observation sun deck, master panorama suites, and private aft lounge.",
    },
    main: {
      title: "Main Deck Architectural Blueprint",
      image: "/images/deck/1st-floor-scaled.webp",
      desc: "Central air-conditioned dining saloon, kitchen galley, and forward deluxe staterooms with picture windows.",
    },
    lower: {
      title: "Lower / Ground Deck Blueprint",
      image: "/images/deck/Ground-floor.webp",
      desc: "Spacious multi-bed family suites, tender boat boarding pontoon, and water sports equipment bay.",
    },
    all: {
      title: "Complete Houseboat Multi-Deck Layout",
      image: "/images/deck/1st-floor-scaled.webp",
      desc: "Multi-tiered catamaran expedition vessel architecture engineered for tranquil Lake Kenyir navigation.",
    },
  };

  // Calculate pricing
  const selectedSlots = availableCabins.filter((c) => selectedCabinIds.includes(c.id));
  const subtotal = selectedSlots.reduce((sum, slot) => sum + slot.basePriceMYR, 0);
  const taxAndPortFees = Math.round(subtotal * 0.06); // 6% SST
  const totalPrice = subtotal + taxAndPortFees;

  const toggleCabinSelection = (slotId: string, status: string) => {
    if (status === "unavailable") return;
    setSelectedCabinIds((prev) => {
      if (prev.includes(slotId)) {
        // keep at least 1 cabin
        return prev.length > 1 ? prev.filter((id) => id !== slotId) : prev;
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleConfirmPay = () => {
    const ref = `SC-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setStep(4);
  };

  const stepsList = [
    { num: 1, label: "Cabin Selection" },
    { num: 2, label: "Personal Details" },
    { num: 3, label: "Summary" },
    { num: 4, label: "Confirm & Pay" },
  ];

  return (
    <div id="book-now" className="scroll-mt-24 rounded-3xl border border-ink/10 bg-[#FAFAF8] shadow-2xl overflow-hidden">
      {/* Top Breadcrumb Wizard Progress Bar (Directly modeled from Aqua Expeditions) */}
      <div className="border-b border-ink/10 bg-obsidian text-white px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {stepsList.map((st, i) => {
            const isActive = step === st.num;
            const isDone = step > st.num;
            return (
              <div key={st.num} className="flex items-center gap-2 sm:gap-3">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                    isActive && "bg-white text-obsidian ring-4 ring-gold-bright/40",
                    isDone && "bg-gold-bright text-obsidian font-bold",
                    !isActive && !isDone && "bg-white/15 text-white/60"
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : st.num}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium uppercase tracking-wider sm:inline",
                    isActive ? "text-white font-semibold" : "text-white/60"
                  )}
                >
                  {st.label}
                </span>
                {i < stepsList.length - 1 && (
                  <span className="hidden h-px w-8 bg-white/20 md:inline lg:w-16" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Layout: Left steps form + Right sticky Order Summary Sidebar */}
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_380px]">
        {/* Step Container */}
        <div>
          <AnimatePresence mode="wait">
            {/* STEP 1: CABIN SELECTION (Interactive Deck Plan & Stateroom Cards) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                    Cabin Selection
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Choose your desired stateroom or private suites on {pkg.vesselId === "summer-cruise" ? "Summer Cruise" : "Green Horizon"}.
                  </p>
                </div>

                {/* Departure Date Selector */}
                <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-ink/8">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-obsidian">
                      <Calendar className="size-4 text-teal-deep" />
                      Select Departure Date
                    </span>
                    <span className="text-xs text-text-muted">{pkg.durationLabel}</span>
                  </div>

                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {DEPARTURE_DATES.map((dep) => (
                      <button
                        key={dep.id}
                        type="button"
                        onClick={() => setSelectedDate(dep)}
                        className={cn(
                          "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                          selectedDate.id === dep.id
                            ? "border-teal-deep bg-teal-soft/10 ring-2 ring-teal-deep/20"
                            : "border-ink/8 bg-white hover:bg-black/2"
                        )}
                      >
                        <span className="text-sm font-semibold text-ink">{dep.date}</span>
                        <div className="mt-1 flex items-center justify-between w-full text-xs text-text-muted">
                          <span>{dep.label}</span>
                          <span
                            className={cn(
                              "font-medium",
                              dep.status === "Selling Fast" ? "text-amber-600" : "text-teal-deep"
                            )}
                          >
                            {dep.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 1A: SELECT DECK 1ST */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">
                      1. Select Your Vessel Deck
                    </span>
                    <span className="text-xs text-text-muted">
                      Select a deck level to view available staterooms
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "upper" as const,
                        name: "Upper Deck",
                        level: "Level 3",
                        tag: "Sky & Sunset Lounge",
                        price: "From RM 1,850",
                        desc: "Panoramic observation sun deck, master suites, and lake horizons.",
                      },
                      {
                        id: "main" as const,
                        name: "Main Deck",
                        level: "Level 2",
                        tag: "Saloon & Veranda",
                        price: "From RM 1,450",
                        desc: "Central air-conditioned dining saloon, galley, and deluxe suites.",
                      },
                      {
                        id: "lower" as const,
                        name: "Lower Deck",
                        level: "Level 1",
                        tag: "Waterline & Adventure",
                        price: "From RM 1,650",
                        desc: "Scenic waterline portholes with direct swim platform access.",
                      },
                    ].map((d) => {
                      const isDeckActive = activeDeckTab === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setActiveDeckTab(d.id)}
                          className={cn(
                            "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                            isDeckActive
                              ? "border-teal-deep bg-teal-soft/15 ring-2 ring-teal-deep/30 shadow-md"
                              : "border-ink/8 bg-white hover:border-ink/20 hover:shadow-xs"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-deep">
                                {d.level} · {d.tag}
                              </span>
                              {isDeckActive && (
                                <span className="flex size-4 items-center justify-center rounded-full bg-teal-deep text-white text-[9px] font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                            <h4 className="font-display text-lg font-semibold text-ink mt-1">
                              {d.name}
                            </h4>
                            <p className="mt-1 text-xs text-text-muted leading-relaxed">
                              {d.desc}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-ink/6 pt-2.5">
                            <span className="text-xs font-bold text-ink">{d.price}</span>
                            <span className="text-[11px] font-semibold text-teal-deep">
                              {isDeckActive ? "Viewing Deck Plan" : "View This Deck →"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 1B: INTERACTIVE DECK MOCKUP (BUS/AIRLINE CABIN SELECTION) */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">
                      2. Click Staterooms on Mockup (Floor Plan)
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeckPlan((prev) => !prev)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                          showDeckPlan
                            ? "border-teal-deep bg-teal-soft/15 text-teal-deep shadow-sm"
                            : "border-ink/12 bg-white text-ink hover:border-ink/25"
                        )}
                      >
                        <Eye className="size-3.5" />
                        {showDeckPlan ? "Hide Blueprint" : "View Deck Blueprint"}
                      </button>
                      <span className="text-xs text-text-muted">
                        {selectedCabinIds.length} stateroom(s) reserved
                      </span>
                    </div>
                  </div>

                  {/* Collapsible Blueprint Diagram */}
                  <AnimatePresence>
                    {showDeckPlan && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-2xl border border-teal-deep/20 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink/8">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-deep">
                              Vessel Architectural Diagram
                            </span>
                            <h4 className="text-base font-semibold text-ink">
                              {DECK_PLAN_IMAGES[activeDeckTab].title}
                            </h4>
                          </div>
                          <p className="text-xs text-text-muted max-w-sm">
                            {DECK_PLAN_IMAGES[activeDeckTab].desc}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-ink/[0.02] p-3 sm:p-6 border border-ink/6">
                          <img
                            src={DECK_PLAN_IMAGES[activeDeckTab].image}
                            alt={DECK_PLAN_IMAGES[activeDeckTab].title}
                            className="max-h-72 w-auto object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tactile Houseboat Layout Mockup */}
                  <HouseboatDeckMockup
                    activeDeck={activeDeckTab}
                    cabins={availableCabins}
                    selectedCabinIds={selectedCabinIds}
                    onToggleCabin={toggleCabinSelection}
                    onSelectDeck={(deck) => setActiveDeckTab(deck)}
                  />
                </div>

                {/* STEP 1C: SELECTED STATEROOMS SPECIFICATIONS & PHOTOS */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-obsidian">
                    3. Selected Stateroom Details
                  </span>

                  <div className="grid gap-4">
                    {selectedSlots.map((cabin) => (
                      <div
                        key={cabin.id}
                        className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-teal-deep/30 bg-white shadow-sm"
                      >
                        <div className="relative aspect-[16/10] sm:w-56 shrink-0 bg-ink/5">
                          {cabin.image.src ? (
                            <img
                              src={cabin.image.src}
                              alt={cabin.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-xs text-text-muted">
                              Luxury Stateroom
                            </div>
                          )}
                          <span className="absolute top-2.5 left-2.5 rounded-md bg-obsidian/85 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider backdrop-blur-sm">
                            {cabin.deckLabel} · {cabin.cabinNumber}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-display text-lg font-medium text-ink">
                                  {cabin.name}
                                </h4>
                                <p className="text-xs text-teal-deep font-medium">{cabin.viewType}</p>
                              </div>
                              <span className="font-display text-lg font-semibold text-obsidian">
                                {formatPrice(cabin.basePriceMYR)}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <Layers className="size-3.5 text-teal-deep" />
                                {cabin.areaSqm} sqm / {cabin.areaSqft} sqft
                              </span>
                              <span className="flex items-center gap-1">
                                <Bed className="size-3.5 text-teal-deep" />
                                {cabin.bedType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="size-3.5 text-teal-deep" />
                                Max {cabin.maxOccupancy} Guests
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3">
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                              <Check className="size-3.5" /> En-suite bathroom included
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCabinSelection(cabin.id, cabin.status)}
                              className="text-xs font-medium text-rose-600 hover:underline"
                            >
                              Remove Cabin
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={selectedCabinIds.length === 0}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-obsidian px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-gold-bright disabled:opacity-50"
                  >
                    Continue to Personal Details
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PERSONAL DETAILS (Primary Guest & Cabin Occupants) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                    Personal Details
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Please provide passenger and primary contact details for your voyage manifest.
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-sm space-y-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-obsidian border-b border-ink/8 pb-2">
                    Primary Guest & Booking Contact
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink">First Name *</label>
                      <input
                        type="text"
                        value={guestDetails.firstName}
                        onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink">Last Name *</label>
                      <input
                        type="text"
                        value={guestDetails.lastName}
                        onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink">Email Address *</label>
                      <input
                        type="email"
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink">Mobile Phone (WhatsApp) *</label>
                      <input
                        type="tel"
                        value={guestDetails.phone}
                        onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink">Country of Residence</label>
                      <input
                        type="text"
                        value={guestDetails.country}
                        onChange={(e) => setGuestDetails({ ...guestDetails, country: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink">Date of Birth</label>
                      <input
                        type="date"
                        value={guestDetails.dob}
                        onChange={(e) => setGuestDetails({ ...guestDetails, dob: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-teal-deep focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink">Dietary Requirements or Special Requests</label>
                    <textarea
                      rows={3}
                      value={guestDetails.specialDiet}
                      onChange={(e) => setGuestDetails({ ...guestDetails, specialDiet: e.target.value })}
                      placeholder="e.g. Vegetarian, Halal, seafood preferences, anniversary setup..."
                      className="mt-1 w-full rounded-xl border border-ink/15 p-3 text-sm focus:border-teal-deep focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-ink"
                  >
                    <ChevronLeft className="size-4" />
                    Back to Cabins
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-obsidian px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-gold-bright"
                  >
                    Review Summary
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUMMARY & BOOKING POLICIES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                    Booking Summary
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Review your chosen voyage itinerary, cabins, and terms before proceeding.
                  </p>
                </div>

                {/* Itinerary Review Card */}
                <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                    <div>
                      <h4 className="font-display text-lg font-medium text-ink">{pkg.title}</h4>
                      <p className="text-xs text-text-muted">
                        Vessel: {pkg.vesselId === "summer-cruise" ? "Summer Cruise" : "Green Horizon"} · {pkg.durationLabel}
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-soft/20 px-3 py-1 text-xs font-semibold text-teal-deep">
                      {selectedDate.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">
                      Selected Cabins:
                    </span>
                    <div className="mt-2 divide-y divide-ink/8">
                      {selectedSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between py-2 text-sm">
                          <div>
                            <span className="font-medium text-ink">{slot.cabinNumber}</span> —{" "}
                            <span className="text-text-muted">{slot.name} ({slot.bedType})</span>
                          </div>
                          <span className="font-medium text-ink">{formatPrice(slot.basePriceMYR)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink/8 pt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">
                      Guest Contact:
                    </span>
                    <p className="mt-1 text-sm text-text-muted">
                      {guestDetails.firstName} {guestDetails.lastName} · {guestDetails.phone} · {guestDetails.email}
                    </p>
                  </div>
                </div>

                {/* Terms & Payment Notice */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-xs text-amber-900 leading-relaxed">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Info className="size-4 shrink-0 text-amber-700" />
                    Flexible 30% Deposit Confirmation Policy
                  </p>
                  <p className="mt-1.5">
                    Only a 30% deposit is required to secure and hold your stateroom. The remaining balance is payable 14 days before boarding. Free date changes are permitted up to 30 days prior.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-ink"
                  >
                    <ChevronLeft className="size-4" />
                    Back to Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPay}
                    className="font-secondary inline-flex items-center gap-2 rounded-full bg-teal-deep px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-gold-bright"
                  >
                    Confirm & Proceed To Payment
                    <CheckCircle2 className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONFIRMATION & RECEIPT STATE */}
            {step === 4 && bookingRef && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-gold/40 bg-white p-8 text-center shadow-xl">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="size-7 stroke-[2.5]" />
                  </div>
                  <h3 className="font-display mt-5 text-3xl font-medium text-ink">
                    Voyage Cabin Reservation Received!
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">
                    Your reference number is{" "}
                    <span className="font-mono font-bold text-obsidian bg-ink/5 px-2 py-0.5 rounded">
                      {bookingRef}
                    </span>
                  </p>

                  <div className="mx-auto mt-6 max-w-md rounded-2xl border border-ink/8 bg-cream-50 p-5 text-left text-xs leading-relaxed space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Package:</span>
                      <span className="font-semibold text-ink">{pkg.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Dates:</span>
                      <span className="font-semibold text-ink">{selectedDate.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Cabins:</span>
                      <span className="font-semibold text-ink">
                        {selectedSlots.map((s) => s.cabinNumber).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-ink/8 pt-2">
                      <span className="text-text-muted">Estimated Total:</span>
                      <span className="font-bold text-ink">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
                    Our concierge team has reserved your stateroom and will WhatsApp your formal quote and invoice with online bank transfer details shortly.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={whatsappLink(
                        WHATSAPP_NUMBER,
                        `Hi Summer Cruise! I just placed reservation ${bookingRef} for ${pkg.title} (${selectedDate.date}). Could you assist with confirmation?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-secondary inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:brightness-105"
                    >
                      <MessageCircle className="size-4" />
                      Chat on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="font-secondary inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-black/5"
                    >
                      <FileCheck className="size-4" />
                      Print Summary
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sticky Booking Summary Bar (Modeled faithfully after Aqua Expeditions) */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-ink/10 bg-white p-6 shadow-md">
            <h4 className="font-display text-lg font-medium text-ink border-b border-ink/8 pb-3">
              Voyage Overview
            </h4>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-text-muted block">Expedition Package</span>
                <span className="font-semibold text-ink text-sm">{pkg.title}</span>
              </div>

              <div>
                <span className="text-text-muted block">Vessel & Duration</span>
                <span className="font-medium text-ink">
                  {pkg.vesselId === "summer-cruise" ? "Summer Cruise" : "Green Horizon"} · {pkg.durationLabel}
                </span>
              </div>

              <div>
                <span className="text-text-muted block">Departure Window</span>
                <span className="font-medium text-teal-deep">{selectedDate.date}</span>
              </div>

              <div className="border-t border-ink/8 pt-3">
                <span className="text-text-muted block mb-1">Selected Accommodations</span>
                {selectedSlots.length === 0 ? (
                  <span className="text-text-muted italic">No cabin chosen</span>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSlots.map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-ink">
                          {slot.cabinNumber} ({slot.deckLabel})
                        </span>
                        <span className="text-text-muted">{formatPrice(slot.basePriceMYR)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-ink/8 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Cabin Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Taxes & Port Levies (6%)</span>
                  <span>{formatPrice(taxAndPortFees)}</span>
                </div>
                <div className="flex justify-between border-t border-ink/8 pt-2 text-sm font-bold text-obsidian">
                  <span>Total (MYR)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {step < 3 && (
              <div className="mt-6 border-t border-ink/8 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={selectedCabinIds.length === 0}
                  className="font-secondary w-full rounded-full bg-obsidian py-3 text-center text-xs font-semibold uppercase tracking-widest text-white shadow transition-all hover:bg-gold-bright disabled:opacity-50"
                >
                  {step === 1 ? "Next: Personal Details" : "Next: Review Summary"}
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-text-muted">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Instant Confirmation · 100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
