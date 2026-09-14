/**
 * Lake Kenyir Cruise Booking & Pricing Engine
 *
 * Sourced from authentic Kenyir Lake cruise operations (Summer Bay Travels & Tours /
 * Summer Cruise & Green Horizon) and official Performa Invoice dossier (#SCA26-03-0037).
 *
 * Core Business Rules:
 * 1. Package Fare is per-adult based on room category and duration (3D2N vs 4D3N).
 *    Solo stateroom occupancy incurs a single supplement surcharge.
 * 2. Mandatory pass-through fees (government & port):
 *    - Attraction Entrance Tickets: RM 40 (Malaysian) vs RM 70 (Foreigner).
 *    - Gawi Jetty Terminal Fees: RM 10 per person.
 *    - Marine Passenger Insurance: RM 7.50 per person.
 * 3. Malaysian Tourism Tax (TTx - Act 791):
 *    - RM 10.00 per room per night for foreign passport holders.
 *    - Evaluated cabin by cabin: applied if at least one foreign guest occupies that room.
 *    - Malaysian citizens and PRs are 100% exempt (RM 0).
 * 4. Travel Agency Commission / Partner Discount:
 *    - Applied exclusively to the Package Fare subtotal.
 *    - Mandatory pass-through fees and taxes are strictly non-commissionable.
 */

export type PackageDuration = "3d2n" | "4d3n";

export interface GuestDob {
  day: string;
  month: string;
  year: string;
}

export type GuestAgeCategory = "adult" | "child" | "toddler" | "infant";

export interface GuestConfig {
  id: string;
  category: GuestAgeCategory;
  name?: string;
  country: string; // e.g. "Malaysia", "Singapore", "United Kingdom"
  isMalaysian: boolean;
  dob?: GuestDob;
  email?: string;
  phone?: string;
}

export interface CabinBookingInput {
  cabinId: string;
  spotId: string | null;
  spotName?: string;
  roomCategoryName?: string;
  vesselId?: "summer-cruise" | "green-horizon";
  adultsCount: number;
  childrenCount: number;
  toddlersCount: number;
  infantsCount: number;
  guests: GuestConfig[];
}

export interface ItemizedGuestFare {
  guestIndex: number;
  name: string;
  category: GuestAgeCategory;
  isMalaysian: boolean;
  packageFare: number;
  attractionTicket: number;
  jettyFee: number;
  insurance: number;
  guestTotal: number;
}

export interface CabinPricingQuote {
  cabinId: string;
  cabinIndex: number;
  spotId: string | null;
  spotName: string;
  planLabel?: string;
  roomCategoryName: string;
  vesselName: string;
  vesselId: "summer-cruise" | "green-horizon";
  adultsCount: number;
  childrenCount: number;
  toddlersCount: number;
  infantsCount: number;
  totalPax: number;
  baseRatePerAdult: number;
  soloSurcharge: number;
  isSoloOccupancy: boolean;
  packageFareSubtotal: number;
  attractionTicketsSubtotal: number;
  jettyFeesSubtotal: number;
  insuranceSubtotal: number;
  hasForeigner: boolean;
  tourismTaxPerNight: number;
  tourismTaxTotal: number;
  cabinGrossTotal: number;
  itemizedGuests: ItemizedGuestFare[];
}

export interface MultiCabinQuoteSummary {
  packageSlug: string;
  packageTitle: string;
  durationNights: number;
  departureDateIso: string;
  totalCabins: number;
  totalAdults: number;
  totalChildren: number;
  totalToddlers: number;
  totalInfants: number;
  totalPax: number;
  cabins: CabinPricingQuote[];
  
  // Financial aggregation
  grossPackageFaresTotal: number;
  agencyCommissionRatePercent: number;
  agencyCommissionDiscountMYR: number;
  netPackageFaresMYR: number;

  totalAttractionTicketsMYR: number;
  totalJettyFeesMYR: number;
  totalInsuranceMYR: number;
  totalPassThroughFeesMYR: number;

  totalTourismTaxMYR: number;

  subtotalGrossMYR: number;
  grandTotalNetMYR: number;
  depositRequiredMYR: number;
  balanceDueMYR: number;

  averageRatePerAdultMYR: number;
  currency: string;
}

