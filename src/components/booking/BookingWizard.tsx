"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Ship,
  Sparkles,
  Info,
  Edit2,
  Printer,
  ShieldCheck,
  Bookmark,
  ArrowRight,
  X,
  Loader2,
  Crown,
  FileText,
} from "lucide-react";
import type { Vessel, RoomCategory, Package } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn, whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { getDepartureDates } from "@/lib/departure-dates";
import { CHARTER_MIN_PAX, quoteCharter, type CharterPackageId } from "@/lib/charter-pricing";
import { GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";
import { SC_CABIN_SPOTS } from "@/lib/sc-deck-plan";
import { AquaDeckCabinPicker } from "./AquaDeckCabinPicker";
import { DynamicCruiseMap } from "./DynamicCruiseMap";
import { MOCK_WAYPOINTS } from "@/lib/api/mock/booking";
import { GraphicalDateSelector } from "./GraphicalDateSelector";
import { ProformaInvoiceView, type ProformaInvoiceData } from "./ProformaInvoiceView";

type BookingMode = "cabin" | "charter";
type VesselId = "summer-cruise" | "green-horizon";

const DEPARTURES = getDepartureDates({ includeFull: true, limit: 32 });

interface ChildDob {
  month: string;
  day: string;
  year: string;
}

interface CabinSlot {
  id: string; // e.g. "cabin-1"
  adults: number;
  children: number;
  childBirthDates: ChildDob[];
  selectedSpotId: string | null;
  isOpen: boolean;
}

interface GuestField {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  membershipNumber: string;
}

interface ServerCabinQuote {
  cabinIndex: number;
  spotId: string | null;
  spotName: string;
  planLabel: string;
  adults: number;
  children: number;
  /** Base rate × adult 1 (or solo rate) */
  adultTotalGross: number;
  soloSurcharge: number;
  childRate: number;
  childrenTotal: number;
  earlyBirdDiscount: number;
  packageFareNet: number;
  entranceTicketsTotal: number;
  jettyFeesTotal: number;
  insuranceTotal: number;
  tourismTaxTotal: number;
  ratePerAdult: number;
  total: number;
}

interface ServerQuoteResponse {
  success: boolean;
  vesselId: string;
  nights: number;
  isEarlyBird: boolean;
  totalAdults: number;
  totalChildren: number;
  cabins: ServerCabinQuote[];
  subtotalMYR: number;
  feesTotalMYR: number;
  grandTotalMYR: number;
  overallRatePerAdult: number;
  formattedGrandTotal: string;
}

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const COUNTRIES_LIST = [
  { code: "+60", name: "Malaysia" },
  { code: "+65", name: "Singapore" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+62", name: "Indonesia" },
  { code: "+86", name: "China" },
  { code: "+49", name: "Germany" },
  { code: "+81", name: "Japan" },
  { code: "+66", name: "Thailand" },
  { code: "+33", name: "France" },
  { code: "+31", name: "Netherlands" },
  { code: "+82", name: "South Korea" },
];

const ADULT_YEARS = Array.from({ length: 75 }, (_, i) => `${2012 - i}`);
const CHILD_YEARS = Array.from({ length: 7 }, (_, i) => `${2021 - i}`);
const DAYS_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

const SC_SPOTS = [
  "sc-1-1101", "sc-1-1105", "sc-1-1107", "sc-1-1103",
  "sc-1-1111", "sc-1-1109", "sc-1-1102", "sc-1-1106",
  "sc-1-1108", "sc-1-1112", "sc-1-1110",
];
const GH_SPOTS = [
  "gh-1-1201", "gh-1-1205", "gh-1-1207", "gh-1-1209",
  "gh-2-1214", "gh-2-1215", "gh-1-1211", "gh-1-1202",
  "gh-1-1206", "gh-1-1208", "gh-1-1210", "gh-1-1212",
];

interface BookingWizardProps {
  vessels: Vessel[];
  packages: Package[];
  roomCategories: RoomCategory[];
  initialVesselId?: VesselId;
  initialMode?: BookingMode;
}

export function BookingWizard({
  vessels,
  packages,
  roomCategories,
  initialVesselId,
  initialMode,
}: BookingWizardProps) {
  // Wizard steps:
  // 0: Vessel, Package & Date Selection (Both cruises offer both packages)
  // 1: Cabin Selection (Aqua Step 1 with bus-seat deck plan)
  // 2: Personal Details (Aqua Step 2 with per-cabin guests)
  // 3: Summary (Aqua Step 3 with edit links)
  // 4: Confirm & Pay (Aqua Step 4)
  const [step, setStep] = useState<number>(0);
  const [mode, setMode] = useState<BookingMode>(initialMode ?? "cabin");

  // Step 0 State: Independent Vessel & Package selection
  const [selectedVesselId, setSelectedVesselId] = useState<VesselId>(initialVesselId ?? "summer-cruise");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string>("3d2n-kenyir-explorer");
  const [selectedDateIso, setSelectedDateIso] = useState<string>(DEPARTURES[0]?.iso ?? "");
  const [initialAdults, setInitialAdults] = useState<number>(2);
  const [initialChildren, setInitialChildren] = useState<number>(0);
  const [showItineraryModal, setShowItineraryModal] = useState<boolean>(false);

  // Available departure dates across booking window (with Aqua-style inventory)
  const departures = DEPARTURES;

  // Summary / Proforma Invoice View Toggle in Step 3
  const [summaryViewTab, setSummaryViewTab] = useState<"summary" | "invoice">("summary");
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // Charter vessel selection state (Summer Cruise vs Green Horizon)
  const [charterVesselId, setCharterVesselId] = useState<VesselId>(initialVesselId ?? "summer-cruise");

  // Active vessel ID for deck plans and calendar
  const activeVesselId: VesselId =
    mode === "charter" ? charterVesselId : selectedVesselId;

  // Active selected vessel (decoupled from package)
  const selectedVessel = useMemo(() => {
    return vessels.find((v) => v.id === activeVesselId) ?? vessels[0];
  }, [vessels, activeVesselId]);

  // Active selected package (both vessels support both packages)
  const selectedPkg = useMemo(() => {
    return packages.find((p) => p.slug === selectedPackageSlug) ?? packages[0];
  }, [packages, selectedPackageSlug]);

  // Active selected departure
  const selectedDate = useMemo(() => {
    return departures.find((d) => d.iso === selectedDateIso) ?? departures[0];
  }, [departures, selectedDateIso]);

  const allCabinSpots = activeVesselId === "summer-cruise" ? SC_CABIN_SPOTS : GH_CABIN_SPOTS;

  // Step 1: Cabin Slots State (Aqua Step 1)
  const [cabinCount, setCabinCount] = useState<number>(1);
  const [cabinSlots, setCabinSlots] = useState<CabinSlot[]>([
    {
      id: "cabin-1",
      adults: 2,
      children: 0,
      childBirthDates: [],
      selectedSpotId: (initialVesselId ?? "summer-cruise") === "green-horizon" ? "gh-1-1201" : "sc-1-1101",
      isOpen: true,
    },
  ]);

  function handleSelectVessel(vesselId: VesselId) {
    setSelectedVesselId(vesselId);
    setCharterVesselId(vesselId);
    // Switch cabin slots to default spots of newly selected vessel
    const defaultSpot = vesselId === "green-horizon" ? "gh-1-1201" : "sc-1-1101";
    const pool = vesselId === "green-horizon" ? GH_SPOTS : SC_SPOTS;
    setCabinSlots((prev) =>
      prev.map((slot, i) => ({
        ...slot,
        selectedSpotId: pool[i] ?? defaultSpot,
      }))
    );
  }

  // Dynamic server-fetched quote state
  const [serverQuote, setServerQuote] = useState<ServerQuoteResponse | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);

  // Step 2: Guest Details per Cabin (Aqua Step 2)
  const [cabinGuests, setCabinGuests] = useState<Record<string, GuestField[]>>({
    "cabin-1": [
      {
        firstName: "Alexander",
        lastName: "Tan",
        email: "alexander.tan@example.com",
        country: "Malaysia",
        phoneCode: "+60",
        phoneNumber: "12-345 6789",
        dobMonth: "May",
        dobDay: "14",
        dobYear: "1988",
        membershipNumber: "MHG-GOLD-8821",
      },
      {
        firstName: "Sarah",
        lastName: "Tan",
        email: "sarah.tan@example.com",
        country: "Malaysia",
        phoneCode: "+60",
        phoneNumber: "12-345 6789",
        dobMonth: "August",
        dobDay: "22",
        dobYear: "1990",
        membershipNumber: "",
      },
    ],
  });

  const [specialRequests, setSpecialRequests] = useState(
    "Anniversary celebration — quiet table for dinner if possible."
  );
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Private Charter state (fixed defaults; guest count is set at step-level)
  const charterPax = CHARTER_MIN_PAX;
  const nonMalaysianPax = 0;
  const wantsInsurance = false;

  // Official Summer Cruise Booking Reference matching PDF (#SCA26-03-XXXX)
  const [bookingRef] = useState(() => `#SCA26-03-${Math.floor(1000 + Math.random() * 9000)}`);

  // Sync cabin slots count
  function updateCabinCount(newCount: number) {
    setCabinCount(newCount);
    setCabinSlots((prev) => {
      const nextSlots = [...prev];
      while (nextSlots.length < newCount) {
        const idx = nextSlots.length + 1;
        nextSlots.push({
          id: `cabin-${idx}`,
          adults: 2,
          children: 0,
          childBirthDates: [],
          selectedSpotId: null,
          isOpen: true,
        });
      }
      return nextSlots.slice(0, newCount);
    });
  }

  // Update specific cabin slot
  function updateSlot(index: number, patch: Partial<CabinSlot>) {
    setCabinSlots((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;

      const updated = { ...current, ...patch };

      if (patch.children !== undefined && patch.children !== current.children) {
        const dates = [...updated.childBirthDates];
        while (dates.length < patch.children) {
          dates.push({ month: "March", day: "7", year: "2018" });
        }
        updated.childBirthDates = dates.slice(0, patch.children);
      }

      next[index] = updated;
      return next;
    });
  }

  function handleSelectSpotForCabin(slotIndex: number, spotId: string) {
    updateSlot(slotIndex, {
      selectedSpotId: cabinSlots[slotIndex]?.selectedSpotId === spotId ? null : spotId,
    });
  }

  // Server-fetch dynamic pricing quote whenever inputs change
  useEffect(() => {
    let isMounted = true;
    async function fetchServerQuote() {
      setIsQuoteLoading(true);
      try {
        const res = await fetch("/api/booking/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packageSlug: selectedPackageSlug,
            vesselId: activeVesselId,
            departureDateIso: selectedDateIso,
            cabins: cabinSlots.map((c) => ({
              adults: c.adults,
              children: c.children,
              spotId: c.selectedSpotId,
            })),
          }),
        });
        if (res.ok) {
          const data: ServerQuoteResponse = await res.json();
          if (isMounted) {
            setServerQuote(data);
          }
        }
      } catch (err) {
        console.error("Quote fetch error:", err);
      } finally {
        if (isMounted) {
          setIsQuoteLoading(false);
        }
      }
    }

    fetchServerQuote();
    return () => {
      isMounted = false;
    };
  }, [selectedPackageSlug, activeVesselId, selectedDateIso, cabinSlots]);

  // Charter calculation
  const charterQuote = useMemo(() => {
    if (mode !== "charter" || !selectedPkg) return null;
    const pkgId: CharterPackageId = selectedPkg.durationNights === 3 ? "4d3n" : "3d2n";
    return quoteCharter({ packageId: pkgId, pax: charterPax, nonMalaysianPax, wantsInsurance });
  }, [mode, selectedPkg]);

  const grandTotal =
    mode === "charter"
      ? charterQuote?.grandTotal ?? (selectedPkg?.durationNights === 3 ? 26000 : 18000)
      : serverQuote?.grandTotalMYR ?? 0;

  // Proforma Invoice Data matching official PDF layout (#SCA26-03-XXXX)
  const proformaInvoiceData: ProformaInvoiceData = useMemo(() => {
    const primary = cabinGuests["cabin-1"]?.[0] || {
      firstName: "Alexander",
      lastName: "Tan",
      email: "alexander.tan@example.com",
      country: "Malaysia",
      phoneCode: "+60",
      phoneNumber: "12-345 6789",
    };

    const isCharter = mode === "charter";
    const durationNights = selectedPkg?.durationNights ?? 2;
    const attractionEntranceRate = durationNights === 3 ? 70 : 40;
    const gawiJettyFee = 10;
    const insurancePerGuest = 7.50;
    const tourismTaxPerRoom = 20;

    const rooms = isCharter
      ? [
          {
            roomNumber: 1,
            categoryName: "Entire Vessel Private Charter Buyout",
            spotLabel: "Full Boat (12 Staterooms)",
            guests: [
              {
                name: `${primary.firstName} ${primary.lastName} (Lead Charterer)`.trim() || "Lead Charterer",
                packageFare: charterQuote?.packageTotal ?? (durationNights === 3 ? 26000 : 18000),
                entranceTickets: 0,
                jettyFee: 0,
                insurance: 0,
              },
            ],
            tourismTax: 0,
            roomTotal: grandTotal,
          },
        ]
      : cabinSlots.map((slot, idx) => {
          const spot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);
          const category = roomCategories.find((rc) => rc.id === spot?.roomCategoryId);
          const guestsInSlot = cabinGuests[slot.id] || [];
          const quoteCabin = serverQuote?.cabins?.[idx];

          // Use server-fetched per-adult rate if available, otherwise fall back to rate table
          const serverAdultRate = quoteCabin
            ? Math.round((quoteCabin.adultTotalGross + quoteCabin.soloSurcharge) / Math.max(1, slot.adults))
            : slot.adults === 1
              ? (durationNights === 3 ? 2550 : 1800)
              : (durationNights === 3 ? 2050 : 1450);

          const slotGuests = Array.from({ length: Math.max(1, slot.adults) }, (_, gIdx) => {
            const g = guestsInSlot[gIdx];
            const name = g?.firstName && g?.lastName ? `${g.firstName} ${g.lastName}` : `Adult ${gIdx + 1}`;
            const fare = serverAdultRate;

            return {
              name,
              packageFare: fare,
              entranceTickets: attractionEntranceRate,
              jettyFee: gawiJettyFee,
              insurance: insurancePerGuest,
            };
          });

          const roomTotal = quoteCabin?.total ?? (
            slotGuests.reduce((s, g) => s + g.packageFare + g.entranceTickets + g.jettyFee + g.insurance, 0) + tourismTaxPerRoom
          );

          return {
            roomNumber: idx + 1,
            categoryName: category?.name ?? spot?.name ?? (durationNights === 3 ? "Emerald Balcony Suite" : "Upper Vista Stateroom"),
            spotLabel: spot?.name ?? `Stateroom ${idx + 1}`,
            guests: slotGuests,
            tourismTax: tourismTaxPerRoom,
            roomTotal,
          };
        });

    // roomTotal is already the net (post-discount) amount from the server quote.
    // Expose the early bird discount for line-item display in the invoice header,
    // but don't subtract it again from the already-discounted sum.
    const subtotal = isCharter
      ? grandTotal
      : rooms.reduce((sum, r) => sum + r.roomTotal, 0);

    const discount = serverQuote?.cabins?.reduce((sum, c) => sum + (c.earlyBirdDiscount || 0), 0) ?? 0;
    // finalGrandTotal = subtotal since roomTotals are already net
    const finalGrandTotal = subtotal;

    return {
      referenceNumber: bookingRef,
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      vesselName: selectedVessel?.name ?? "Summer Cruise",
      packageTitle: selectedPkg?.title ?? "3D2N Kenyir Explorer",
      durationNights,
      datesLabel: selectedDate?.label ?? "17 Apr – 19 Apr 2026",
      leadGuest: {
        name: `${primary.firstName} ${primary.lastName}`.trim() || "Alexander Tan",
        email: primary.email || "guest@mhgcruise.com",
        phone: `${primary.phoneCode} ${primary.phoneNumber}`.trim() || "+60 12-345 6789",
        country: primary.country || "Malaysia",
      },
      rooms,
      specialRequests: specialRequests || undefined,
      subtotal,
      discount,
      grandTotal: finalGrandTotal,
      depositAmount: Math.round(finalGrandTotal * 0.5),
      balanceDue: Math.round(finalGrandTotal * 0.5),
      isCharter,
    };
  }, [
    bookingRef,
    cabinGuests,
    cabinSlots,
    allCabinSpots,
    mode,
    selectedPkg,
    selectedVessel,
    selectedDate,
    serverQuote,
    grandTotal,
    specialRequests,
    charterQuote,
  ]);

  // Validation
  function canAdvanceFromCabinSelection(): boolean {
    if (mode === "charter") return true;
    return cabinSlots.every((slot) => slot.adults >= 1 && slot.selectedSpotId !== null);
  }

  function canAdvanceFromPersonalDetails(): boolean {
    const primary = cabinGuests["cabin-1"]?.[0];
    if (!primary) return false;
    if (!primary.firstName.trim() || !primary.lastName.trim() || !primary.email.trim() || !primary.phoneNumber.trim()) {
      return false;
    }
    return agreeTerms;
  }

  // Helper for Step 2 inputs
  function updateGuest(cabinId: string, guestIdx: number, field: keyof GuestField, value: string) {
    setCabinGuests((prev) => {
      const currentList = prev[cabinId] ? [...prev[cabinId]] : [];
      while (currentList.length <= guestIdx) {
        currentList.push({
          firstName: "",
          lastName: "",
          email: "",
          country: "Malaysia",
          phoneCode: "+60",
          phoneNumber: "",
          dobMonth: "May",
          dobDay: "14",
          dobYear: "1990",
          membershipNumber: "",
        });
      }
      currentList[guestIdx] = { ...currentList[guestIdx], [field]: value };
      return { ...prev, [cabinId]: currentList };
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Aqua Expeditions Multi-Step Top Progress Bar (Steps 1 to 4) */}
      {step > 0 && mode === "cabin" && (
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Cabin selection" },
              { num: 2, label: "Personal details" },
              { num: 3, label: "Summary" },
              { num: 4, label: "Confirm & Pay" },
            ].map((st, i) => {
              const isActive = step === st.num;
              const isPast = step > st.num;

              return (
                <div key={st.num} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full text-xs font-extrabold transition-all",
                        isPast
                          ? "bg-teal-deep text-white"
                          : isActive
                          ? "border-2 border-obsidian bg-white text-obsidian shadow-md ring-4 ring-teal-deep/20"
                          : "border border-ink/20 bg-ink/5 text-ink/40"
                      )}
                    >
                      {isPast ? <Check className="size-5 stroke-[2.5]" /> : st.num}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium tracking-tight sm:text-sm",
                        isActive ? "font-bold text-ink" : isPast ? "text-teal-deep" : "text-text-muted"
                      )}
                    >
                      {st.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div
                      className={cn(
                        "mx-4 h-0.5 flex-1 rounded",
                        isPast ? "bg-teal-deep" : "bg-ink/15"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Mode Segmented Switcher (Cabin Booking vs Full Vessel Charter) */}
      {step === 0 && (
        <div className="mb-10 flex justify-center animate-fade-in">
          <div className="inline-flex rounded-2xl bg-ink/5 p-1.5 border border-ink/10 shadow-inner">
            <button
              type="button"
              onClick={() => setMode("cabin")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                mode === "cabin"
                  ? "bg-white text-ink shadow-md"
                  : "text-text-muted hover:text-ink"
              )}
            >
              <Ship className="size-4 text-teal-deep" />
              <span>Stateroom Booking (Individual Cabins)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("charter")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                mode === "charter"
                  ? "bg-white text-ink shadow-md"
                  : "text-text-muted hover:text-ink"
              )}
            >
              <Crown className="size-4 text-amber-500 fill-amber-400" />
              <span>Private Full-Vessel Charter (Exclusive Buyout)</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 0: CABIN BOOKING MODE (VESSEL & PACKAGE INDEPENDENT) ── */}
      {step === 0 && mode === "cabin" && (
        <div className="space-y-12 animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-deep">
              Tasik Kenyir Luxury Expeditions
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Book Your Kenyir Cruise
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Choose your cruise ship and package duration, select your departure date, and reserve your stateroom.
            </p>
          </div>

          {/* 1ST THING WE ASK: SELECT CRUISE VESSEL (BOTH CRUISES HAVE BOTH PACKAGES) */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                1. Select Cruise Vessel
              </span>
              <span className="text-xs text-text-muted">
                Both vessels offer both 3D2N and 4D3N expeditions
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Summer Cruise */}
              <button
                type="button"
                onClick={() => handleSelectVessel("summer-cruise")}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                  selectedVesselId === "summer-cruise"
                    ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                    : "border-ink/10 bg-white hover:border-ink/30"
                )}
              >
                {selectedVesselId === "summer-cruise" && (
                  <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                    <Ship className="size-3.5 text-teal-deep" />
                    Flagship Luxury Houseboat
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                    Summer Cruise
                  </h3>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    12 Luxury Lakeview Staterooms · Single Accommodation Deck · Max 34 Guests
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    Our intimate, handcrafted flagship luxury houseboat on Lake Kenyir. Quiet, personal, and loved for peaceful rainforest cruising with 10 dedicated crew members.
                  </p>

                  <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Dedicated accommodation deck with 12 handcrafted staterooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Waterline dining saloon & open teak observation sundeck</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Both 3D2N and 4D3N packages available on board</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
                  <span className="font-semibold text-teal-deep">
                    {selectedVesselId === "summer-cruise" ? "✓ Currently Selected Vessel" : "Click to select Summer Cruise"}
                  </span>
                  <span className="text-text-muted">10 Dedicated Crew</span>
                </div>
              </button>

              {/* Green Horizon */}
              <button
                type="button"
                onClick={() => handleSelectVessel("green-horizon")}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                  selectedVesselId === "green-horizon"
                    ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                    : "border-ink/10 bg-white hover:border-ink/30"
                )}
              >
                {selectedVesselId === "green-horizon" && (
                  <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                    <Ship className="size-3.5 text-teal-deep" />
                    Luxury Grand Houseboat
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                    Green Horizon
                  </h3>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    12 Private Balcony Suites (15 Rooms) · Single Deck Staterooms + Panorama · Max 60 Guests
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    Newly launched grand luxury houseboat engineered for panoramic gatherings. Expansive social spaces, private stateroom balconies, and modern amenities with 10 dedicated crew.
                  </p>

                  <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Private balconies on every 1st-floor stateroom with lake views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Level 3 Panorama suites, roof deck & entertainment lounge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                      <span>Both 3D2N and 4D3N packages available on board</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
                  <span className="font-semibold text-teal-deep">
                    {selectedVesselId === "green-horizon" ? "✓ Currently Selected Vessel" : "Click to select Green Horizon"}
                  </span>
                  <span className="text-text-muted">10 Dedicated Crew</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2ND THING WE ASK: THE 2 PACKAGES (3D2N vs 4D3N) WITHOUT FANCY NAMES */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                2. Select Expedition Package
              </span>
              <span className="text-xs text-text-muted">
                All departures sail from Pengkalan Gawi Jetty · Sailing aboard <strong className="text-ink">{selectedVessel.name}</strong>
              </span>
            </div>

            {/* Dynamic per-adult rates based on current initialAdults */}
            {(() => {
              const p3Rate = initialAdults === 1 ? 1800 : 1450;
              const p3Gross = initialAdults * p3Rate + (initialChildren * Math.round(1450 * 0.5));
              const p4Rate = initialAdults === 1 ? 2550 : 2050;
              const p4Gross = initialAdults * p4Rate + (initialChildren * Math.round(2050 * 0.5));

              return (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Package 1: 3D2N */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackageSlug("3d2n-kenyir-explorer")}
                    className={cn(
                      "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                      selectedPackageSlug === "3d2n-kenyir-explorer"
                        ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                        : "border-ink/10 bg-white hover:border-ink/30"
                    )}
                  >
                    {selectedPackageSlug === "3d2n-kenyir-explorer" && (
                      <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                        <Bookmark className="size-3.5 fill-teal-deep text-teal-deep" />
                        3 Days · 2 Nights (Fri–Sun)
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                        3D2N Kenyir Explorer
                      </h3>
                      <p className="mt-1 text-xs text-text-muted">
                        Weekend Voyage aboard <strong className="text-ink">{selectedVessel.name}</strong>
                      </p>

                      <p className="mt-4 text-xs leading-relaxed text-text-muted">
                        An unhurried weekend voyage through Kenyir&apos;s emerald bays. Two peaceful nights beneath ancient rainforest canopies, swimming in secluded waterfall lagoons at Lasir, and twilight deck dining.
                      </p>

                      <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Secluded swim in multi-tiered Lasir waterfall cascades</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Natural Kelah Sanctuary freshwater fish spa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Full board artisanal lake-to-table cuisine included</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4">
                      <div>
                        <span className="text-[11px] text-text-muted">Amount per adult:</span>
                        <div className="font-display text-2xl font-bold text-obsidian">
                          RM {p3Rate.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-text-muted">/ adult</span>
                        </div>
                        <span className="text-[11px] text-teal-deep font-medium">
                          {initialAdults === 1
                            ? "Solo Stateroom Rate"
                            : `RM ${p3Gross.toLocaleString()} total for ${initialAdults} adult${initialAdults > 1 ? "s" : ""}${initialChildren > 0 ? ` + ${initialChildren} child` : ""}`}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-teal-deep">
                        Departs 12:00pm Fri
                      </span>
                    </div>
                  </button>

                  {/* Package 2: 4D3N */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackageSlug("4d3n-kenyir-grand-voyage")}
                    className={cn(
                      "relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 shadow-sm sm:p-8",
                      selectedPackageSlug === "4d3n-kenyir-grand-voyage"
                        ? "border-teal-deep bg-teal-soft/10 ring-4 ring-teal-deep/15 shadow-lg scale-[1.01]"
                        : "border-ink/10 bg-white hover:border-ink/30"
                    )}
                  >
                    {selectedPackageSlug === "4d3n-kenyir-grand-voyage" && (
                      <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-teal-deep text-white shadow">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
                        <Bookmark className="size-3.5 fill-teal-deep text-teal-deep" />
                        4 Days · 3 Nights (Mon–Fri)
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-medium text-ink">
                        4D3N Kenyir Grand Voyage
                      </h3>
                      <p className="mt-1 text-xs text-text-muted">
                        Midweek Expedition aboard <strong className="text-ink">{selectedVessel.name}</strong>
                      </p>

                      <p className="mt-4 text-xs leading-relaxed text-text-muted">
                        An immersive four-day expedition into Kenyir&apos;s untamed remote reaches — prehistoric limestone caverns at Bewah, dramatic Tembat river canyon drifts, and starlit open-air roof deck dining.
                      </p>

                      <div className="mt-5 space-y-1.5 text-xs text-ink/80">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Prehistoric Bewah cavern exploration & limestone trail</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Tembat river canyon drift & private gorge swimming</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-gold-bright shrink-0" />
                          <span>Thousand-year Melunak giant rainforest trail & suspension bridge</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4">
                      <div>
                        <span className="text-[11px] text-text-muted">Amount per adult:</span>
                        <div className="font-display text-2xl font-bold text-obsidian">
                          RM {p4Rate.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-text-muted">/ adult</span>
                        </div>
                        <span className="text-[11px] text-teal-deep font-medium">
                          {initialAdults === 1
                            ? "Solo Stateroom Rate"
                            : `RM ${p4Gross.toLocaleString()} total for ${initialAdults} adult${initialAdults > 1 ? "s" : ""}${initialChildren > 0 ? ` + ${initialChildren} child` : ""}`}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-teal-deep">
                        Departs 12:00pm Mon
                      </span>
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* 3RD THING WE ASK: GRAPHICAL DATE SELECTOR WITH AQUA COLOR COMBOS */}
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
              3. Choose Departure Date
            </div>

            <GraphicalDateSelector
              departures={departures}
              selectedDateIso={selectedDateIso}
              onSelectDateIso={setSelectedDateIso}
              vesselId={activeVesselId}
              packageSlug={selectedPackageSlug}
              durationNights={selectedPkg?.durationNights}
              isCharterMode={false}
              onOpenItineraryModal={() => setShowItineraryModal(true)}
            />
          </div>

          {/* 4TH THING WE ASK: GUEST PARTY SIZE */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink">
              4. Guest Count
            </div>
            <p className="text-xs text-text-muted mb-6">
              Pricing dynamically reflects occupancy: Solo travelers enjoy dedicated private stateroom; rates per adult adjust for double occupancy.
            </p>

            <div className="flex flex-wrap items-center gap-8">
              {/* Adults */}
              <div className="flex items-center gap-3">
                <div>
                  <span className="block text-sm font-semibold text-ink">Adults</span>
                  <span className="block text-[11px] text-text-muted">Ages 12+</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={initialAdults <= 1}
                    onClick={() => setInitialAdults(Math.max(1, initialAdults - 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-sm font-bold disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-bold text-ink">{initialAdults}</span>
                  <button
                    type="button"
                    disabled={initialAdults >= 10}
                    onClick={() => setInitialAdults(initialAdults + 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-sm font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center gap-3">
                <div>
                  <span className="block text-sm font-semibold text-ink">Children</span>
                  <span className="block text-[11px] text-text-muted">Ages 5–11 (50% off)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={initialChildren <= 0}
                    onClick={() => setInitialChildren(Math.max(0, initialChildren - 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-sm font-bold disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-bold text-ink">{initialChildren}</span>
                  <button
                    type="button"
                    disabled={initialChildren >= 6}
                    onClick={() => setInitialChildren(initialChildren + 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-ink/20 text-sm font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Button into Aqua 4-Step Funnel */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink/10 pt-6">
              <div>
                <span className="text-xs text-text-muted">Selected Voyage</span>
                <div className="font-semibold text-ink">
                  {selectedVessel.name} · {selectedPkg?.title} · {selectedDate?.label}
                </div>
                <div className="text-xs text-teal-deep font-medium mt-0.5">
                  Amount per adult: RM {(initialAdults === 1 ? (selectedPkg?.durationNights === 3 ? 2550 : 1800) : (selectedPkg?.durationNights === 3 ? 2050 : 1450)).toLocaleString()} / adult
                </div>
                {initialAdults > 2 && (
                  <div className="mt-1 text-[11px] text-amber-700 font-medium">
                    → Will auto-create {Math.ceil(initialAdults / 2)} cabins (2 adults each) — you can adjust in the next step
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  // Distribute adults evenly into cabins (max 2 per cabin, standard occupancy).
                  // e.g. 4 adults → 2 cabins × 2 adults; 3 adults → 2 cabins (2 + 1); 1 adult → 1 cabin (solo)
                  const suggestedCabinCount = Math.max(1, Math.ceil(initialAdults / 2));
                  const adultsPerCabin = Math.floor(initialAdults / suggestedCabinCount);
                  const extraAdult = initialAdults % suggestedCabinCount; // goes in cabin 1

                  const spotPool = activeVesselId === "summer-cruise" ? SC_SPOTS : GH_SPOTS;

                  const slots: CabinSlot[] = Array.from({ length: suggestedCabinCount }, (_, i) => {
                    const adultsInThisCabin = adultsPerCabin + (i === 0 ? extraAdult : 0);
                    const childrenInThisCabin = i === 0 ? initialChildren : 0;
                    return {
                      id: `cabin-${i + 1}`,
                      adults: adultsInThisCabin,
                      children: childrenInThisCabin,
                      childBirthDates: Array.from({ length: childrenInThisCabin }, () => ({
                        month: "March",
                        day: "7",
                        year: "2018",
                      })),
                      selectedSpotId: spotPool[i] ?? null,
                      isOpen: i === 0, // open first cabin, collapse rest
                    };
                  });

                  setCabinSlots(slots);
                  setCabinCount(suggestedCabinCount);
                  setStep(1);
                  window.scrollTo({ top: 250, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-obsidian px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-lg"
              >
                <span>Continue to Cabin Selection</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 0: PRIVATE CHARTER MODE (EXCLUSIVE SHIP BUYOUT) ── */}
      {step === 0 && mode === "charter" && (
        <div className="space-y-12 animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1.5">
              <Crown className="size-4 fill-amber-500 text-amber-500" />
              Exclusive Private Buyout
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Private Vessel Charter
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Full private vessel charter is offered only on sailing dates with 100% open inventory (zero individual cabins booked).
            </p>
          </div>

          {/* Vessel tabs for Charter Mode */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCharterVesselId("summer-cruise");
              }}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all",
                charterVesselId === "summer-cruise"
                  ? "border-teal-deep bg-teal-deep text-white shadow-md ring-2 ring-teal-deep/30"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40"
              )}
            >
              <Ship className="size-4" />
              <span>Summer Cruise (12 Lakeview Staterooms)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCharterVesselId("green-horizon");
              }}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all",
                charterVesselId === "green-horizon"
                  ? "border-teal-deep bg-teal-deep text-white shadow-md ring-2 ring-teal-deep/30"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40"
              )}
            >
              <Ship className="size-4" />
              <span>Green Horizon (12 Balcony Suites / 15 Rooms)</span>
            </button>
          </div>

          {/* Date Selector for Charter with Green 100% open availability indicator */}
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
              1. Select 100% Unreserved Charter Date
            </div>

            <GraphicalDateSelector
              departures={departures}
              selectedDateIso={selectedDateIso}
              onSelectDateIso={setSelectedDateIso}
              vesselId={charterVesselId}
              packageSlug={selectedPackageSlug}
              durationNights={selectedPkg?.durationNights}
              isCharterMode={true}
              onOpenItineraryModal={() => setShowItineraryModal(true)}
            />
          </div>

          {/* Eligible Cruises for Charter on the Selected Date */}
          {(() => {
            const scInv = selectedDate?.vessels?.["summer-cruise"];
            const ghInv = selectedDate?.vessels?.["green-horizon"];
            const scEligible = scInv?.canCharter ?? false;
            const ghEligible = ghInv?.canCharter ?? false;

            return (
              <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink">
                    2. Available Private Vessels on {selectedDate?.label}
                  </span>
                  <span className="text-xs text-text-muted">
                    Vessels appear here ONLY if 0 cabins are booked
                  </span>
                </div>

                {!scEligible && !ghEligible ? (
                  <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-6 text-center">
                    <Crown className="mx-auto size-8 text-amber-500" />
                    <h4 className="mt-2 font-display text-lg font-medium text-ink">
                      No Full-Vessel Charter Available on {selectedDate?.label}
                    </h4>
                    <p className="mt-1 max-w-md mx-auto text-xs text-text-muted">
                      Both Summer Cruise and Green Horizon have active individual cabin bookings on this date. Under maritime charter policy, full-vessel buyouts are only unlocked when all 12 cabins are unreserved.
                    </p>
                    <p className="mt-3 text-xs font-semibold text-teal-deep">
                      Please select an alternate sailing date marked &quot;100% Open · Charter Eligible&quot; in green above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Summer Cruise Charter Card */}
                    {scEligible && (
                      <div className="flex flex-col justify-between rounded-3xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50/40 to-white p-6 shadow-md sm:p-8">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                              <Crown className="size-3.5 fill-amber-600 text-amber-600" />
                              100% Unreserved · 12 Cabins Open
                            </span>
                            <span className="text-xs font-bold text-teal-deep">Full Vessel Charter</span>
                          </div>

                          <h3 className="mt-3 font-display text-2xl font-medium text-ink">
                            Summer Cruise — Private Buyout
                          </h3>
                          <p className="mt-1 text-xs text-text-muted">
                            Exclusive charter of the entire vessel for up to 24 guests across 12 private staterooms.
                          </p>

                          <ul className="mt-5 space-y-2 text-xs text-ink/80">
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Entire ship reserved exclusively for your party</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Dedicated crew of 4 with private executive chef</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Customizable anchorage schedule & tender water excursions</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Both 3D2N and 4D3N charter durations available</span>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-8 border-t border-ink/10 pt-5 space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                            <span>Select Voyage Duration:</span>
                            <span>Max 24 Guests</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setCharterVesselId("summer-cruise");
                                setSelectedPackageSlug("3d2n-kenyir-explorer");
                                setMode("charter");
                                setStep(2);
                                window.scrollTo({ top: 250, behavior: "smooth" });
                              }}
                              className="flex-1 rounded-xl bg-obsidian px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-md flex flex-col items-center justify-center text-center gap-0.5"
                            >
                              <span>Book 3D2N Charter &rarr;</span>
                              <span className="text-[11px] font-normal text-amber-200">RM 18,000 / voyage</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCharterVesselId("summer-cruise");
                                setSelectedPackageSlug("4d3n-kenyir-grand-voyage");
                                setMode("charter");
                                setStep(2);
                                window.scrollTo({ top: 250, behavior: "smooth" });
                              }}
                              className="flex-1 rounded-xl border-2 border-obsidian bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-obsidian hover:text-white shadow-md flex flex-col items-center justify-center text-center gap-0.5"
                            >
                              <span>Book 4D3N Charter &rarr;</span>
                              <span className="text-[11px] font-normal text-teal-deep">RM 22,000 / voyage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Green Horizon Charter Card */}
                    {ghEligible && (
                      <div className="flex flex-col justify-between rounded-3xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50/40 to-white p-6 shadow-md sm:p-8">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                              <Crown className="size-3.5 fill-amber-600 text-amber-600" />
                              100% Unreserved · 12 Balcony Suites Open
                            </span>
                            <span className="text-xs font-bold text-teal-deep">Full Vessel Charter</span>
                          </div>

                          <h3 className="mt-3 font-display text-2xl font-medium text-ink">
                            Green Horizon — Private Buyout
                          </h3>
                          <p className="mt-1 text-xs text-text-muted">
                            Exclusive charter of the flagship vessel for up to 30 guests across 12 balcony suites.
                          </p>

                          <ul className="mt-5 space-y-2 text-xs text-ink/80">
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Private use of all 12 panoramic balcony staterooms</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Full vessel crew of 5 & private expedition naturalist</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Custom expedition deep south to Bewah prehistoric caves</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Both 3D2N and 4D3N charter durations available</span>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-8 border-t border-ink/10 pt-5 space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                            <span>Select Voyage Duration:</span>
                            <span>Max 30 Guests</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setCharterVesselId("green-horizon");
                                setSelectedPackageSlug("3d2n-kenyir-explorer");
                                setMode("charter");
                                setStep(2);
                                window.scrollTo({ top: 250, behavior: "smooth" });
                              }}
                              className="flex-1 rounded-xl border-2 border-obsidian bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-obsidian hover:text-white shadow-md flex flex-col items-center justify-center text-center gap-0.5"
                            >
                              <span>Book 3D2N Charter &rarr;</span>
                              <span className="text-[11px] font-normal text-teal-deep">RM 20,000 / voyage</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCharterVesselId("green-horizon");
                                setSelectedPackageSlug("4d3n-kenyir-grand-voyage");
                                setMode("charter");
                                setStep(2);
                                window.scrollTo({ top: 250, behavior: "smooth" });
                              }}
                              className="flex-1 rounded-xl bg-obsidian px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep shadow-md flex flex-col items-center justify-center text-center gap-0.5"
                            >
                              <span>Book 4D3N Charter &rarr;</span>
                              <span className="text-[11px] font-normal text-amber-200">RM 26,000 / voyage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Route Map Itinerary Modal */}
          {showItineraryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6 animate-fade-in">
              <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-deep">
                      Lake Kenyir Route & Waypoints
                    </span>
                    <h3 className="font-display text-xl font-medium text-ink">
                      {selectedPkg?.title} · {selectedPkg?.durationLabel}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowItineraryModal(false)}
                    className="flex size-9 items-center justify-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/15"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-6">
                  <DynamicCruiseMap
                    waypoints={MOCK_WAYPOINTS[selectedPkg?.slug] || MOCK_WAYPOINTS["3d2n-kenyir-explorer"]}
                    packageSlug={selectedPkg?.slug}
                    packageTitle={selectedPkg?.title}
                    durationLabel={selectedPkg?.durationLabel}
                  />
                </div>

                <div className="flex justify-end border-t border-ink/10 bg-[#FAFAF8] px-6 py-3">
                  <button
                    type="button"
                    onClick={() => setShowItineraryModal(false)}
                    className="rounded-xl bg-teal-deep px-5 py-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Close Map
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 1: CABIN SELECTION (AQUA STEP 1) ── */}
      {step === 1 && mode === "cabin" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start animate-fade-in">
          {/* Main Cabin Selection Area */}
          <div className="space-y-8 lg:col-span-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="mb-1 text-xs font-semibold text-teal-deep hover:underline"
                >
                  &larr; Change Package / Sailing
                </button>
                <h2 className="font-display text-3xl font-medium text-ink">Cabin Selection</h2>
                <p className="mt-1 text-xs text-text-muted">
                  Choose your staterooms on the ship deck plan. Each cabin can be assigned its own adult and child guest count.
                </p>
              </div>

              {/* Number of Cabins Dropdown (Aqua style: 1 cabin to 5 cabins) */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-text-muted">Number of cabins:</label>
                <select
                  value={cabinCount}
                  onChange={(e) => updateCabinCount(parseInt(e.target.value, 10))}
                  className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                >
                  <option value={1}>1 cabin</option>
                  <option value={2}>2 cabins</option>
                  <option value={3}>3 cabins</option>
                  <option value={4}>4 cabins</option>
                  <option value={5}>5 cabins</option>
                </select>
              </div>
            </div>

            {/* Per-Cabin Accordion Cards */}
            <div className="space-y-6">
              {cabinSlots.map((slot, idx) => {
                const otherClaimedSpotIds = cabinSlots
                  .filter((_, otherIdx) => otherIdx !== idx)
                  .map((s) => s.selectedSpotId)
                  .filter(Boolean) as string[];

                const currentPax = slot.adults + slot.children;
                const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);

                return (
                  <div
                    key={slot.id}
                    className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
                  >
                    {/* Cabin Card Header */}
                    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-medium text-ink">
                            Cabin {idx + 1}
                            {assignedSpot && (
                              <span className="ml-2 font-sans text-sm font-normal text-teal-deep">
                                ({assignedSpot.name})
                              </span>
                            )}
                          </h3>
                        </div>
                        <p className="text-[11px] text-text-muted">Fields with * are mandatory</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateSlot(idx, { isOpen: !slot.isOpen })}
                        className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink"
                      >
                        {slot.isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </button>
                    </div>

                    {slot.isOpen && (
                      <div className="mt-6 space-y-6">
                        {/* Number of Adults & Children Dropdowns */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-text-muted">
                              Number of Adults*
                            </label>
                            <select
                              value={slot.adults}
                              onChange={(e) => updateSlot(idx, { adults: parseInt(e.target.value, 10) })}
                              className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                            >
                              <option value={1}>1 Adult (Single Occupancy)</option>
                              <option value={2}>2 Adults</option>
                              <option value={3}>3 Adults</option>
                              <option value={4}>4 Adults</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-text-muted">
                              Number of Children
                            </label>
                            <select
                              value={slot.children}
                              onChange={(e) => updateSlot(idx, { children: parseInt(e.target.value, 10) })}
                              className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                            >
                              <option value={0}>0 Children</option>
                              <option value={1}>1 Child</option>
                              <option value={2}>2 Children</option>
                              <option value={3}>3 Children</option>
                            </select>
                          </div>
                        </div>

                        {/* Child Date of Birth dropdowns */}
                        {slot.children > 0 && (
                          <div className="space-y-4 rounded-2xl border border-teal-deep/15 bg-teal-soft/10 p-5">
                            <div className="text-xs font-bold text-teal-deep">
                              Child Guest Details for Cabin {idx + 1}
                            </div>

                            {Array.from({ length: slot.children }).map((_, childIdx) => {
                              const dob = slot.childBirthDates[childIdx] || {
                                month: "March",
                                day: "7",
                                year: "2018",
                              };

                              return (
                                <div key={childIdx} className="space-y-2">
                                  <label className="block text-xs font-semibold text-ink">
                                    Child {childIdx + 1}&apos;s Date of Birth*
                                  </label>
                                  <div className="grid grid-cols-3 gap-2">
                                    <select
                                      value={dob.month}
                                      onChange={(e) => {
                                        const nextDates = [...slot.childBirthDates];
                                        nextDates[childIdx] = { ...dob, month: e.target.value };
                                        updateSlot(idx, { childBirthDates: nextDates });
                                      }}
                                      className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                                    >
                                      {MONTHS_LIST.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                      ))}
                                    </select>

                                    <select
                                      value={dob.day}
                                      onChange={(e) => {
                                        const nextDates = [...slot.childBirthDates];
                                        nextDates[childIdx] = { ...dob, day: e.target.value };
                                        updateSlot(idx, { childBirthDates: nextDates });
                                      }}
                                      className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                                    >
                                      {DAYS_LIST.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                      ))}
                                    </select>

                                    <select
                                      value={dob.year}
                                      onChange={(e) => {
                                        const nextDates = [...slot.childBirthDates];
                                        nextDates[childIdx] = { ...dob, year: e.target.value };
                                        updateSlot(idx, { childBirthDates: nextDates });
                                      }}
                                      className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                                    >
                                      {CHILD_YEARS.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              );
                            })}

                            <p className="text-[11px] leading-relaxed text-text-muted">
                              Note: We welcome children from 5–11 years old. If your child is 12 and above, adult rates will apply.
                            </p>
                          </div>
                        )}

                        {/* Early Bird Promo Banner */}
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-4 text-xs text-text-muted">
                          <Bookmark className="size-4 shrink-0 fill-emerald-600 text-emerald-600" />
                          <span>
                            Select <strong className="text-ink">Cabin 1101</strong> or <strong className="text-ink">Cabin 1201</strong> to enjoy our complimentary Early Bird Bonus and lake-sunrise viewpoint.
                          </span>
                        </div>

                        {/* Bus-like Deck Plan Cabin Picker */}
                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink">
                              Select cabin on deck for Cabin {idx + 1}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {currentPax} guest{currentPax > 1 ? "s" : ""} in this cabin
                            </span>
                          </div>

                          <AquaDeckCabinPicker
                            vesselId={activeVesselId}
                            selectedSpotId={slot.selectedSpotId}
                            onSelectSpot={(spotId) => handleSelectSpotForCabin(idx, spotId)}
                            otherSelectedSpotIds={otherClaimedSpotIds}
                            currentCabinPax={currentPax}
                            cabinIndex={idx}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Right Sidebar (Server-Fetched Dynamic Quote) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-deep">
                  Expedition Details
                </span>
                <h4 className="font-display text-xl font-medium text-ink">
                  {selectedPkg?.title}
                </h4>
                <div className="mt-1 text-xs text-text-muted">
                  {selectedPkg?.durationNights} Nights | Pengkalan Gawi &gt; Pengkalan Gawi
                </div>
                <div className="mt-1 font-semibold text-xs text-ink">
                  {selectedDate?.label}
                </div>
                <div className="mt-0.5 text-xs text-text-muted">
                  {selectedVessel?.name}
                </div>
              </div>

              {/* Server-Fetched Itemized Breakdown */}
              <div className="space-y-4 border-t border-ink/10 pt-4">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <span>Stateroom Breakdown</span>
                  {isQuoteLoading && <Loader2 className="size-3 animate-spin text-teal-deep" />}
                </div>

                {serverQuote?.cabins?.map((c, i) => (
                  <div key={i} className="rounded-xl bg-[#FAFAF8] p-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-ink">
                      <span>Cabin {i + 1} ({c.planLabel})</span>
                      <span>{formatPrice(c.total)}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-text-muted">
                      <div className="flex justify-between">
                        <span>Package fare ({c.adults} adult{c.adults > 1 ? 's' : ''})</span>
                        <span>{formatPrice(c.adultTotalGross)}</span>
                      </div>

                      {c.soloSurcharge > 0 && (
                        <div className="flex items-center justify-between text-amber-700">
                          <span className="flex items-center gap-1">
                            25% solo surcharge <Info className="size-3" />
                          </span>
                          <span>{formatPrice(c.soloSurcharge)}</span>
                        </div>
                      )}

                      {c.childrenTotal > 0 && (
                        <div className="flex justify-between text-teal-deep">
                          <span>Children (x{c.children})</span>
                          <span>{formatPrice(c.childrenTotal)}</span>
                        </div>
                      )}

                      {c.entranceTicketsTotal > 0 && (
                        <div className="flex justify-between">
                          <span>Entrance tickets</span>
                          <span>{formatPrice(c.entranceTicketsTotal)}</span>
                        </div>
                      )}

                      {c.earlyBirdDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Early Bird 5% Discount</span>
                          <span>-{formatPrice(c.earlyBirdDiscount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="border-t border-ink/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-sm text-ink">Total (MYR)</span>
                  <span className="font-display text-2xl font-bold text-obsidian">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-text-muted">
                  Taxes, park permits, excursions & full-board meals included
                </p>

                <button
                  type="button"
                  disabled={!canAdvanceFromCabinSelection()}
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-obsidian py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
                >
                  <span>Next: Personal Details</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: PERSONAL DETAILS (AQUA STEP 2) ── */}
      {step === 2 && mode === "cabin" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start animate-fade-in">
          <div className="space-y-8 lg:col-span-8">
            <div>
              <h2 className="font-display text-3xl font-medium text-ink">Personal Details</h2>
              <p className="mt-1 text-xs text-text-muted">
                Please enter guest details for each stateroom. Fields marked with * are required for maritime manifest registration.
              </p>
            </div>

            {/* Forms Grouped by Cabin */}
            {cabinSlots.map((slot, cabinIdx) => {
              const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);
              const cabinId = slot.id;

              return (
                <div
                  key={slot.id}
                  className="space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="border-b border-ink/10 pb-4">
                    <h3 className="font-display text-xl font-medium text-ink">
                      Cabin {cabinIdx + 1} {assignedSpot ? `(${assignedSpot.name})` : ""}
                    </h3>
                    <p className="text-[11px] text-text-muted">Fields with * are mandatory</p>
                  </div>

                  {/* Adult 1 (Primary Guest in Cabin 1) */}
                  <div className="space-y-4">
                    <div className="font-semibold text-xs uppercase tracking-wider text-teal-deep">
                      Adult 1 {cabinIdx === 0 ? "(Primary Guest)" : ""}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">First name*</label>
                        <input
                          type="text"
                          value={cabinGuests[cabinId]?.[0]?.firstName ?? ""}
                          onChange={(e) => updateGuest(cabinId, 0, "firstName", e.target.value)}
                          placeholder="e.g. Alexander"
                          className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">Last name*</label>
                        <input
                          type="text"
                          value={cabinGuests[cabinId]?.[0]?.lastName ?? ""}
                          onChange={(e) => updateGuest(cabinId, 0, "lastName", e.target.value)}
                          placeholder="e.g. Tan"
                          className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-muted">Email address*</label>
                      <input
                        type="email"
                        value={cabinGuests[cabinId]?.[0]?.email ?? ""}
                        onChange={(e) => updateGuest(cabinId, 0, "email", e.target.value)}
                        placeholder="alexander.tan@example.com"
                        className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">Country of residence*</label>
                        <select
                          value={cabinGuests[cabinId]?.[0]?.country ?? "Malaysia"}
                          onChange={(e) => updateGuest(cabinId, 0, "country", e.target.value)}
                          className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">Contact Number*</label>
                        <div className="flex gap-2">
                          <select
                            value={cabinGuests[cabinId]?.[0]?.phoneCode ?? "+60"}
                            onChange={(e) => updateGuest(cabinId, 0, "phoneCode", e.target.value)}
                            className="w-24 rounded-xl border border-ink/20 bg-white px-2 py-2.5 text-sm font-medium focus:outline-none"
                          >
                            {COUNTRIES_LIST.map((c) => (
                              <option key={c.name} value={c.code}>{c.code} ({c.name.slice(0, 3)})</option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={cabinGuests[cabinId]?.[0]?.phoneNumber ?? ""}
                            onChange={(e) => updateGuest(cabinId, 0, "phoneNumber", e.target.value)}
                            placeholder="12-345 6789"
                            className="flex-1 rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date of Birth dropdowns */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-muted">Date of birth*</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={cabinGuests[cabinId]?.[0]?.dobMonth ?? "May"}
                          onChange={(e) => updateGuest(cabinId, 0, "dobMonth", e.target.value)}
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {MONTHS_LIST.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>

                        <select
                          value={cabinGuests[cabinId]?.[0]?.dobDay ?? "14"}
                          onChange={(e) => updateGuest(cabinId, 0, "dobDay", e.target.value)}
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {DAYS_LIST.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>

                        <select
                          value={cabinGuests[cabinId]?.[0]?.dobYear ?? "1988"}
                          onChange={(e) => updateGuest(cabinId, 0, "dobYear", e.target.value)}
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {ADULT_YEARS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-muted">
                        MHG Club / Loyalty membership number (optional)
                      </label>
                      <input
                        type="text"
                        value={cabinGuests[cabinId]?.[0]?.membershipNumber ?? ""}
                        onChange={(e) => updateGuest(cabinId, 0, "membershipNumber", e.target.value)}
                        placeholder="e.g. MHG-GOLD-8821"
                        className="w-full rounded-xl border border-ink/20 px-3.5 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Additional Adults if slot.adults > 1 */}
                  {slot.adults > 1 && (
                    <div className="space-y-4 border-t border-ink/10 pt-4">
                      <div className="font-semibold text-xs uppercase tracking-wider text-teal-deep">
                        Adult 2
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">First name*</label>
                          <input
                            type="text"
                            value={cabinGuests[cabinId]?.[1]?.firstName ?? ""}
                            onChange={(e) => updateGuest(cabinId, 1, "firstName", e.target.value)}
                            placeholder="e.g. Sarah"
                            className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">Last name*</label>
                          <input
                            type="text"
                            value={cabinGuests[cabinId]?.[1]?.lastName ?? ""}
                            onChange={(e) => updateGuest(cabinId, 1, "lastName", e.target.value)}
                            placeholder="e.g. Tan"
                            className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Children if slot.children > 0 */}
                  {slot.children > 0 && (
                    <div className="space-y-4 border-t border-ink/10 pt-4">
                      <div className="font-semibold text-xs uppercase tracking-wider text-teal-deep">
                        Child 1
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">First name*</label>
                          <input
                            type="text"
                            placeholder="Child's first name"
                            className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">Last name*</label>
                          <input
                            type="text"
                            placeholder="Child's last name"
                            className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Date of birth pre-filled: {slot.childBirthDates[0]?.month} {slot.childBirthDates[0]?.day}, {slot.childBirthDates[0]?.year}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special Requests & Agreement */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4 sm:p-8">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">
                  Special Requests & Dietary Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Halal, vegetarian, anniversaries, mobility assistance..."
                  className="w-full rounded-xl border border-ink/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 size-4 accent-teal-deep"
                />
                <span className="text-xs text-text-muted leading-relaxed">
                  I agree to the Lake Kenyir National Park regulations, maritime safety protocols, and standard cruise cancellation terms.
                </span>
              </label>
            </div>
          </div>

          {/* Sticky Right Sidebar — Step 2 Cabin Mode */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-deep">
                  Expedition Details
                </span>
                <h4 className="font-display text-xl font-medium text-ink">
                  {selectedPkg?.title}
                </h4>
                <div className="mt-1 text-xs text-text-muted">
                  {selectedPkg?.durationNights} Nights | Pengkalan Gawi → Pengkalan Gawi
                </div>
                <div className="mt-1 font-semibold text-xs text-ink">
                  {selectedDate?.label}
                </div>
                <div className="mt-0.5 text-xs text-text-muted">
                  {selectedVessel?.name}
                </div>
              </div>

              {/* Per-cabin compact summary */}
              <div className="space-y-2 border-t border-ink/10 pt-4 text-xs">
                {isQuoteLoading && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Loader2 className="size-3 animate-spin text-teal-deep" />
                    <span>Updating quote…</span>
                  </div>
                )}
                {serverQuote?.cabins?.map((c, i) => (
                  <div key={i} className="flex justify-between text-text-muted">
                    <span>Cabin {i + 1} · {c.planLabel} ({c.adults} adult{c.adults > 1 ? 's' : ''}{c.children > 0 ? ` + ${c.children} child` : ''})</span>
                    <span className="font-medium text-ink">{formatPrice(c.total)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-sm text-ink">Total (MYR)</span>
                  <span className="font-display text-2xl font-bold text-obsidian">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-text-muted">
                  Taxes, park permits, excursions &amp; full-board meals included
                </p>

                <button
                  type="button"
                  disabled={!canAdvanceFromPersonalDetails()}
                  onClick={() => {
                    setStep(3);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-obsidian py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
                >
                  <span>Next: Review Summary</span>
                  <ArrowRight className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-3 w-full text-center text-xs font-semibold text-text-muted hover:text-ink"
                >
                  ← Back to Cabin Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: PERSONAL DETAILS (CHARTER BUYOUT MODE) ── */}
      {step === 2 && mode === "charter" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start animate-fade-in">
          <div className="space-y-8 lg:col-span-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <Crown className="size-4 fill-amber-500 text-amber-500" />
                Private Vessel Buyout Registration
              </span>
              <h2 className="mt-1 font-display text-3xl font-medium text-ink">
                Charterer & Organization Details
              </h2>
              <p className="mt-1 text-xs text-text-muted">
                Please provide primary contact information for the charter contract and port authority maritime manifest clearance.
              </p>
            </div>

            <div className="space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-ink/10 pb-4">
                <h3 className="font-display text-xl font-medium text-ink">
                  Lead Charterer (Primary Contact)
                </h3>
                <p className="text-[11px] text-text-muted">Fields marked with * are required for maritime charter booking</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">First name*</label>
                  <input
                    type="text"
                    value={cabinGuests["cabin-1"]?.[0]?.firstName ?? ""}
                    onChange={(e) => updateGuest("cabin-1", 0, "firstName", e.target.value)}
                    placeholder="e.g. Alexander"
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Last name*</label>
                  <input
                    type="text"
                    value={cabinGuests["cabin-1"]?.[0]?.lastName ?? ""}
                    onChange={(e) => updateGuest("cabin-1", 0, "lastName", e.target.value)}
                    placeholder="e.g. Tan"
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Email address*</label>
                  <input
                    type="email"
                    value={cabinGuests["cabin-1"]?.[0]?.email ?? ""}
                    onChange={(e) => updateGuest("cabin-1", 0, "email", e.target.value)}
                    placeholder="alexander.tan@example.com"
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Contact Number*</label>
                  <div className="flex gap-2">
                    <select
                      value={cabinGuests["cabin-1"]?.[0]?.phoneCode ?? "+60"}
                      onChange={(e) => updateGuest("cabin-1", 0, "phoneCode", e.target.value)}
                      className="w-24 rounded-xl border border-ink/20 bg-white px-2 py-2.5 text-sm font-medium focus:outline-none"
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c.name} value={c.code}>{c.code} ({c.name.slice(0, 3)})</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={cabinGuests["cabin-1"]?.[0]?.phoneNumber ?? ""}
                      onChange={(e) => updateGuest("cabin-1", 0, "phoneNumber", e.target.value)}
                      placeholder="12-345 6789"
                      className="flex-1 rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Company / Organization / Family Group Name (Optional)
                </label>
                <input
                  type="text"
                  value={cabinGuests["cabin-1"]?.[0]?.membershipNumber ?? ""}
                  onChange={(e) => updateGuest("cabin-1", 0, "membershipNumber", e.target.value)}
                  placeholder="e.g. Tan Family Reunion / Apex Ventures"
                  className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Special Charter Requests & Dietary Requirements
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. VIP barbecue grill on observation deck, bespoke dining schedule, celebratory champagne service..."
                  className="w-full rounded-xl border border-ink/20 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-4 text-xs">
                <input
                  type="checkbox"
                  id="charter-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 size-4 rounded accent-teal-deep"
                />
                <label htmlFor="charter-terms" className="text-text-muted cursor-pointer">
                  I confirm that I have reviewed the vessel charter policy, full-vessel buyout regulations, and agree to submit the final passenger manifest 7 days prior to departure.
                </label>
              </div>
            </div>
          </div>

          {/* Charter Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                  <Crown className="size-3.5 fill-amber-500 text-amber-500" />
                  Full Vessel Charter
                </span>
                <h4 className="font-display text-xl font-medium text-ink">
                  {selectedVessel?.name} — Private Buyout
                </h4>
                <div className="mt-1 text-xs text-text-muted">
                  {selectedPkg?.durationNights} Nights | 12 Cabins Included
                </div>
                <div className="mt-0.5 font-semibold text-xs text-ink">
                  {selectedDate?.label}
                </div>
              </div>

              <div className="border-t border-ink/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-sm text-ink">Charter Total (MYR)</span>
                  <span className="font-display text-2xl font-bold text-obsidian">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-text-muted">
                  100% exclusive vessel buyout · Crew of 4–5 & private chef included
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={!canAdvanceFromPersonalDetails()}
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-obsidian py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
                  >
                    <span>Next: Review Summary</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-center text-xs font-semibold text-text-muted hover:text-ink"
                  >
                    &larr; Back to Vessel & Date Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: SUMMARY & PROFORMA INVOICE (AQUA STEP 3) ── */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Switcher: Manifest Summary vs Official Proforma Invoice (#SCA26-) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <h2 className="font-display text-3xl font-medium text-ink">
                {summaryViewTab === "invoice" ? "Official Proforma Invoice" : "Booking Summary"}
              </h2>
              <p className="mt-1 text-xs text-text-muted">
                {summaryViewTab === "invoice"
                  ? `Official proforma billing dossier reference ${bookingRef} issued by Summer Bay Travels & Tours Sdn. Bhd.`
                  : "Please review your staterooms and guest manifest details. You can inspect the full proforma invoice at any time."}
              </p>
            </div>

            <div className="inline-flex rounded-2xl bg-ink/5 p-1.5 border border-ink/10 shadow-inner">
              <button
                type="button"
                onClick={() => setSummaryViewTab("summary")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  summaryViewTab === "summary"
                    ? "bg-white text-ink shadow-md"
                    : "text-text-muted hover:text-ink"
                )}
              >
                <Bookmark className="size-3.5" />
                <span>Manifest Summary</span>
              </button>

              <button
                type="button"
                onClick={() => setSummaryViewTab("invoice")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  summaryViewTab === "invoice"
                    ? "bg-teal-deep text-white shadow-md"
                    : "text-text-muted hover:text-ink"
                )}
              >
                <FileText className="size-3.5" />
                <span>Official Proforma Invoice ({bookingRef})</span>
              </button>
            </div>
          </div>

          {summaryViewTab === "invoice" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSummaryViewTab("summary")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
                >
                  <ChevronLeft className="size-4" />
                  <span>Back to Manifest Summary</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(4);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-deep px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-obsidian transition"
                >
                  <ShieldCheck className="size-4" />
                  <span>Proceed to Confirm & Pay</span>
                </button>
              </div>

              <ProformaInvoiceView data={proformaInvoiceData} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
              <div className="space-y-8 lg:col-span-8">
                {mode === "charter" ? (
                  <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          <Crown className="size-3.5 fill-amber-600 text-amber-600" />
                          Private Full-Vessel Buyout
                        </span>
                        <h3 className="mt-2 font-display text-2xl font-medium text-ink">
                          {selectedVessel?.name} Exclusive Charter
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
                      >
                        <Edit2 className="size-3.5" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="text-text-muted">Lead Charterer</span>
                        <div className="mt-0.5 font-semibold text-ink">
                          {cabinGuests["cabin-1"]?.[0]?.firstName} {cabinGuests["cabin-1"]?.[0]?.lastName}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-muted">Contact Email</span>
                        <div className="mt-0.5 font-semibold text-ink">
                          {cabinGuests["cabin-1"]?.[0]?.email}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-muted">Contact Phone</span>
                        <div className="mt-0.5 font-semibold text-ink">
                          {cabinGuests["cabin-1"]?.[0]?.phoneCode} {cabinGuests["cabin-1"]?.[0]?.phoneNumber}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-muted">Included Cabins</span>
                        <div className="mt-0.5 font-semibold text-ink">
                          All 12 Private Staterooms (Single Deck)
                        </div>
                      </div>
                    </div>

                    {specialRequests && (
                      <div className="rounded-2xl border border-ink/10 bg-[#FAFAF8] p-4 text-xs">
                        <span className="font-bold text-ink">Special Charter Requests:</span>
                        <p className="mt-1 text-text-muted">{specialRequests}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cabinSlots.map((slot, idx) => {
                      const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);
                      const primary = cabinGuests[slot.id]?.[0] || {
                        firstName: "Alexander",
                        lastName: "Tan",
                        email: "alexander.tan@example.com",
                        country: "Malaysia",
                        phoneCode: "+60",
                        phoneNumber: "12-345 6789",
                        dobMonth: "May",
                        dobDay: "14",
                        dobYear: "1988",
                      };

                      return (
                        <div
                          key={slot.id}
                          className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
                        >
                          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                            <h3 className="font-display text-xl font-medium text-ink">
                              Cabin {idx + 1} {assignedSpot ? `(${assignedSpot.name})` : ""}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
                            >
                              <Edit2 className="size-3.5" /> Edit
                            </button>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-teal-deep">
                              Adult 1 (Primary Guest)
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-text-muted">Name</span>
                                <div className="mt-0.5 font-semibold text-ink">
                                  {primary.firstName} {primary.lastName}
                                </div>
                              </div>

                              <div>
                                <span className="text-text-muted">Date of birth</span>
                                <div className="mt-0.5 font-semibold text-ink">
                                  {primary.dobDay} {primary.dobMonth} {primary.dobYear}
                                </div>
                              </div>

                              <div>
                                <span className="text-text-muted">Country of residence</span>
                                <div className="mt-0.5 font-semibold text-ink">
                                  {primary.country}
                                </div>
                              </div>

                              <div>
                                <span className="text-text-muted">Contact number</span>
                                <div className="mt-0.5 font-semibold text-ink">
                                  {primary.phoneCode} {primary.phoneNumber}
                                </div>
                              </div>

                              <div className="col-span-2">
                                <span className="text-text-muted">Email</span>
                                <div className="mt-0.5 font-semibold text-ink">
                                  {primary.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {specialRequests && (
                      <div className="rounded-2xl border border-ink/10 bg-[#FAFAF8] p-5 text-xs">
                        <span className="font-bold text-ink">Special Requests:</span>
                        <p className="mt-1 text-text-muted">{specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sticky Right Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-deep">
                      Expedition Invoice
                    </span>
                    <h4 className="font-display text-xl font-medium text-ink">
                      {selectedPkg?.title}
                    </h4>
                    <div className="mt-1 text-xs text-text-muted">
                      {selectedPkg?.durationNights} Nights | Pengkalan Gawi &gt; Pengkalan Gawi
                    </div>
                    <div className="mt-0.5 font-semibold text-xs text-ink">
                      {selectedDate?.label}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted">
                      {selectedVessel?.name} {mode === "charter" ? "(Full Vessel Buyout)" : ""}
                    </div>
                  </div>

                  {/* View Official Invoice button */}
                  <button
                    type="button"
                    onClick={() => setSummaryViewTab("invoice")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-deep/30 bg-teal-soft/10 py-2.5 text-xs font-bold uppercase tracking-wider text-teal-deep transition hover:bg-teal-soft/25"
                  >
                    <FileText className="size-3.5" />
                    <span>View Official Proforma Invoice</span>
                  </button>

                  {/* Itemized pricing */}
                  <div className="space-y-3 border-t border-ink/10 pt-4 text-xs">
                    {mode === "charter" ? (
                      <div className="flex justify-between text-text-muted">
                        <span>Full Boat Buyout (12 Cabins)</span>
                        <span className="font-medium text-ink">{formatPrice(grandTotal)}</span>
                      </div>
                    ) : (
                      serverQuote?.cabins?.map((c, i) => (
                        <div key={i} className="flex justify-between text-text-muted">
                          <span>Cabin {i + 1} ({c.planLabel})</span>
                          <span className="font-medium text-ink">{formatPrice(c.total)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-ink/10 pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-sm text-ink">Total (MYR)</span>
                      <span className="font-display text-2xl font-bold text-obsidian">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(4);
                        window.scrollTo({ top: 150, behavior: "smooth" });
                      }}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-deep py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-obsidian shadow-lg"
                    >
                      <ShieldCheck className="size-4" />
                      <span>Proceed to Confirm & Pay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: CONFIRM & PAY (AQUA STEP 4) ── */}
      {step === 4 && (
        <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-xl sm:p-12 animate-fade-in">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-teal-deep text-white shadow-lg">
            <Check className="size-10 stroke-[3]" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Booking Confirmed
          </span>

          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
            Bon Voyage!
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Your Lake Kenyir luxury voyage is secured. An official proforma billing invoice ({bookingRef}) has been prepared.
          </p>

          <div className="mt-8 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-6 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-ink/10 pb-2">
              <span className="text-text-muted">Booking Reference</span>
              <span className="font-mono font-bold text-ink">{bookingRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Vessel</span>
              <span className="font-medium text-ink">{selectedVessel?.name} {mode === "charter" ? "(Full Vessel Buyout)" : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Itinerary</span>
              <span className="font-medium text-ink">{selectedPkg?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Departure Dates</span>
              <span className="font-medium text-ink">{selectedDate?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Staterooms</span>
              <span className="font-medium text-ink">
                {mode === "charter"
                  ? "All 12 Private Staterooms (Full Vessel Buyout)"
                  : cabinSlots.map((s) => allCabinSpots.find((spot) => spot.id === s.selectedSpotId)?.planLabel).filter(Boolean).join(", ")}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-bold text-sm">
              <span className="text-ink">Total Paid</span>
              <span className="text-obsidian">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappLink(
                WHATSAPP_NUMBER,
                `Hello! My booking reference is ${bookingRef} for ${selectedPkg?.title} on ${selectedDate?.label}. Looking forward to our Lake Kenyir expedition.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-95 shadow-md"
            >
              <MessageCircle className="size-4" />
              Message Concierge on WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-deep/30 bg-teal-soft/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-teal-deep transition hover:bg-teal-soft/25 shadow-xs"
            >
              <FileText className="size-4" />
              View / Print Proforma Invoice
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-ink/5"
            >
              <Printer className="size-4" />
              Print Dossier
            </button>
          </div>
        </div>
      )}

      {/* Official Proforma Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-4 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-ink/5 text-ink hover:bg-ink/10 transition"
              >
                <X className="size-5" />
              </button>
              <ProformaInvoiceView data={proformaInvoiceData} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
