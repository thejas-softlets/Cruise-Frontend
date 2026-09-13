/**
 * Shared shape for a vessel's interactive deck-plan booking data. Both
 * sc-deck-plan.ts (Summer Cruise) and gh-deck-plan.ts (Green Horizon) export
 * data in this shape so a single <VesselCabinPicker> can render either.
 */
export interface DeckCabinSpot {
  id: string;
  floor: string;
  planLabel: string;
  name: string;
  roomCategoryId?: string;
  bedType: string;
  maxOccupancy: number;
  areaSqm: number;
  basePriceMYR: number;
  kind: "cabin" | "facility";
  status: "available" | "unavailable";
  rect: { x: number; y: number; w: number; h: number };
}

export interface DeckFloor {
  id: string;
  name: string;
  level: string;
  tagline: string;
  desc: string;
  image: string;
  /** Facility-only floors (no bookable cabins) are shown elsewhere, never in the picker. */
  hasCabins: boolean;
}
