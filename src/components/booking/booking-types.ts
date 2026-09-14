/**
 * Lake Kenyir Cruise Booking - Shared Types & Operational Constants
 *
 * Sourced from authentic Kenyir Lake cruise operations (Summer Bay Travels & Tours /
 * Summer Cruise & Green Horizon) and official Performa Invoice dossier (#SCA26-03-0037).
 *
 * Core Business Rules:
 * 1. Fleet Unified as One Big Pool:
 *    - Summer Cruise (12 Lakeview staterooms, max 34 guests)
 *    - Green Horizon (15 staterooms / 12 balcony suites, max 60 guests)
 *    - Guests choose the package (3D2N Kenyir Explorer vs 4D3N Kenyir Grand Voyage)
 *      and can pick staterooms across either vessel.
 * 2. Multi-Cabin Selection:
 *    - Allows 1 to 5+ cabins in a single booking session.
 *    - Each cabin has independent adult and child guest counts (e.g. Cabin 1: 2 adults + 1 child,
 *      Cabin 2: 2 adults + 1 child + 1 toddler).
 * 3. Guest Attributes & Pass-Through Fees:
 *    - Adult Country of Residence: Determines Attraction Ticket rates:
 *      Malaysian domestic (RM 40) vs Foreigner (RM 70).
 *    - Cabin Tourism Tax (TTx - Act 791): RM 10/room/night if ANY occupant in the room is foreign.
 *      Exempt (RM 0) if all occupants are Malaysian citizens / PR holders.
 *    - Child Date of Birth (DOB): Processed via backend pricing logic:
 *      - < 2 years (0-23 mos): Infant (FOC complimentary)
 *      - 2-3 years (24-47 mos): Toddler (nominal amenities charge RM 250 / RM 350)
 *      - 4-11 years (48-143 mos): Child (50% package fare with bed)
 *      - 12+ years: Adult (standard adult fare)
 * 4. Travel Agency Commission:
 *    - Calculated strictly as a percentage of the Package Fare subtotal.
 *    - Pass-through fees (attraction tickets, jetty fees, marine insurance, tourism tax)
 *      are non-commissionable.
 */

import type { MultiCabinQuoteSummary, CabinPricingQuote } from "@/lib/booking-pricing";

export type BookingMode = "cabin" | "charter";
export type VesselId = "summer-cruise" | "green-horizon";

export interface ChildDob {
  month: string;
  day: string;
  year: string;
}

export interface CabinSlot {
  id: string; // e.g. "cabin-1"
  adults: number;
  children: number;
  childBirthDates: ChildDob[];
  selectedSpotId: string | null;
  isOpen: boolean;
}

export interface GuestField {
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

export const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const COUNTRIES_LIST = [
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
  { code: "+91", name: "India" },
  { code: "+64", name: "New Zealand" },
  { code: "+852", name: "Hong Kong" },
  { code: "+886", name: "Taiwan" },
  { code: "+971", name: "United Arab Emirates" },
] as const;

export const ADULT_YEARS = Array.from({ length: 80 }, (_, i) => `${2012 - i}`);
export const CHILD_YEARS = Array.from({ length: 14 }, (_, i) => `${2026 - i}`);
export const DAYS_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

export const SC_SPOTS = [
  "sc-1-1101", "sc-1-1105", "sc-1-1107", "sc-1-1103",
  "sc-1-1111", "sc-1-1109", "sc-1-1102", "sc-1-1106",
  "sc-1-1108", "sc-1-1112", "sc-1-1110",
];

export const GH_SPOTS = [
  "gh-1-1201", "gh-1-1205", "gh-1-1207", "gh-1-1209",
  "gh-2-1214", "gh-2-1215", "gh-1-1211", "gh-1-1202",
  "gh-1-1206", "gh-1-1208", "gh-1-1210", "gh-1-1212",
];

export type QuoteData = MultiCabinQuoteSummary;
export type QuoteCabinItem = CabinPricingQuote;
