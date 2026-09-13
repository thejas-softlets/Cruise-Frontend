import type { DeckFloor, DeckCabinSpot } from "./vessel-deck-plan";

/**
 * Summer Cruise — interactive deck-plan booking data.
 *
 * Hotspot rectangles are % coordinates aligned to the real deck diagrams in
 * /images/deck/{Ground-floor,1st-floor-scaled,2nd-floor-scaled}.webp.
 * Coordinates were measured the same way as Green Horizon's: full-height
 * wall lines were located by scanning for columns of near-black pixels, then
 * every room number (1101-1112) was confirmed visually against those wall
 * positions.
 *
 * Plan orientation: BOW = RIGHT (opposite of Green Horizon). The Captain's
 * Cabin and the rounded hull nose sit at the far right of the 1st floor plan.
 *
 * Only the 1st floor has bookable staterooms — Ground Floor is the dining
 * saloon/galley/crew quarters and the 2nd Floor is the karaoke/multipurpose
 * entertainment deck, so both are facility-only.
 */
export const SC_FLOORS: DeckFloor[] = [
  {
    id: "ground",
    name: "Ground Floor",
    level: "Level 1 · Waterline",
    tagline: "Dining Saloon & Galley",
    desc: "The dining area and full galley sit at the waterline, with crew quarters, the switch room and store aft.",
    image: "/images/deck/Ground-floor.webp",
    hasCabins: false,
  },
  {
    id: "first",
    name: "1st Floor",
    level: "Level 2 · Accommodation",
    tagline: "12 Staterooms & Captain's Bridge",
    desc: "Twelve staterooms run bow to stern on both sides of the central gangway, with the captain's cabin at the very bow.",
    image: "/images/deck/1st-floor-scaled.webp",
    hasCabins: true,
  },
  {
    id: "second",
    name: "2nd Floor",
    level: "Level 3 · Entertainment",
    tagline: "Multipurpose Hall, Karaoke & Front Deck",
    desc: "An open multipurpose hall, two karaoke rooms and a control room, with open-air seating fore and aft.",
    image: "/images/deck/2nd-floor-scaled.webp",
    hasCabins: false,
  },
];

