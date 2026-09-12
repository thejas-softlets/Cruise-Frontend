/**
 * Green Horizon — interactive deck-plan booking data.
 *
 * Hotspot rectangles are % coordinates aligned to the cropped deck diagrams in
 * /images/deck/gh-deck-{ground,first,second}{,-cn}.webp (from
 * media/GreenHorizonPhotos/Cruise Structure 游轮结构/2026_GreenHorizonCruiseStructure_{EN,CN}.jpg).
 * EN and CN sheets share the same template, so one set of rects fits both.
 *
 * Plan orientation: BOW = right (captain's room sits at x≈87 on 1st Floor).
 * Sheet labels sit below each plan: band 1 = Ground Floor, band 2 = 1st Floor,
 * band 3 = 2nd Floor (verified by OCR).
 */
export type GhFloorId = "ground" | "first" | "second";

export interface GhCabinSpot {
  /** Stable id used for selection state */
  id: string;
  /** Floor this spot lives on */
  floor: GhFloorId;
  /** Label printed on the diagram (EN) */
  planLabel: string;
  /** Human name shown in the picker */
  name: string;
  /** Links into room categories (rooms.ts) for photo/amenities */
  roomCategoryId?: "gh-panorama" | "gh-twin" | "gh-family";
  bedType: string;
  maxOccupancy: number;
  areaSqm: number;
  basePriceMYR: number;
  /** "cabin" = bookable, "facility" = context highlight only */
  kind: "cabin" | "facility";
  status: "available" | "unavailable";
  /** % rect on the floor diagram: left/top/width/height */
  rect: { x: number; y: number; w: number; h: number };
}

export interface GhFloor {
  id: GhFloorId;
  name: string;
  level: string;
  tagline: string;
  desc: string;
  imageEn: string;
  imageCn: string;
}

export const GH_FLOORS: GhFloor[] = [
  {
    id: "ground",
    name: "Ground Floor",
    level: "Level 1 · Waterline",
    tagline: "Dining Saloon & Service Core",
    desc: "The air-conditioned dining room and full galley sit at the waterline, ringed by the crew's service rooms — battery, water filter, hand wash and staff quarters.",
    imageEn: "/images/deck/gh-deck-ground.webp",
    imageCn: "/images/deck/gh-deck-ground-cn.webp",
  },
  {
    id: "first",
    name: "1st Floor",
    level: "Level 2 · Accommodation",
    tagline: "Balcony Staterooms & Captain's Bridge",
    desc: "Five guest staterooms — each with its own private balcony — plus the captain's cabin at the bow.",
    imageEn: "/images/deck/gh-deck-first.webp",
    imageCn: "/images/deck/gh-deck-first-cn.webp",
  },
  {
    id: "second",
    name: "2nd Floor",
    level: "Level 3 · Panorama",
    tagline: "Panorama Suite & Roof Deck",
    desc: "The signature panorama suite with wraparound glass, opening onto the open-air roof deck with loungers at the stern.",
    imageEn: "/images/deck/gh-deck-second.webp",
    imageCn: "/images/deck/gh-deck-second-cn.webp",
  },
];

/**
 * Hotspot rects derived from connected-component detection on the plan's
 * colored room regions (scripts/components-gh-rooms.cjs) + OCR'd labels.
 */
export const GH_CABIN_SPOTS: GhCabinSpot[] = [
  // ── GROUND FLOOR — service core (facility context, not bookable) ──
  // OCR-verified labels: Dining Room, Kitchen, Hand Wash Area, Staff Room,
  // Battery Room, Water Filter Area + a 12-room crew/service grid (port side).
  { id: "gh-g-dining", floor: "ground", planLabel: "Dining Room", name: "Main Dining Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 60, areaSqm: 90, basePriceMYR: 0, rect: { x: 72.6, y: 24.5, w: 7.3, h: 37 } },
  { id: "gh-g-kitchen", floor: "ground", planLabel: "Kitchen", name: "Kitchen", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 84, y: 40, w: 8, h: 32 } },
  { id: "gh-g-service", floor: "ground", planLabel: "Service Rooms", name: "Crew & Service Quarters", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 11, y: 15.5, w: 40.5, h: 66 } },

  // ── 1ST FLOOR — five balcony staterooms (bookable) + captain (facility) ──
  { id: "gh-1-balcony-1", floor: "first", planLabel: "Balcony · 101", name: "Balcony Stateroom 101", roomCategoryId: "gh-twin", kind: "cabin", status: "available", bedType: "2 Single Beds", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 1150, rect: { x: 13.2, y: 54.7, w: 5, h: 15 } },
  { id: "gh-1-balcony-2", floor: "first", planLabel: "Balcony · 102", name: "Balcony Stateroom 102", roomCategoryId: "gh-twin", kind: "cabin", status: "available", bedType: "2 Single Beds", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 1150, rect: { x: 26.6, y: 54.7, w: 5, h: 15 } },
  { id: "gh-1-balcony-3", floor: "first", planLabel: "Balcony · 103", name: "Balcony Stateroom 103", roomCategoryId: "gh-family", kind: "cabin", status: "unavailable", bedType: "Double + Bunks", maxOccupancy: 4, areaSqm: 19, basePriceMYR: 1450, rect: { x: 40, y: 54.7, w: 5, h: 15 } },
  { id: "gh-1-balcony-4", floor: "first", planLabel: "Balcony · 104", name: "Balcony Stateroom 104", roomCategoryId: "gh-twin", kind: "cabin", status: "available", bedType: "2 Single Beds", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 1150, rect: { x: 53.6, y: 54.7, w: 5, h: 15 } },
  { id: "gh-1-balcony-5", floor: "first", planLabel: "Balcony · 105", name: "Balcony Stateroom 105", roomCategoryId: "gh-twin", kind: "cabin", status: "available", bedType: "2 Single Beds", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 1150, rect: { x: 67, y: 54.7, w: 5, h: 15 } },
  { id: "gh-1-captain", floor: "first", planLabel: "Captain Room", name: "Captain's Cabin", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 86.3, y: 48.5, w: 6.6, h: 15.2 } },
  { id: "gh-1-bow-balcony", floor: "first", planLabel: "Bow Balcony", name: "Forward Bow Balcony", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 86.3, y: 43.8, w: 6.6, h: 8 } },
  { id: "gh-1-aft", floor: "first", planLabel: "Aft Landing", name: "Aft Stair Landing", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 0.6, y: 32.5, w: 8.3, h: 36 } },
  { id: "gh-1-stairs", floor: "first", planLabel: "Staircase", name: "Central Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 70.2, y: 55, w: 10.2, h: 42 } },

  // ── 2ND FLOOR — panorama suite (bookable) + roof deck (facility) ──
  { id: "gh-2-panorama", floor: "second", planLabel: "Panorama Suite", name: "Panorama Suite", roomCategoryId: "gh-panorama", kind: "cabin", status: "available", bedType: "King Bed", maxOccupancy: 2, areaSqm: 26, basePriceMYR: 1750, rect: { x: 25.3, y: 55.5, w: 6.8, h: 34.5 } },
  { id: "gh-2-roof", floor: "second", planLabel: "Roof Deck", name: "Open Roof Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 70.8, y: 54.5, w: 10, h: 42.5 } },
  { id: "gh-2-bow", floor: "second", planLabel: "Bow Sun Deck", name: "Bow Sun Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 86.6, y: 43.5, w: 6.8, h: 20.5 } },
];
