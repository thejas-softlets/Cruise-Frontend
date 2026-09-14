"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import type { Vessel, RoomCategory, Package } from "@/types";
import { cn } from "@/lib/utils";
import { getDepartureDates } from "@/lib/departure-dates";
import { GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";
import { SC_CABIN_SPOTS } from "@/lib/sc-deck-plan";
import { quoteMultiCabinBooking, type MultiCabinQuoteSummary } from "@/lib/booking-pricing";
import { type ProformaInvoiceData } from "./ProformaInvoiceView";

import {
  type BookingMode,
  type VesselId,
  type CabinSlot,
  type GuestField,
  SC_SPOTS,
  GH_SPOTS,
} from "./booking-types";

import { Step0PackageAndDate } from "./Step0PackageAndDate";
import { Step1CabinSelection } from "./Step1CabinSelection";
import { Step2PersonalDetails } from "./Step2PersonalDetails";
import { Step3SummaryAndPay } from "./Step3SummaryAndPay";
import { Step4Confirmation } from "./Step4Confirmation";
import { BookingSidebarSummary } from "./BookingSidebarSummary";

const DEPARTURES = getDepartureDates({ includeFull: true, limit: 32 });

interface BookingWizardProps {
  vessels: Vessel[];
  packages: Package[];
  roomCategories: RoomCategory[];
  initialVesselId?: VesselId;
  initialMode?: BookingMode;
}

/**
 * Main Booking Wizard Orchestrator
 *
 * Implements Aqua Expeditions-caliber booking flow for Lake Kenyir:
 * - Step 0: Package & Date Selection (Unified fleet pool, 3D2N vs 4D3N)
 * - Step 1: Cabin Selection (Multi-cabin selector 1–5, deck plan stateroom picker)
 * - Step 2: Personal Details (Per-cabin adult nationality & child DOB)
 * - Step 3: Summary & Proforma Invoice (Performa dossier #SCA26-03-XXXX)
 * - Step 4: Confirmation & Instant Concierge Payment Link
 */
export function BookingWizard({
  vessels,
  packages,
  roomCategories,
  initialVesselId,
  initialMode,
}: BookingWizardProps) {
  // Wizard navigation step: 0 to 4
  const [step, setStep] = useState<number>(0);
  const [mode, setMode] = useState<BookingMode>(initialMode ?? "cabin");

  // Step 0 State: Package & Departure Date
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string>("3d2n-kenyir-explorer");
  const [selectedDateIso, setSelectedDateIso] = useState<string>(DEPARTURES[0]?.iso ?? "");
  const [initialAdults, setInitialAdults] = useState<number>(2);
  const [initialChildren, setInitialChildren] = useState<number>(0);

  // Charter vessel selection state
  const [charterVesselId, setCharterVesselId] = useState<VesselId>(initialVesselId ?? "summer-cruise");

  // Departures list
  const departures = DEPARTURES;

  // Active selected package
  const selectedPkg = useMemo(() => {
    return packages.find((p) => p.slug === selectedPackageSlug) ?? packages[0];
  }, [packages, selectedPackageSlug]);

  // Active selected departure date
  const selectedDate = useMemo(() => {
    return departures.find((d) => d.iso === selectedDateIso) ?? departures[0];
  }, [departures, selectedDateIso]);

  // Active selected vessel (Summer Cruise by default in cabin mode; specific in charter)
  const activeVesselId: VesselId = mode === "charter" ? charterVesselId : "summer-cruise";
  const selectedVessel = useMemo(() => {
    return vessels.find((v) => v.id === activeVesselId) ?? vessels[0];
  }, [vessels, activeVesselId]);

  // Combined pool of all stateroom spots across both vessels
  const allCabinSpots = useMemo(() => {
    return [...SC_CABIN_SPOTS, ...GH_CABIN_SPOTS];
  }, []);

  // Step 1: Multi-Cabin Slots State (Aqua Expeditions style: 1 to 5 cabins)
  const [cabinCount, setCabinCount] = useState<number>(1);
  const [cabinSlots, setCabinSlots] = useState<CabinSlot[]>([
    {
      id: "cabin-1",
      adults: 2,
      children: 0,
      childBirthDates: [],
      selectedSpotId: "sc-1-1101",
      isOpen: true,
    },
  ]);

  // Step 2: Passenger Manifest & Personal Details per Cabin
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

  // Official Summer Cruise Booking Reference matching PDF (#SCA26-03-XXXX)
  const [bookingRef] = useState(() => `#SCA26-03-${Math.floor(1000 + Math.random() * 9000)}`);

  // Server quote dynamic state
  const [serverQuote, setServerQuote] = useState<MultiCabinQuoteSummary | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);

  // Update cabin slots count
  const handleCabinCountChange = useCallback((newCount: number) => {
    setCabinCount(newCount);
    setCabinSlots((prev) => {
      const nextSlots = [...prev];
      while (nextSlots.length < newCount) {
        const idx = nextSlots.length + 1;
        const fallbackSpot = idx <= SC_SPOTS.length ? SC_SPOTS[idx - 1] : null;
        nextSlots.push({
          id: `cabin-${idx}`,
          adults: 2,
          children: 0,
          childBirthDates: [],
          selectedSpotId: fallbackSpot,
          isOpen: true,
        });
      }
      return nextSlots.slice(0, newCount);
    });
  }, []);

  // Update individual cabin slot attributes
  const handleUpdateSlot = useCallback((index: number, patch: Partial<CabinSlot>) => {
    setCabinSlots((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;

      const updated = { ...current, ...patch };

      // Synchronize child birth dates array if child count changes
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
  }, []);

  // Update guest attributes for Step 2
  const handleUpdateGuest = useCallback(
    (cabinId: string, guestIdx: number, field: keyof GuestField, value: string) => {
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
    },
    []
  );

  // Fetch or calculate multi-cabin quote dynamically whenever inputs change
  useEffect(() => {
    let isMounted = true;
    async function fetchServerQuote() {
      setIsQuoteLoading(true);
      try {
        const payloadCabins = cabinSlots.map((slot, idx) => {
          const guestsInSlot = cabinGuests[slot.id] || [];
          const spot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);

          const guests = Array.from({ length: slot.adults + slot.children }).map((_, gIdx) => {
            const isAdult = gIdx < slot.adults;
            const g = guestsInSlot[gIdx];
            const childDob = !isAdult ? slot.childBirthDates[gIdx - slot.adults] : undefined;

            return {
              category: isAdult ? "adult" : "child",
              name: g?.firstName ? `${g.firstName} ${g.lastName}` : isAdult ? `Adult ${gIdx + 1}` : `Child ${gIdx - slot.adults + 1}`,
              country: g?.country || "Malaysia",
              dob: childDob,
              email: g?.email,
              phone: g?.phoneNumber,
            };
          });

          return {
            cabinId: slot.id,
            spotId: slot.selectedSpotId,
            spotName: spot?.name,
            adults: slot.adults,
            children: slot.children,
            guests,
          };
        });

        const res = await fetch("/api/booking/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packageSlug: selectedPackageSlug,
            departureDateIso: selectedDateIso,
            cabins: payloadCabins,
            agencyCommissionPercent: 10,
          }),
        });

        if (res.ok) {
          const data: MultiCabinQuoteSummary = await res.json();
          if (isMounted) {
            setServerQuote(data);
          }
        } else {
          // Fallback to local pricing engine
          const localQuote = quoteMultiCabinBooking(
            selectedPackageSlug,
            selectedDateIso,
            payloadCabins.map((c) => ({
              cabinId: c.cabinId,
              spotId: c.spotId,
              spotName: c.spotName,
              adultsCount: c.adults,
              childrenCount: c.children,
              toddlersCount: 0,
              infantsCount: 0,
              guests: c.guests.map((g, gIdx) => ({
                id: `${c.cabinId}-g${gIdx}`,
                category: g.category as "adult" | "child",
                name: g.name,
                country: g.country,
                isMalaysian: g.country.toLowerCase() === "malaysia",
                dob: g.dob,
                email: g.email,
                phone: g.phone,
              })),
            })),
            10
          );
          if (isMounted) {
            setServerQuote(localQuote);
          }
        }
      } catch (err) {
        console.error("Failed to fetch server quote, fallback to local:", err);
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
  }, [selectedPackageSlug, selectedDateIso, cabinSlots, cabinGuests, allCabinSpots]);

  // Grand total determination
  const charterGrandTotal = selectedPkg?.durationNights === 3 ? 26000 : 18000;
  const grandTotal = mode === "charter" ? charterGrandTotal : serverQuote?.grandTotalNetMYR ?? 0;

  // Validation rules for advancing between steps
  const canAdvanceFromCabinSelection = useCallback((): boolean => {
    if (mode === "charter") return true;
    return cabinSlots.every((slot) => slot.adults >= 1 && slot.selectedSpotId !== null);
  }, [mode, cabinSlots]);

  const canAdvanceFromPersonalDetails = useCallback((): boolean => {
    const primary = cabinGuests["cabin-1"]?.[0];
    if (!primary) return false;
    if (
      !primary.firstName.trim() ||
      !primary.lastName.trim() ||
      !primary.email.trim() ||
      !primary.phoneNumber.trim()
    ) {
      return false;
    }
    return agreeTerms;
  }, [cabinGuests, agreeTerms]);

  // Construct Proforma Invoice Dossier Data matching authentic PDF layout (#SCA26-03-XXXX)
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

    if (isCharter) {
      const pkgFare = charterGrandTotal;
      return {
        referenceNumber: bookingRef,
        createdDate: new Date().toLocaleDateString("en-MY", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        vesselName: charterVesselId === "green-horizon" ? "Green Horizon" : "Summer Cruise",
        packageTitle: `${selectedPkg?.title ?? "Expedition"} (Private Buyout)`,
        durationNights,
        datesLabel: selectedDate?.label ?? "Selected Sailing",
        leadGuest: {
          name: `${primary.firstName} ${primary.lastName}`.trim() || "Lead Charterer",
          email: primary.email || "charter@example.com",
          phone: `${primary.phoneCode} ${primary.phoneNumber}`.trim() || "+60 12-345 6789",
          country: primary.country || "Malaysia",
        },
        rooms: [
          {
            roomNumber: 1,
            categoryName: "Entire Vessel Private Charter Buyout",
            spotLabel: "Full Boat (12 Staterooms)",
            guests: [
              {
                name: `${primary.firstName} ${primary.lastName} (Lead Charterer)`.trim() || "Lead Charterer",
                packageFare: pkgFare,
                entranceTickets: 0,
                jettyFee: 0,
                insurance: 0,
              },
            ],
            tourismTax: 0,
            roomTotal: pkgFare,
          },
        ],
        specialRequests,
        subtotal: pkgFare,
        discount: 0,
        grandTotal: pkgFare,
        depositAmount: Math.round(pkgFare * 0.3),
        balanceDue: Math.round(pkgFare * 0.7),
        isCharter: true,
      };
    }

    // Individual Cabin Booking Manifest
    const rooms = (serverQuote?.cabins || []).map((c, idx) => ({
      roomNumber: idx + 1,
      categoryName: c.roomCategoryName || "Deluxe Stateroom",
      spotLabel: c.spotName || `Room ${c.planLabel || idx + 1}`,
      guests: c.itemizedGuests.map((g) => ({
        name: g.name,
        packageFare: g.packageFare,
        entranceTickets: g.attractionTicket,
        jettyFee: g.jettyFee,
        insurance: g.insurance,
      })),
      tourismTax: c.tourismTaxTotal,
      roomTotal: c.cabinGrossTotal,
    }));

    return {
      referenceNumber: bookingRef,
      createdDate: new Date().toLocaleDateString("en-MY", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      vesselName: selectedVessel.name,
      packageTitle: selectedPkg?.title ?? "Kenyir Lake Expedition",
      durationNights,
      datesLabel: selectedDate?.label ?? "Selected Sailing",
      leadGuest: {
        name: `${primary.firstName} ${primary.lastName}`.trim() || "Lead Passenger",
        email: primary.email || "guest@example.com",
        phone: `${primary.phoneCode} ${primary.phoneNumber}`.trim() || "+60 12-345 6789",
        country: primary.country || "Malaysia",
      },
      rooms,
      specialRequests,
      subtotal: serverQuote?.grossPackageFaresTotal ?? 0,
      discount: serverQuote?.agencyCommissionDiscountMYR ?? 0,
      discountLabel: `Travel Agency Commission (${serverQuote?.agencyCommissionRatePercent ?? 10}%):`,
      discountPercent: serverQuote?.agencyCommissionRatePercent ?? 10,
      grandTotal: serverQuote?.grandTotalNetMYR ?? 0,
      depositAmount: serverQuote?.depositRequiredMYR ?? 0,
      depositPercent: 30,
      balanceDue: serverQuote?.balanceDueMYR ?? 0,
      isCharter: false,
    };
  }, [
    mode,
    selectedPkg,
    bookingRef,
    charterGrandTotal,
    charterVesselId,
    selectedDate,
    cabinGuests,
    specialRequests,
    serverQuote,
    selectedVessel,
  ]);

  // Departure date object for DOB age evaluation
  const departureDateObj = useMemo(() => {
    return selectedDateIso ? new Date(selectedDateIso) : new Date();
  }, [selectedDateIso]);

  // Total guest count
  const totalGuests = useMemo(() => {
    return cabinSlots.reduce((sum, c) => sum + c.adults + c.children, 0);
  }, [cabinSlots]);

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
                        isActive
                          ? "font-bold text-ink"
                          : isPast
                          ? "text-teal-deep"
                          : "text-text-muted"
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

      {/* ── STEP 0: PACKAGE & DEPARTURE DATE SELECTION ── */}
      {step === 0 && (
        <Step0PackageAndDate
          mode={mode}
          onSetMode={setMode}
          packages={packages}
          selectedPackageSlug={selectedPackageSlug}
          onSelectPackageSlug={setSelectedPackageSlug}
          departures={departures}
          selectedDateIso={selectedDateIso}
          onSelectDateIso={setSelectedDateIso}
          initialAdults={initialAdults}
          onInitialAdultsChange={setInitialAdults}
          initialChildren={initialChildren}
          onInitialChildrenChange={setInitialChildren}
          charterVesselId={charterVesselId}
          onCharterVesselIdChange={setCharterVesselId}
          onContinueToCabins={() => {
            // Pre-seed cabin slots from initial adult/child estimates
            const suggestedCabins = Math.max(1, Math.ceil(initialAdults / 2));
            const adultsPerCabin = Math.floor(initialAdults / suggestedCabins);
            const extraAdult = initialAdults % suggestedCabins;

            const slots: CabinSlot[] = Array.from({ length: suggestedCabins }, (_, i) => {
              const adultsInThisCabin = adultsPerCabin + (i === 0 ? extraAdult : 0);
              const childrenInThisCabin = i === 0 ? initialChildren : 0;
              return {
                id: `cabin-${i + 1}`,
                adults: Math.max(1, adultsInThisCabin),
                children: childrenInThisCabin,
                childBirthDates: Array.from({ length: childrenInThisCabin }, () => ({
                  month: "March",
                  day: "7",
                  year: "2018",
                })),
                selectedSpotId: SC_SPOTS[i] ?? null,
                isOpen: i === 0,
              };
            });

            setCabinSlots(slots);
            setCabinCount(suggestedCabins);
            setStep(1);
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
          onContinueToCharter={() => {
            setStep(2);
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
          vessels={vessels}
        />
      )}

      {/* ── STEP 1: CABIN SELECTION (AQUA STEP 1) ── */}
      {step === 1 && mode === "cabin" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start animate-fade-in">
          <div className="lg:col-span-8">
            <Step1CabinSelection
              cabinCount={cabinCount}
              onCabinCountChange={handleCabinCountChange}
              cabinSlots={cabinSlots}
              onUpdateSlot={handleUpdateSlot}
              activeVesselId={activeVesselId}
              allCabinSpots={allCabinSpots}
              onBackToStep0={() => setStep(0)}
            />
          </div>

          <div className="lg:col-span-4">
            <BookingSidebarSummary
              packageInfo={selectedPkg}
              dateLabel={selectedDate?.label ?? "Selected Sailing"}
              quote={serverQuote}
              isLoading={isQuoteLoading}
              step={1}
              onNext={() => {
                setStep(2);
                window.scrollTo({ top: 180, behavior: "smooth" });
              }}
              canAdvance={canAdvanceFromCabinSelection()}
              actionLabel="Next: Personal Details"
              onBack={() => setStep(0)}
              backLabel="← Change Package / Sailing"
            />
          </div>
        </div>
      )}

      {/* ── STEP 2: PERSONAL DETAILS (AQUA STEP 2) ── */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start animate-fade-in">
          <div className="lg:col-span-8">
            <Step2PersonalDetails
              isCharter={mode === "charter"}
              cabinSlots={cabinSlots}
              cabinGuests={cabinGuests}
              onUpdateGuest={handleUpdateGuest}
              allCabinSpots={allCabinSpots}
              departureDate={departureDateObj}
              specialRequests={specialRequests}
              onSpecialRequestsChange={setSpecialRequests}
              agreeTerms={agreeTerms}
              onAgreeTermsChange={setAgreeTerms}
            />
          </div>

          <div className="lg:col-span-4">
            <BookingSidebarSummary
              packageInfo={selectedPkg}
              dateLabel={selectedDate?.label ?? "Selected Sailing"}
              quote={serverQuote}
              isLoading={isQuoteLoading}
              step={2}
              isCharter={mode === "charter"}
              charterGrandTotal={charterGrandTotal}
              vesselName={
                mode === "charter"
                  ? charterVesselId === "green-horizon"
                    ? "Green Horizon Buyout"
                    : "Summer Cruise Buyout"
                  : selectedVessel.name
              }
              onNext={() => {
                setStep(3);
                window.scrollTo({ top: 150, behavior: "smooth" });
              }}
              canAdvance={canAdvanceFromPersonalDetails()}
              actionLabel="Next: Review Summary"
              onBack={() => setStep(mode === "charter" ? 0 : 1)}
              backLabel={mode === "charter" ? "← Back to Date Selection" : "← Back to Cabin Selection"}
            />
          </div>
        </div>
      )}

      {/* ── STEP 3: SUMMARY & PROFORMA INVOICE (AQUA STEP 3) ── */}
      {step === 3 && (
        <Step3SummaryAndPay
          isCharter={mode === "charter"}
          packageInfo={selectedPkg}
          vessel={selectedVessel}
          dateLabel={selectedDate?.label ?? "Selected Sailing"}
          bookingRef={bookingRef}
          cabinSlots={cabinSlots}
          cabinGuests={cabinGuests}
          allCabinSpots={allCabinSpots}
          specialRequests={specialRequests}
          quote={serverQuote}
          grandTotal={grandTotal}
          proformaInvoiceData={proformaInvoiceData}
          onBackToCabins={() => setStep(1)}
          onProceedToPayment={() => {
            setStep(4);
            window.scrollTo({ top: 150, behavior: "smooth" });
          }}
        />
      )}

      {/* ── STEP 4: CONFIRMATION & PAYMENT (AQUA STEP 4) ── */}
      {step === 4 && (
        <Step4Confirmation
          bookingRef={bookingRef}
          packageInfo={selectedPkg}
          vessel={selectedVessel}
          dateLabel={selectedDate?.label ?? "Selected Sailing"}
          grandTotal={grandTotal}
          totalCabins={cabinSlots.length}
          totalGuests={totalGuests}
          leadGuestName={`${cabinGuests["cabin-1"]?.[0]?.firstName || "Lead"} ${cabinGuests["cabin-1"]?.[0]?.lastName || "Guest"}`}
          leadGuestEmail={cabinGuests["cabin-1"]?.[0]?.email || "guest@example.com"}
          onOpenInvoice={() => setStep(3)}
        />
      )}
    </div>
  );
}
