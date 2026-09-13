/**
 * Green Horizon full-boat charter pricing, sourced directly from the
 * "Green Horizon Charter Cruise Price Rate" brochure. Charter is a
 * Green Horizon-only product — Summer Cruise isn't chartered whole.
 *
 * The brochure gives two fixed anchor points per package (30 pax and 60 pax,
 * all-inclusive) and a per-pax marginal rate for guest counts in between; we
 * interpolate between the two published anchors so the number always lands
 * exactly on the brochure's own totals at 30 and 60 guests.
 */
export type CharterPackageId = "3d2n" | "4d3n";

export interface CharterTier {
  id: CharterPackageId;
  label: string;
  nights: number;
  boardTime: string;
  offTime: string;
  totalAt30: number;
  totalAt60: number;
  insurancePerPaxMYR: number;
}

export const CHARTER_TIERS: Record<CharterPackageId, CharterTier> = {
  "3d2n": {
    id: "3d2n",
    label: "3 Days 2 Nights",
    nights: 2,
    boardTime: "12:00pm on board",
    offTime: "1:00pm off board",
    totalAt30: 54525,
    totalAt60: 102750,
    insurancePerPaxMYR: 7.5,
  },
  "4d3n": {
    id: "4d3n",
    label: "4 Days 3 Nights",
    nights: 3,
    boardTime: "12:00pm on board",
    offTime: "11:00am off board",
    totalAt30: 67200,
    totalAt60: 115500,
    insurancePerPaxMYR: 10,
  },
};

export const CHARTER_ADD_ONS = {
  jettyFeePerPaxMYR: 10,
  attractionsFeeMalaysianMYR: 40,
  attractionsFeeNonMalaysianMYR: 70,
  tourismTaxPerNightRoomMYR: 10, // non-Malaysian guests only
  fuelChargePerPaxMYR: 80,
};

export const CHARTER_MIN_PAX = 30;
export const CHARTER_MAX_PAX = 60;
export const CHARTER_ROOMS_TOTAL = 15; // quad-sharing

export interface CharterQuoteInput {
  packageId: CharterPackageId;
  pax: number;
  nonMalaysianPax: number;
  wantsInsurance: boolean;
}

export interface CharterQuoteBreakdown {
  packageTotal: number;
  jettyFees: number;
  attractionsFees: number;
  tourismTax: number;
  fuelCharge: number;
  insurance: number;
  compulsoryTotal: number;
  grandTotal: number;
  roomsUsed: number;
}

/** Interpolates the brochure's own 30-pax and 60-pax package totals for any guest count in between. */
export function quotePackageTotal(packageId: CharterPackageId, pax: number): number {
  const tier = CHARTER_TIERS[packageId];
  const clamped = Math.min(Math.max(pax, CHARTER_MIN_PAX), CHARTER_MAX_PAX);
  const t = (clamped - CHARTER_MIN_PAX) / (CHARTER_MAX_PAX - CHARTER_MIN_PAX);
  return Math.round(tier.totalAt30 + t * (tier.totalAt60 - tier.totalAt30));
}

export function quoteCharter(input: CharterQuoteInput): CharterQuoteBreakdown {
  const tier = CHARTER_TIERS[input.packageId];
  const pax = Math.min(Math.max(input.pax, CHARTER_MIN_PAX), CHARTER_MAX_PAX);
  const nonMY = Math.min(Math.max(input.nonMalaysianPax, 0), pax);
  const malaysianPax = pax - nonMY;
  const roomsUsed = Math.min(Math.ceil(pax / 4), CHARTER_ROOMS_TOTAL);

  const packageTotal = quotePackageTotal(input.packageId, pax);
  const jettyFees = pax * CHARTER_ADD_ONS.jettyFeePerPaxMYR;
  const attractionsFees =
    malaysianPax * CHARTER_ADD_ONS.attractionsFeeMalaysianMYR + nonMY * CHARTER_ADD_ONS.attractionsFeeNonMalaysianMYR;
  const tourismTax = nonMY > 0 ? roomsUsed * tier.nights * CHARTER_ADD_ONS.tourismTaxPerNightRoomMYR : 0;
  const fuelCharge = pax * CHARTER_ADD_ONS.fuelChargePerPaxMYR;
  const insurance = input.wantsInsurance ? pax * tier.insurancePerPaxMYR : 0;

  const compulsoryTotal = jettyFees + attractionsFees + tourismTax + fuelCharge;
  const grandTotal = packageTotal + compulsoryTotal + insurance;

  return { packageTotal, jettyFees, attractionsFees, tourismTax, fuelCharge, insurance, compulsoryTotal, grandTotal, roomsUsed };
}