// ==========================================
// DYNAMIC PLACEHOLDER RATES (Kenyir Baseline)
// ==========================================
export const DEFAULT_PRICING_CONFIG = {
  // Pass-through government / port fees
  attractionTicketMalaysianMYR: 40,
  attractionTicketForeignerMYR: 70,
  gawiJettyFeePerPaxMYR: 10,
  insurancePerPaxMYR: 7.5,
  tourismTaxPerNightPerForeignRoomMYR: 10,

  // Default Travel Agency Commission (e.g. 10% on package fare)
  defaultAgencyCommissionPercent: 10,
  depositPercentage: 30,

  // Stateroom Base Rates per adult (Double-sharing basis)
  // 3D2N (2 nights) vs 4D3N (3 nights)
  stateroomRates: {
    "3d2n": {
      standard: 1898, // Deluxe Family
      premium: 1998,  // Premium Panorama, Vista, Lake View, Master Suite
      singleSupplement: 1000, // Solo adult room occupancy (+RM 1,000 as in PDF RM 2,898)
      childRate: 949, // 50% of standard double
      toddlerRate: 250, // Nominal facilities charge
      infantRate: 0, // Complimentary
    },
    "4d3n": {
      standard: 2698,
      premium: 2898,
      singleSupplement: 1400,
      childRate: 1349,
      toddlerRate: 350,
      infantRate: 0,
    },
  },
};

/**
 * Check if country string indicates Malaysian domestic nationality
 */
export function checkIsMalaysian(countryStr: string): boolean {
  if (!countryStr) return true; // default domestic if unspecified
  const lower = countryStr.toLowerCase().trim();
  return (
    lower === "malaysia" ||
    lower === "my" ||
    lower === "+60" ||
    lower.includes("malaysian")
  );
}

/**
 * Calculate age in years from GuestDob relative to sailing departure date
 */