export const SC_CABIN_SPOTS: DeckCabinSpot[] = [
  // -- 1ST FLOOR - 12 staterooms (bookable). Port row 1101/1103/...,
  // starboard row 1102/1104/... 1101/1102 (aft-most, largest) = Master
  // Suite; 1111/1112 (forward-most, by the lift) = Family Room; the rest =
  // Deluxe Double. --
  { id: "sc-1-1101", floor: "first", planLabel: "1101", name: "Master Suite 1101", roomCategoryId: "sc-master", kind: "cabin", status: "available", bedType: "King Bed", maxOccupancy: 2, areaSqm: 22, basePriceMYR: 900, rect: { x: 76.8, y: 0.3, w: 18.8, h: 51.9 } },
  { id: "sc-1-1102", floor: "first", planLabel: "1102", name: "Master Suite 1102", roomCategoryId: "sc-master", kind: "cabin", status: "available", bedType: "King Bed", maxOccupancy: 2, areaSqm: 22, basePriceMYR: 900, rect: { x: 76.8, y: 64.2, w: 18.8, h: 35.4 } },
  { id: "sc-1-1103", floor: "first", planLabel: "1103", name: "Deluxe Double 1103", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 56.6, y: 0.3, w: 12.3, h: 51.9 } },
  { id: "sc-1-1104", floor: "first", planLabel: "1104", name: "Deluxe Double 1104", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "unavailable", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 56.6, y: 64.2, w: 12.3, h: 35.4 } },
  { id: "sc-1-1105", floor: "first", planLabel: "1105", name: "Deluxe Double 1105", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 44.1, y: 0.3, w: 12.2, h: 51.9 } },
  { id: "sc-1-1106", floor: "first", planLabel: "1106", name: "Deluxe Double 1106", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 44.1, y: 64.2, w: 12.2, h: 35.4 } },
  { id: "sc-1-1107", floor: "first", planLabel: "1107", name: "Deluxe Double 1107", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 31.6, y: 0.3, w: 12.3, h: 51.9 } },
  { id: "sc-1-1108", floor: "first", planLabel: "1108", name: "Deluxe Double 1108", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 31.1, y: 64.2, w: 12.8, h: 35.4 } },
  { id: "sc-1-1109", floor: "first", planLabel: "1109", name: "Deluxe Double 1109", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 16, basePriceMYR: 750, rect: { x: 19.2, y: 0.3, w: 12.2, h: 51.9 } },
  { id: "sc-1-1110", floor: "first", planLabel: "1110", name: "Deluxe Double 1110", roomCategoryId: "sc-deluxe-double", kind: "cabin", status: "available", bedType: "Queen Bed", maxOccupancy: 2, areaSqm: 14, basePriceMYR: 750, rect: { x: 22.1, y: 64.2, w: 8.8, h: 35.4 } },
  { id: "sc-1-1111", floor: "first", planLabel: "1111", name: "Family Room 1111", roomCategoryId: "sc-family", kind: "cabin", status: "available", bedType: "Queen + 2 Bunks", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 850, rect: { x: 0.1, y: 0.3, w: 11.1, h: 51.9 } },
  { id: "sc-1-1112", floor: "first", planLabel: "1112", name: "Family Room 1112", roomCategoryId: "sc-family", kind: "cabin", status: "available", bedType: "Queen + 2 Bunks", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 850, rect: { x: 0.1, y: 64.2, w: 11.1, h: 35.4 } },
  { id: "sc-1-captain", floor: "first", planLabel: "Captain Room", name: "Captain's Cabin", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 95.8, y: 15, w: 4, h: 70.1 } },
  { id: "sc-1-stairs", floor: "first", planLabel: "Staircase", name: "Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 11.4, y: 0.3, w: 7.6, h: 51.9 } },
  { id: "sc-1-lift", floor: "first", planLabel: "Lift", name: "Lift", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 11.4, y: 64.2, w: 10.6, h: 35.4 } },
  { id: "sc-1-utility", floor: "first", planLabel: "Utility Room", name: "Utility Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 69, y: 0.3, w: 7.5, h: 51.9 } },
  { id: "sc-1-stairs-aft", floor: "first", planLabel: "Staircase", name: "Aft Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 69, y: 64.2, w: 7.5, h: 35.4 } },

  // -- GROUND FLOOR - facility only --
  { id: "sc-g-dining", floor: "ground", planLabel: "Dining Area", name: "Dining Area", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 33, y: 12, w: 22, h: 76 } },
  { id: "sc-g-kitchen", floor: "ground", planLabel: "Kitchen", name: "Kitchen", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 14, y: 25, w: 13, h: 62 } },
  { id: "sc-g-staff", floor: "ground", planLabel: "Staff Rooms", name: "Staff Rooms", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 27, y: 40, w: 7, h: 50 } },
  { id: "sc-g-rear-deck", floor: "ground", planLabel: "Rear Deck", name: "Rear Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 1, y: 15, w: 6, h: 78 } },
  { id: "sc-g-front-deck", floor: "ground", planLabel: "Front Deck", name: "Front Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 90, y: 15, w: 8, h: 78 } },
  { id: "sc-g-lift", floor: "ground", planLabel: "Lift", name: "Lift", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 15, y: 78, w: 8, h: 15 } },

  // -- 2ND FLOOR - facility only --
  { id: "sc-2-hall", floor: "second", planLabel: "Multipurpose Hall", name: "Multipurpose Hall", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 22, y: 22, w: 32, h: 66 } },
  { id: "sc-2-karaoke1", floor: "second", planLabel: "Karaoke 1", name: "Karaoke Room 1", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 55, y: 22, w: 10, h: 32 } },
  { id: "sc-2-karaoke2", floor: "second", planLabel: "Karaoke 2", name: "Karaoke Room 2", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 55, y: 56, w: 10, h: 32 } },
  { id: "sc-2-control", floor: "second", planLabel: "Control Room", name: "Control Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 1, y: 12, w: 10, h: 30 } },
  { id: "sc-2-open-area", floor: "second", planLabel: "Open Area", name: "Open Area", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 1, y: 45, w: 10, h: 50 } },
  { id: "sc-2-front-deck", floor: "second", planLabel: "Front Deck / Open Area", name: "Front Deck Seating", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 78, y: 12, w: 20, h: 82 } },
];
