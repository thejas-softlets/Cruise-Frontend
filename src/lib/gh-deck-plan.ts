import type { DeckFloor, DeckCabinSpot } from "./vessel-deck-plan";

/**
 * Green Horizon — interactive deck-plan booking data.
 *
 * Hotspot rectangles are % coordinates aligned to the cropped deck diagrams in
 * /images/deck/gh-deck-{ground,first,second}.webp (source: "2026 Green Horizon
 * Cruise Structure" sheets, cross-checked against the Charter Package PDF's
 * own "Cruise Deck Plan" page). The EN and CN sheets render every room label
 * bilingually already (e.g. "Balcony 阳台"), so one set of diagrams serves
 * both languages — there's no separate artwork to switch between.
 *
 * Room categories match the Charter Package brochure's "Accommodation
 * Options" page exactly: Premium Panorama / Lake View / Vista (2 rooms each)
 * and Deluxe Family (9 rooms) — 15 rooms total, all quad-sharing.
 *
 * Plan orientation: BOW = LEFT. The rounded hull nose and the Captain's Cabin
 * sit at the far left of the 1st floor plan; the flat stern with the crew
 * back-deck sits at the far right of the ground floor plan. Coordinates were
 * re-derived by pixel-measuring the wall lines and visually confirming every
 * room number directly on the source diagrams.
 */
export const GH_FLOORS: DeckFloor[] = [
  {
    id: "ground",
    name: "Ground Floor",
    level: "Level 1 · Waterline",
    tagline: "Dining Saloon & Service Core",
    desc: "The air-conditioned dining room and full galley sit at the waterline, ringed by the crew's service rooms — battery, water filter, and staff quarters aft.",
    image: "/images/deck/gh-deck-ground.webp",
    hasCabins: false,
  },
  {
    id: "first",
    name: "1st Floor",
    level: "Level 2 · Accommodation",
    tagline: "12 Staterooms & Captain's Bridge",
    desc: "Twelve guest staterooms — each with its own private balcony — run bow to stern on both sides of the central gangway, with the captain's cabin at the very bow.",
    image: "/images/deck/gh-deck-first.webp",
    hasCabins: true,
  },
  {
    id: "second",
    name: "2nd Floor",
    level: "Level 3 · Panorama",
    tagline: "3 Suites, Roof Deck & Karaoke Lounge",
    desc: "Three more staterooms with wraparound glass, opening onto the open-air roof deck, multipurpose hall, karaoke room and mini bar at the stern.",
    image: "/images/deck/gh-deck-second.webp",
    hasCabins: true,
  },
];