export function calculateAge(dob: GuestDob | undefined, departureDate: Date): number | null {
  if (!dob || !dob.year || !dob.month || !dob.day) return null;
  const birthDate = new Date(`${dob.year}-${dob.month}-${dob.day}`);
  if (isNaN(birthDate.getTime())) return null;

  let age = departureDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = departureDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && departureDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Automatically classify kid into infant / toddler / child / adult based on DOB
 * relative to the departure date:
 * - < 2 years (< 24 months): "infant" (FOC complimentary)
 * - 2 to 3 years (24 to 47 months): "toddler" (nominal facility charge)
 * - 4 to 11 years (48 to 143 months): "child" (50% package fare with bed)
 * - 12+ years: "adult" (standard adult fare)
 */
export function determineAgeCategoryFromDob(
  dob: GuestDob | undefined,
  departureDate: Date
): GuestAgeCategory {
  const age = calculateAge(dob, departureDate);
  if (age === null) return "child"; // default fallback if DOB pending
  if (age < 2) return "infant";
  if (age < 4) return "toddler";
  if (age < 12) return "child";
  return "adult";
}

/**
 * Calculate detailed pricing for a single cabin
 */
export function calculateCabinQuote(
  cabinInput: CabinBookingInput,
  cabinIndex: number,
  durationNights: number,
  is4D3N: boolean,
  agencyCommissionPercent: number = DEFAULT_PRICING_CONFIG.defaultAgencyCommissionPercent,
  departureDate: Date = new Date("2026-11-06")
): CabinPricingQuote {
  const tierKey = is4D3N ? "4d3n" : "3d2n";
  const rates = DEFAULT_PRICING_CONFIG.stateroomRates[tierKey];

  // Determine if premium room category
  const spotId = cabinInput.spotId || "";
  const isPremium =
    spotId.includes("master") ||
    spotId.includes("panorama") ||
    spotId.includes("vista") ||
    spotId.includes("lake") ||
    spotId.includes("1214") ||
    spotId.includes("1215") ||
    spotId.includes("1101") ||
    spotId.includes("1102");

  const basePerAdultDouble = isPremium ? rates.premium : rates.standard;
  const isSolo = cabinInput.adultsCount === 1 && cabinInput.childrenCount === 0;
  const soloSurcharge = isSolo ? rates.singleSupplement : 0;

  // Determine vessel
  const isGreenHorizon = spotId.startsWith("gh-");
  const vesselId = isGreenHorizon ? "green-horizon" : "summer-cruise";
  const vesselName = isGreenHorizon ? "Green Horizon" : "Summer Cruise";
  const spotName = cabinInput.spotName || `Cabin ${cabinIndex + 1}`;
  const roomCategoryName = cabinInput.roomCategoryName || (isPremium ? "Premium Panorama Room" : "Deluxe Family Room");

  // Reconcile guests array with counts and auto-classify kid categories from DOB
  const guests: GuestConfig[] = [...(cabinInput.guests || [])].map((g) => {
    // If guest is not strictly adult, determine exact category from DOB
    if (g.category !== "adult" && g.dob) {
      const derivedCategory = determineAgeCategoryFromDob(g.dob, departureDate);
      return { ...g, category: derivedCategory };
    }
    return g;
  });
  
  // Ensure we have enough guest entries for adults
  let currentAdults = guests.filter((g) => g.category === "adult").length;
  while (currentAdults < cabinInput.adultsCount) {
    guests.push({
      id: `c${cabinIndex}-a${currentAdults + 1}`,
      category: "adult",
      name: `Adult ${currentAdults + 1}`,
      country: "Malaysia",
      isMalaysian: true,
    });
    currentAdults++;
  }

  // Ensure children entries
  let currentChildren = guests.filter((g) => g.category === "child").length;
  while (currentChildren < cabinInput.childrenCount) {
    guests.push({
      id: `c${cabinIndex}-ch${currentChildren + 1}`,
      category: "child",
      name: `Child ${currentChildren + 1}`,
      country: "Malaysia",
      isMalaysian: true,
      dob: { day: "15", month: "06", year: "2017" },
    });
    currentChildren++;
  }

  // Ensure toddler entries
  let currentToddlers = guests.filter((g) => g.category === "toddler").length;
  while (currentToddlers < cabinInput.toddlersCount) {
    guests.push({
      id: `c${cabinIndex}-to${currentToddlers + 1}`,
      category: "toddler",
      name: `Toddler ${currentToddlers + 1}`,
      country: "Malaysia",
      isMalaysian: true,
      dob: { day: "10", month: "03", year: "2023" },
    });
    currentToddlers++;
  }

  // Ensure infant entries
  let currentInfants = guests.filter((g) => g.category === "infant").length;
  while (currentInfants < cabinInput.infantsCount) {
    guests.push({
      id: `c${cabinIndex}-inf${currentInfants + 1}`,
      category: "infant",
      name: `Infant ${currentInfants + 1}`,
      country: "Malaysia",
      isMalaysian: true,
      dob: { day: "01", month: "01", year: "2026" },
    });
    currentInfants++;
  }

  // Check if any guest in this cabin is a foreigner
  const hasForeigner = guests.some((g) => !g.isMalaysian);

  // Tourism tax applies per room per night if ANY foreigner is staying in this cabin
  const tourismTaxTotal = hasForeigner
    ? DEFAULT_PRICING_CONFIG.tourismTaxPerNightPerForeignRoomMYR * durationNights
    : 0;

  let packageFareSubtotal = 0;
  let attractionTicketsSubtotal = 0;
  let jettyFeesSubtotal = 0;
  let insuranceSubtotal = 0;

  const itemizedGuests: ItemizedGuestFare[] = guests.map((g, gIdx) => {
    let pkgFare = 0;
    if (g.category === "adult") {
      pkgFare = basePerAdultDouble;
      if (isSolo) pkgFare += soloSurcharge;
    } else if (g.category === "child") {
      pkgFare = rates.childRate;
    } else if (g.category === "toddler") {
      pkgFare = rates.toddlerRate;
    } else if (g.category === "infant") {
      pkgFare = rates.infantRate;
    }

    // Pass-through attraction ticket
    let ticketFee = 0;
    if (g.category === "adult" || g.category === "child") {
      ticketFee = g.isMalaysian
        ? DEFAULT_PRICING_CONFIG.attractionTicketMalaysianMYR
        : DEFAULT_PRICING_CONFIG.attractionTicketForeignerMYR;
    }

    // Jetty and insurance fees
    const jettyFee = g.category !== "infant" ? DEFAULT_PRICING_CONFIG.gawiJettyFeePerPaxMYR : 0;
    const insurance = g.category !== "infant" ? DEFAULT_PRICING_CONFIG.insurancePerPaxMYR : 0;

    packageFareSubtotal += pkgFare;
    attractionTicketsSubtotal += ticketFee;
    jettyFeesSubtotal += jettyFee;
    insuranceSubtotal += insurance;

    return {
      guestIndex: gIdx + 1,
      name: g.name || `${g.category.toUpperCase()} ${gIdx + 1}`,
      category: g.category,
      isMalaysian: g.isMalaysian,
      packageFare: pkgFare,
      attractionTicket: ticketFee,
      jettyFee,
      insurance,
      guestTotal: pkgFare + ticketFee + jettyFee + insurance,
    };
  });

  const cabinGrossTotal =
    packageFareSubtotal +
    attractionTicketsSubtotal +
    jettyFeesSubtotal +
    insuranceSubtotal +
    tourismTaxTotal;

  return {
    cabinId: cabinInput.cabinId,
    cabinIndex,
    spotId: cabinInput.spotId,
    spotName,
    planLabel: cabinInput.spotId ? cabinInput.spotId.split("-").slice(-1)[0] : undefined,
    roomCategoryName,
    vesselName,
    vesselId,
    adultsCount: cabinInput.adultsCount,
    childrenCount: cabinInput.childrenCount,
    toddlersCount: cabinInput.toddlersCount,
    infantsCount: cabinInput.infantsCount,
    totalPax: cabinInput.adultsCount + cabinInput.childrenCount + cabinInput.toddlersCount + cabinInput.infantsCount,
    baseRatePerAdult: basePerAdultDouble,
    soloSurcharge,
    isSoloOccupancy: isSolo,
    packageFareSubtotal,
    attractionTicketsSubtotal,
    jettyFeesSubtotal,
    insuranceSubtotal,
    hasForeigner,
    tourismTaxPerNight: hasForeigner ? DEFAULT_PRICING_CONFIG.tourismTaxPerNightPerForeignRoomMYR : 0,
    tourismTaxTotal,
    cabinGrossTotal,
    itemizedGuests,
  };
}

/**
 * Multi-Cabin Aggregator with Travel Agency Commission calculated strictly on Package Fares
 */
export function quoteMultiCabinBooking(
  packageSlug: string,
  departureDateIso: string,
  cabins: CabinBookingInput[],
  agencyCommissionPercent: number = DEFAULT_PRICING_CONFIG.defaultAgencyCommissionPercent
): MultiCabinQuoteSummary {
  const is4D3N = packageSlug ? packageSlug.includes("4d3n") : false;
  const durationNights = is4D3N ? 3 : 2;
  const packageTitle = is4D3N ? "4D3N Kenyir Grand Voyage" : "3D2N Kenyir Explorer";
  const depDate = new Date(departureDateIso || "2026-11-06");

  const cabinQuotes = cabins.map((c, i) =>
    calculateCabinQuote(c, i, durationNights, is4D3N, agencyCommissionPercent, depDate)
  );

  let totalAdults = 0;
  let totalChildren = 0;
  let totalToddlers = 0;
  let totalInfants = 0;
  let grossPackageFaresTotal = 0;
  let totalAttractionTicketsMYR = 0;
  let totalJettyFeesMYR = 0;
  let totalInsuranceMYR = 0;
  let totalTourismTaxMYR = 0;
  let subtotalGrossMYR = 0;

  cabinQuotes.forEach((cq) => {
    totalAdults += cq.adultsCount;
    totalChildren += cq.childrenCount;
    totalToddlers += cq.toddlersCount;
    totalInfants += cq.infantsCount;
    grossPackageFaresTotal += cq.packageFareSubtotal;
    totalAttractionTicketsMYR += cq.attractionTicketsSubtotal;
    totalJettyFeesMYR += cq.jettyFeesSubtotal;
    totalInsuranceMYR += cq.insuranceSubtotal;
    totalTourismTaxMYR += cq.tourismTaxTotal;
    subtotalGrossMYR += cq.cabinGrossTotal;
  });

  const totalPassThroughFeesMYR =
    totalAttractionTicketsMYR + totalJettyFeesMYR + totalInsuranceMYR;

  // IMPORTANT: Agency Commission is calculated STRICTLY from the Package Fare!
  const agencyCommissionDiscountMYR = Math.round(
    grossPackageFaresTotal * (agencyCommissionPercent / 100)
  );
  const netPackageFaresMYR = grossPackageFaresTotal - agencyCommissionDiscountMYR;

  // Grand Total Net Payable
  const grandTotalNetMYR = netPackageFaresMYR + totalPassThroughFeesMYR + totalTourismTaxMYR;
  const depositRequiredMYR = Math.round(grandTotalNetMYR * (DEFAULT_PRICING_CONFIG.depositPercentage / 100));
  const balanceDueMYR = grandTotalNetMYR - depositRequiredMYR;

  const averageRatePerAdultMYR = totalAdults > 0 ? Math.round(grandTotalNetMYR / totalAdults) : grandTotalNetMYR;

  return {
    packageSlug,
    packageTitle,
    durationNights,
    departureDateIso,
    totalCabins: cabins.length,
    totalAdults,
    totalChildren,
    totalToddlers,
    totalInfants,
    totalPax: totalAdults + totalChildren + totalToddlers + totalInfants,
    cabins: cabinQuotes,
    grossPackageFaresTotal,
    agencyCommissionRatePercent: agencyCommissionPercent,
    agencyCommissionDiscountMYR,
    netPackageFaresMYR,
    totalAttractionTicketsMYR,
    totalJettyFeesMYR,
    totalInsuranceMYR,
    totalPassThroughFeesMYR,
    totalTourismTaxMYR,
    subtotalGrossMYR,
    grandTotalNetMYR,
    depositRequiredMYR,
    balanceDueMYR,
    averageRatePerAdultMYR,
    currency: "MYR",
  };
}
