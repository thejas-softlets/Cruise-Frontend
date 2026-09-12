/**
 * Core content types (plan §8.1).
 * Every structured content type is read through an async repository function
 * in `lib/api/*` — mock-backed now, swappable to the real backend later with
 * zero call-site changes (Phase 5).
 */

export interface MediaAsset {
  /** Real image path; null = "photo coming soon" placeholder state (plan §13/§19). */
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

export interface Vessel {
  id: string;
  name: string;
  tagline: string;
  heroImage: MediaAsset;
  gallery: MediaAsset[];
  capacity: number;
  crewCount?: number;
  roomCount: number;
  statLine: string; // the one Tier 3 summary line (§5.6)
  highlights?: string[];
  packageSlugs: string[];
}

export interface RoomCategory {
  id: string;
  vesselId: string;
  name: string;
  description: string;
  amenities: string[];
  occupancy: number;
  indicativePriceMYR: number; // `isPlaceholder` by contract (§8.3) — always shown with "Indicative"
  image: MediaAsset;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

export interface Package {
  slug: string;
  title: string;
  vesselId: string;
  durationNights: number;
  durationLabel: string;
  fromPriceMYR: number; // indicative until backend confirms (§8.3)
  heroImage: MediaAsset;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  roomCategoryIds: string[];
  experienceSlugs: string[];
  isPlaceholder: true;
}

export type ExperienceKind = "excursions" | "activities";

export interface Experience {
  slug: string;
  kind: ExperienceKind;
  title: string;
  images: MediaAsset[];
  lines: string[]; // 2–3 lines only (§5.6 Tier 4 short terminal)
  tags: string[];
  includedInPackageSlugs: string[];
}

export interface Offer {
  slug: string;
  title: string;
  shortTag: string; // "Save up to 20%" — the only line shown at Tier 2
  heroImage: MediaAsset;
  eligibility: string[];
  discountSummary: string;
  validDateRange?: { start: string; end: string };
  applicablePackageSlugs: string[];
  terms: string[];
  isPlaceholder: true; // discount amounts illustrative until backend confirms (§8.1)
}

export interface JournalArticle {
  slug: string;
  title: string;
  date: string;
  tag: string;
  coverImage: MediaAsset;
  /** MDX body paragraphs as mock data until content migration (Phase 3). */
  body: string[];
  relatedPackageSlug?: string;
}

export interface Review {
  id: string;
  guestName: string;
  guestLocation: string;
  rating: number; // 1–5
  quote: string; // guest voice, not marketing copy (§11.17)
  vesselId?: string;
  packageSlug?: string;
}

export type GalleryCategory = "vessels" | "rooms" | "lake" | "experiences" | "guests";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  media: MediaAsset;
  caption?: string;
}

export interface LakeInfo {
  overview: string;
  bestTimeToVisit: string;
  gettingThere: {
    byRoad: string;
    nearestAirport: string;
    jettyDetails: string;
  };
  heroGallery: MediaAsset[];
}

export interface GiftVoucherOption {
  id: string;
  amountMYR: number;
  isPlaceholder: true;
  description: string;
}

export type EnquirySource =
  | "package-detail"
  | "offer-detail"
  | "gift-voucher"
  | "private-charter"
  | "contact"
  | "how-it-works";

export interface EnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  adults: number;
  children: number;
  message?: string;
  source: EnquirySource;
  packageSlug?: string;
  offerSlug?: string;
  vesselId?: string;
  preferredLanguage?: "en" | "ms";
  bookingType?: "cruise" | "charter" | "voucher";
}

export interface CheckInPayload {
  bookingCode: string;
  lastName: string;
}

export interface CheckInResponse {
  status: "not-available-yet";
  message: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

export interface MapWaypoint {
  id: string;
  name: string;
  dayNumber: number;
  lat: number;
  lng: number;
  x?: number; // Percentage coordinate on map 0-100 fallback
  y?: number; // Percentage coordinate on map 0-100 fallback
  type: "embarkation" | "waterfall" | "cave" | "sanctuary" | "anchorage" | "trail" | "disembarkation";
  title: string;
  shortDesc: string;
  activities: string[];
  imageUrl?: string;
}

export interface CabinDeckSlot {
  id: string;
  roomCategoryId: string;
  cabinNumber: string;
  deck: "upper" | "main" | "lower";
  deckLabel: string;
  name: string;
  areaSqm: number;
  areaSqft: number;
  bedType: string;
  maxOccupancy: number;
  hasEnsuite: boolean;
  viewType: string;
  basePriceMYR: number;
  status: "available" | "selected" | "unavailable";
  image: MediaAsset;
  slotPosition?: {
    row: number;
    col: "port" | "starboard" | "center";
    label?: string;
  };
}

export interface CabinGuestAllocation {
  cabinSlotId: string;
  adults: number;
  children: number;
  primaryGuest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    dob?: string;
  };
}

export interface CruiseBookingPayload {
  packageSlug: string;
  vesselId: string;
  departureDate: string;
  durationLabel: string;
  allocations: CabinGuestAllocation[];
  totalPriceMYR: number;
  specialRequests?: string;
}