export const GH_CABIN_SPOTS: DeckCabinSpot[] = [
  // -- GROUND FLOOR - no bookable cabins, facility context only --
  { id: "gh-g-front-deck", floor: "ground", planLabel: "Front Deck", name: "Front Deck Lounge", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 0.2, y: 15, w: 7, h: 82 } },
  { id: "gh-g-dining", floor: "ground", planLabel: "Dining Area", name: "Main Dining Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 60, areaSqm: 90, basePriceMYR: 0, rect: { x: 16, y: 20, w: 29, h: 78 } },
  { id: "gh-g-kitchen", floor: "ground", planLabel: "Kitchen", name: "Kitchen", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 56, y: 20, w: 11, h: 50 } },
  { id: "gh-g-utility", floor: "ground", planLabel: "Battery / Hand Wash / Toilet", name: "Utility & Wash Area", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 45, y: 65, w: 11, h: 33 } },
  { id: "gh-g-water-filter", floor: "ground", planLabel: "Water Filter Area", name: "Water Filter Area", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 56, y: 70, w: 11, h: 28 } },
  { id: "gh-g-staff", floor: "ground", planLabel: "M&E / Engine / Staff Rooms", name: "Crew & Service Quarters", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 67, y: 20, w: 21, h: 78 } },
  { id: "gh-g-back-deck", floor: "ground", planLabel: "Back Deck", name: "Back Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 88, y: 2, w: 11, h: 96 } },
  { id: "gh-g-lift", floor: "ground", planLabel: "Lift", name: "Lift", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 41, y: 32, w: 8, h: 22 } },
  { id: "gh-g-stairs", floor: "ground", planLabel: "Staircase", name: "Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 49, y: 26, w: 6, h: 43 } },

  // -- 1ST FLOOR - 12 staterooms (bookable). Port row 1201/1203/...,
  // starboard row 1202/1204/... The lift/stairs core only intrudes on the
  // 1201/1203 side, so 1204's cell runs wider than its mirror on the top row.
  // 1201/1202 (best forward view) = Premium Lake View; 1211/1212 (aft) =
  // Premium Vista; the rest = Deluxe Family, per the brochure's room mix. --
  { id: "gh-1-1201", floor: "first", planLabel: "1201", name: "Premium Lake View 1201", roomCategoryId: "gh-lake-view", kind: "cabin", status: "available", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 1500, rect: { x: 0.2, y: 0.5, w: 16.8, h: 42.4 } },
  { id: "gh-1-1202", floor: "first", planLabel: "1202", name: "Premium Lake View 1202", roomCategoryId: "gh-lake-view", kind: "cabin", status: "available", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 1500, rect: { x: 0.2, y: 57.1, w: 16.8, h: 42 } },
  { id: "gh-1-1203", floor: "first", planLabel: "1203", name: "Deluxe Family 1203", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 30.8, y: 0.5, w: 13.1, h: 42.4 } },
  { id: "gh-1-1204", floor: "first", planLabel: "1204", name: "Deluxe Family 1204", roomCategoryId: "gh-family", kind: "cabin", status: "unavailable", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 17.4, y: 57.1, w: 16.7, h: 42 } },
  { id: "gh-1-1205", floor: "first", planLabel: "1205", name: "Deluxe Family 1205", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 44.3, y: 0.5, w: 13, h: 42.4 } },
  { id: "gh-1-1206", floor: "first", planLabel: "1206", name: "Deluxe Family 1206", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 34.3, y: 57.1, w: 9.9, h: 42 } },
  { id: "gh-1-1207", floor: "first", planLabel: "1207", name: "Deluxe Family 1207", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 57.7, y: 0.5, w: 13.1, h: 42.4 } },
  { id: "gh-1-1208", floor: "first", planLabel: "1208", name: "Deluxe Family 1208", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 44.4, y: 57.1, w: 13.4, h: 42 } },
  { id: "gh-1-1209", floor: "first", planLabel: "1209", name: "Deluxe Family 1209", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 71.1, y: 0.5, w: 13.1, h: 42.4 } },
  { id: "gh-1-1210", floor: "first", planLabel: "1210", name: "Deluxe Family 1210", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 17, basePriceMYR: 1250, rect: { x: 58, y: 57.1, w: 13.4, h: 42 } },
  { id: "gh-1-1211", floor: "first", planLabel: "1211", name: "Premium Vista 1211", roomCategoryId: "gh-vista", kind: "cabin", status: "unavailable", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 1550, rect: { x: 84.6, y: 0.5, w: 15.2, h: 42.4 } },
  { id: "gh-1-1212", floor: "first", planLabel: "1212", name: "Premium Vista 1212", roomCategoryId: "gh-vista", kind: "cabin", status: "available", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 18, basePriceMYR: 1550, rect: { x: 86.8, y: 57.1, w: 12.9, h: 42 } },
  { id: "gh-1-captain", floor: "first", planLabel: "Captain Room", name: "Captain's Cabin", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 0.2, y: 21.8, w: 6.9, h: 57.1 } },
  { id: "gh-1-lift-stairs", floor: "first", planLabel: "Lift / Staircase", name: "Lift & Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 17.2, y: 0.5, w: 13.4, h: 42.4 } },
  { id: "gh-1-store", floor: "first", planLabel: "Store Room", name: "Store Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 71.5, y: 57.1, w: 7.2, h: 42 } },
  { id: "gh-1-stairs-aft", floor: "first", planLabel: "Staircase", name: "Aft Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 78.9, y: 57.1, w: 7.8, h: 42 } },

  // -- 2ND FLOOR - 3 staterooms (bookable): 1214/1215 are the signature
  // Premium Panorama suites beside the roof deck; 1213 completes the
  // Deluxe Family count (9 total across the ship). --
  { id: "gh-2-1213", floor: "second", planLabel: "1213", name: "Deluxe Family 1213", roomCategoryId: "gh-family", kind: "cabin", status: "available", bedType: "King Bed + 2 Single Beds", maxOccupancy: 4, areaSqm: 20, basePriceMYR: 1250, rect: { x: 67.5, y: 0.8, w: 17.7, h: 74.7 } },
  { id: "gh-2-1215", floor: "second", planLabel: "1215", name: "Premium Panorama 1215", roomCategoryId: "gh-panorama", kind: "cabin", status: "available", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 26, basePriceMYR: 1900, rect: { x: 85.3, y: 0.8, w: 14.5, h: 53.7 } },
  { id: "gh-2-1214", floor: "second", planLabel: "1214", name: "Premium Panorama 1214", roomCategoryId: "gh-panorama", kind: "cabin", status: "available", bedType: "King Bed + Sofa Bed", maxOccupancy: 4, areaSqm: 24, basePriceMYR: 1900, rect: { x: 85.3, y: 55.4, w: 14.5, h: 43.8 } },
  { id: "gh-2-roof-deck", floor: "second", planLabel: "Roof Deck", name: "Open Roof Deck", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 0.2, y: 0.8, w: 31.4, h: 98.3 } },
  { id: "gh-2-karaoke", floor: "second", planLabel: "Karaoke Room", name: "Karaoke Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 32, y: 50.3, w: 11.7, h: 48.8 } },
  { id: "gh-2-minibar", floor: "second", planLabel: "Mini Bar", name: "Mini Bar", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 43.8, y: 50.3, w: 12.6, h: 48.8 } },
  { id: "gh-2-lift", floor: "second", planLabel: "Lift", name: "Lift", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 36.6, y: 26.8, w: 8.1, h: 22.7 } },
  { id: "gh-2-stairs", floor: "second", planLabel: "Staircase", name: "Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 45, y: 21.8, w: 9.6, h: 52 } },
  { id: "gh-2-hall", floor: "second", planLabel: "Multipurpose Hall", name: "Multipurpose Hall", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 56.6, y: 0.8, w: 10.4, h: 98.3 } },
  { id: "gh-2-store", floor: "second", planLabel: "Store Room", name: "Store Room", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 67.5, y: 76.3, w: 8.9, h: 22.8 } },
  { id: "gh-2-stairs-aft", floor: "second", planLabel: "Staircase", name: "Aft Staircase", kind: "facility", status: "available", bedType: "—", maxOccupancy: 0, areaSqm: 0, basePriceMYR: 0, rect: { x: 76.4, y: 58.7, w: 8.8, h: 40.4 } },
];
