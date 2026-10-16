import type { CabinDeckSlot, MapWaypoint } from "@/types";
import { media } from "./media";

/**
 * Authentic GPS Coordinates for Tasik Kenyir (Lake Kenyir), Terengganu, Malaysia
 * Lake Kenyir center approx: 5.0600° N, 102.8000° E
 */
export interface SeasonalRouteMeta {
  id: string;
  seasonLabel: string; // "Mar to Oct" or "Oct to Mar"
  durationLabel: string; // "3D2N" or "4D3N"
  title: string;
  seasonTag: string;
  description: string;
}

export const CRUISE_SEASON_ROUTES: SeasonalRouteMeta[] = [
  {
    id: "mar-oct-3d2n",
    seasonLabel: "Mar to Oct",
    durationLabel: "3D2N",
    title: "Mar to Oct · 3D2N",
    seasonTag: "Kelah Sanctuary Included",
    description: "Lake passage via Gawi, Saok Falls, Pulau Herba, Lasir Waterfall and Petang River Kelah Sanctuary.",
  },
  {
    id: "mar-oct-4d3n",
    seasonLabel: "Mar to Oct",
    durationLabel: "4D3N",
    title: "Mar to Oct · 4D3N",
    seasonTag: "Kelah Sanctuary & Southern Coves",
    description: "Extended expedition covering Saok, Lasir, Kelah Sanctuary, Melunak Giant Tree and Gua Bewah.",
  },
  {
    id: "oct-mar-3d2n",
    seasonLabel: "Oct to Mar",
    durationLabel: "3D2N",
    title: "Oct to Mar · 3D2N",
    seasonTag: "Elephant Conservation Village Included",
    description: "Lake passage via Gawi, Elephant Conservation Village, Saok Falls, Pulau Herba and Lasir Waterfall.",
  },
  {
    id: "oct-mar-4d3n",
    seasonLabel: "Oct to Mar",
    durationLabel: "4D3N",
    title: "Oct to Mar · 4D3N",
    seasonTag: "Elephant Village & Southern Coves",
    description: "Complete voyage featuring Elephant Conservation Village, Saok & Lasir Falls, Melunak Giant Tree and Gua Bewah.",
  },
];

const WP_GAWI: MapWaypoint = {
  id: "gawi",
  name: "Pengkalan Gawi Jetty",
  dayNumber: 1,
  lat: 5.1375,
  lng: 102.8025,
  x: 72,
  y: 20,
  type: "embarkation",
  title: "Embarkation & Welcome",
  shortDesc: "Board Summer Cruise at Pengkalan Gawi Jetty. Meet the dedicated crew and private host, enjoy arrival refreshments, and cast off toward sheltered lake waters.",
  activities: ["Safety Orientation", "Welcome Drinks", "Cast Off"],
  imageUrl: "/images/real/summercruise.webp",
};

const WP_ELEPHANT: MapWaypoint = {
  id: "elephant",
  name: "Kenyir Elephant Conservation Village",
  dayNumber: 1,
  lat: 5.1496,
  lng: 102.7960,
  x: 70,
  y: 15,
  type: "sanctuary",
  title: "Elephant Conservation Village (October – March)",
  shortDesc: "Tender boat landing at the protected northern sanctuary to observe rescued Malaysian elephants roaming in natural rainforest habitat.",
  activities: ["Elephant Encounter", "Rainforest Nature Walk", "Eco Education"],
  imageUrl: "/images/real/about-1-Green-Horizon_summer-cruise.webp",
};

const WP_HERBA: MapWaypoint = {
  id: "herba",
  name: "Kenyir Herbal Island (Pulau Herba)",
  dayNumber: 1,
  lat: 5.0848,
  lng: 102.8000,
  x: 55,
  y: 35,
  type: "sanctuary",
  title: "Rainforest Botanicals & Herbal Infusions",
  shortDesc: "Tender landing at Pulau Sah Kecil to explore living indigenous rainforest medicinal collections — Tongkat Ali, Kacip Fatimah — with guided herbal tea tastings.",
  activities: ["Guided Botanical Walk", "Herbal Tea Tasting", "Flora Photography"],
  imageUrl: "/images/real/herbal-park.webp",
};

const WP_SAOK: MapWaypoint = {
  id: "saok",
  name: "Air Terjun Saok (Saok Falls)",
  dayNumber: 2,
  lat: 5.0805,
  lng: 102.7745,
  x: 45,
  y: 38,
  type: "waterfall",
  title: "Cascading Pools & Rocky Rapids",
  shortDesc: "Cruise into the sheltered western cove of Sungai Sauk. Climb the easy boulders to swim in refreshing natural forest plunge pools beneath towering canopies.",
  activities: ["Cascade Swimming", "Boulder Scrambling", "Forest Plunge"],
  imageUrl: "/images/lake/kenyir-aerial.webp",
};

const WP_KELAH: MapWaypoint = {
  id: "kelah",
  name: "Petang River Kelah Sanctuary",
  dayNumber: 2,
  lat: 4.9272,
  lng: 102.8041,
  x: 50,
  y: 65,
  type: "sanctuary",
  title: "Visit Kelah Sanctuary (March – October)",
  shortDesc: "Wade into the mountain waters of Petang River where schools of wild Malaysian Mahseer (Kelah) gather for a gentle fish spa in untouched current.",
  activities: ["Fish Feeding", "Wading", "Nature Photography"],
  imageUrl: "/images/real/DSC07600.webp",
};

const WP_LASIR: MapWaypoint = {
  id: "lasir",
  name: "Air Terjun Lasir (Lasir Falls)",
  dayNumber: 2,
  lat: 4.9640,
  lng: 102.8414,
  x: 75,
  y: 75,
  type: "waterfall",
  title: "Cascade Lagoons & Twilight Drift",
  shortDesc: "Tender boat ride to the multi-tiered Lasir cascades. Swim in crystal natural rock pools surrounded by ancient dipterocarp forest, then enjoy twilight drift on deck.",
  activities: ["Freshwater Swimming", "Rock Pools", "Sunset Tea"],
  imageUrl: "/images/real/lasir-falls-2.webp",
};

const WP_MELUNAK: MapWaypoint = {
  id: "melunak",
  name: "Peninsular Malaysia's Largest Melunak Tree",
  dayNumber: 3,
  lat: 4.8650,
  lng: 102.7290,
  x: 35,
  y: 85,
  type: "trail",
  title: "Peninsular Malaysia's Largest Melunak Tree",
  shortDesc: "A guided gentle trek through virgin rainforest to stand in awe before Malaysia's largest recorded Melunak tree with suspension walkway crossings.",
  activities: ["Forest Trek", "Suspension Bridge", "Canopy Ecology"],
  imageUrl: "/images/real/DSC07563-scaled.webp",
};

const WP_BEWAH: MapWaypoint = {
  id: "bewah",
  name: "Visit Gua Bewah (Prehistoric Cave)",
  dayNumber: 3,
  lat: 4.8514,
  lng: 102.7238,
  x: 28,
  y: 88,
  type: "cave",
  title: "Visit Gua Bewah (Prehistoric Cave)",
  shortDesc: "Ascend the safe boardwalk stairs into Bewah Cave, Southeast Asia's celebrated prehistoric archeological landmark dating back over 16,000 years.",
  activities: ["Cave Boardwalk Walk", "Speleology", "Panoramic Lake View"],
  imageUrl: "/images/real/bewah-cave-card.webp",
};

const WP_DISEMBARK_D3: MapWaypoint = {
  id: "disembark",
  name: "Pengkalan Gawi Return",
  dayNumber: 3,
  lat: 5.1375,
  lng: 102.8025,
  x: 72,
  y: 20,
  type: "disembarkation",
  title: "Dawn Stillness & Homeward Waters",
  shortDesc: "Early brew on the observation deck as dawn mist rises off the mirror surface. Unhurried navigation back to port with memories of Kenyir.",
  activities: ["Dawn Mist Tea", "Wildlife Spotting", "Disembarkation"],
  imageUrl: "/images/real/DJI_0911-min-scaled.webp",
};

const WP_DISEMBARK_D4: MapWaypoint = {
  id: "disembark",
  name: "Pengkalan Gawi Return",
  dayNumber: 4,
  lat: 5.1375,
  lng: 102.8025,
  x: 72,
  y: 20,
  type: "disembarkation",
  title: "Sunrise Farewell Cruise",
  shortDesc: "Hearty breakfast on the top deck as the vessel returns across calm waters to Pengkalan Gawi Jetty.",
  activities: ["Breakfast on Deck", "Farewell Souvenir", "Disembarkation"],
  imageUrl: "/images/vessels/gh-hero.webp",
};

export const MOCK_WAYPOINTS: Record<string, MapWaypoint[]> = {
  // 1. Mar to Oct 3D2N (with Kelah Sanctuary)
  "mar-oct-3d2n": [WP_GAWI, WP_HERBA, WP_SAOK, WP_LASIR, WP_KELAH, WP_DISEMBARK_D3],
  // 2. Mar to Oct 4D3N (with Kelah + Melunak + Bewah)
  "mar-oct-4d3n": [WP_GAWI, WP_HERBA, WP_SAOK, WP_LASIR, WP_KELAH, WP_MELUNAK, WP_BEWAH, WP_DISEMBARK_D4],
  // 3. Oct to Mar 3D2N (with Elephant Conservation Village)
  "oct-mar-3d2n": [WP_GAWI, WP_ELEPHANT, WP_HERBA, WP_SAOK, WP_LASIR, WP_DISEMBARK_D3],
  // 4. Oct to Mar 4D3N (with Elephant Village + Melunak + Bewah)
  "oct-mar-4d3n": [WP_GAWI, WP_ELEPHANT, WP_HERBA, WP_SAOK, WP_LASIR, WP_MELUNAK, WP_BEWAH, WP_DISEMBARK_D4],

  // Aliases for default package slugs
  "3d2n-kenyir-explorer": [WP_GAWI, WP_HERBA, WP_SAOK, WP_LASIR, WP_KELAH, WP_DISEMBARK_D3],
  "4d3n-kenyir-grand-voyage": [WP_GAWI, WP_HERBA, WP_SAOK, WP_LASIR, WP_KELAH, WP_MELUNAK, WP_BEWAH, WP_DISEMBARK_D4],
};

/**
 * Authentic navigation paths through Lake Kenyir's flooded river channels (fairways).
 * These coordinates follow the deep water bodies strictly so routes NEVER cut across solid land, hills or islands.
 */
export const WATER_NAVIGATION_CHANNELS: Record<string, [number, number][]> = {
  "mar-oct-3d2n": [
    [5.1375, 102.8025], // Gawi Jetty
    [5.1340, 102.7985], // Deep west channel
    [5.1220, 102.7930], // West of Pulau Gawi
    [5.1050, 102.7915], // West of Pulau Serindik
    [5.0920, 102.7915], // Channel junction
    // Side excursion into Saok Falls cove
    [5.0860, 102.7840],
    [5.0805, 102.7745], // Air Terjun Saok
    [5.0860, 102.7840], // Return via water channel
    // Side excursion to Pulau Herba
    [5.0880, 102.7950],
    [5.0848, 102.7990], // Pulau Herba Landing
    [5.0800, 102.7970],
    // Central open basin southwards
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    // Lasir Waterfall Inlet
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414], // Air Terjun Lasir
    [4.9680, 102.8300], // Return via water - NO CROSSING LAND RIDGE
    [4.9750, 102.8180], // Back to main fairway junction
    // Sungai Petang Kelah Sanctuary
    [4.9600, 102.8130],
    [4.9450, 102.8090],
    [4.9272, 102.8041], // Petang River Kelah Sanctuary
    [4.9450, 102.8090], // Back out through river channel
    [4.9600, 102.8130],
    // Northward homeward passage via central fairway
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025], // Pengkalan Gawi Jetty
  ],

  "mar-oct-4d3n": [
    [5.1375, 102.8025], // Gawi Jetty
    [5.1340, 102.7985],
    [5.1220, 102.7930],
    [5.1050, 102.7915],
    [5.0920, 102.7915],
    // Saok
    [5.0860, 102.7840],
    [5.0805, 102.7745],
    [5.0860, 102.7840],
    // Pulau Herba
    [5.0880, 102.7950],
    [5.0848, 102.7990],
    [5.0800, 102.7970],
    // Central basin
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    // Lasir
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414],
    [4.9680, 102.8300],
    [4.9750, 102.8180],
    // Kelah
    [4.9600, 102.8130],
    [4.9450, 102.8090],
    [4.9272, 102.8041],
    [4.9450, 102.8090],
    [4.9600, 102.8130],
    // Southwest Fjord toward Tanjung Mentong
    [4.9500, 102.8000],
    [4.9200, 102.7850],
    [4.8900, 102.7600],
    [4.8720, 102.7400],
    [4.8650, 102.7290], // Melunak Giant Tree
    [4.8514, 102.7238], // Gua Bewah Cave
    // Return passage via water fairway
    [4.8650, 102.7290],
    [4.8720, 102.7400],
    [4.8900, 102.7600],
    [4.9200, 102.7850],
    [4.9500, 102.8000],
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025], // Pengkalan Gawi Jetty
  ],

  "oct-mar-3d2n": [
    [5.1375, 102.8025], // Gawi Jetty
    // Northern cove to Elephant Village
    [5.1450, 102.8000],
    [5.1496, 102.7960], // Elephant Conservation Village
    [5.1450, 102.8000],
    [5.1375, 102.8025],
    // Main southward navigation
    [5.1340, 102.7985],
    [5.1220, 102.7930],
    [5.1050, 102.7915],
    [5.0920, 102.7915],
    // Saok
    [5.0860, 102.7840],
    [5.0805, 102.7745],
    [5.0860, 102.7840],
    // Pulau Herba
    [5.0880, 102.7950],
    [5.0848, 102.7990],
    [5.0800, 102.7970],
    // Central basin
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    // Lasir Waterfall
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414], // Lasir Waterfall
    [4.9680, 102.8300],
    [4.9750, 102.8180],
    // Return passage
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025], // Pengkalan Gawi Jetty
  ],

  "oct-mar-4d3n": [
    [5.1375, 102.8025], // Gawi Jetty
    // Northern cove to Elephant Village
    [5.1450, 102.8000],
    [5.1496, 102.7960], // Elephant Conservation Village
    [5.1450, 102.8000],
    [5.1375, 102.8025],
    // Main southward navigation
    [5.1340, 102.7985],
    [5.1220, 102.7930],
    [5.1050, 102.7915],
    [5.0920, 102.7915],
    // Saok
    [5.0860, 102.7840],
    [5.0805, 102.7745],
    [5.0860, 102.7840],
    // Pulau Herba
    [5.0880, 102.7950],
    [5.0848, 102.7990],
    [5.0800, 102.7970],
    // Central basin
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    // Lasir Waterfall
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414],
    [4.9680, 102.8300],
    [4.9750, 102.8180],
    // Southwest Fjord to Melunak & Bewah
    [4.9500, 102.8000],
    [4.9200, 102.7850],
    [4.8900, 102.7600],
    [4.8720, 102.7400],
    [4.8650, 102.7290], // Melunak Giant Tree
    [4.8514, 102.7238], // Gua Bewah Cave
    // Return passage
    [4.8650, 102.7290],
    [4.8720, 102.7400],
    [4.8900, 102.7600],
    [4.9200, 102.7850],
    [4.9500, 102.8000],
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025], // Pengkalan Gawi Jetty
  ],

  // Aliases for default package slugs
  "3d2n-kenyir-explorer": [
    [5.1375, 102.8025],
    [5.1340, 102.7985],
    [5.1220, 102.7930],
    [5.1050, 102.7915],
    [5.0920, 102.7915],
    [5.0860, 102.7840],
    [5.0805, 102.7745],
    [5.0860, 102.7840],
    [5.0880, 102.7950],
    [5.0848, 102.7990],
    [5.0800, 102.7970],
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414],
    [4.9680, 102.8300],
    [4.9750, 102.8180],
    [4.9600, 102.8130],
    [4.9450, 102.8090],
    [4.9272, 102.8041],
    [4.9450, 102.8090],
    [4.9600, 102.8130],
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025],
  ],
  "4d3n-kenyir-grand-voyage": [
    [5.1375, 102.8025],
    [5.1340, 102.7985],
    [5.1220, 102.7930],
    [5.1050, 102.7915],
    [5.0920, 102.7915],
    [5.0860, 102.7840],
    [5.0805, 102.7745],
    [5.0860, 102.7840],
    [5.0880, 102.7950],
    [5.0848, 102.7990],
    [5.0800, 102.7970],
    [5.0650, 102.7970],
    [5.0450, 102.8010],
    [5.0150, 102.8090],
    [4.9850, 102.8140],
    [4.9750, 102.8180],
    [4.9680, 102.8300],
    [4.9640, 102.8414],
    [4.9680, 102.8300],
    [4.9750, 102.8180],
    [4.9600, 102.8130],
    [4.9450, 102.8090],
    [4.9272, 102.8041],
    [4.9450, 102.8090],
    [4.9600, 102.8130],
    [4.9500, 102.8000],
    [4.9200, 102.7850],
    [4.8900, 102.7600],
    [4.8720, 102.7400],
    [4.8650, 102.7290],
    [4.8514, 102.7238],
    [4.8650, 102.7290],
    [4.8720, 102.7400],
    [4.8900, 102.7600],
    [4.9200, 102.7850],
    [4.9500, 102.8000],
    [4.9850, 102.8140],
    [5.0150, 102.8090],
    [5.0450, 102.8010],
    [5.0650, 102.7970],
    [5.0920, 102.7915],
    [5.1050, 102.7915],
    [5.1220, 102.7930],
    [5.1340, 102.7985],
    [5.1375, 102.8025],
  ],
};

/**
 * Authentic Lake Cruise Cabin Slots with deck layouts for bus/airline-like booking
 */
export const MOCK_CABIN_SLOTS: CabinDeckSlot[] = [
  // ===================== UPPER DECK (Sun & Panorama) =====================
  {
    id: "slot-301",
    roomCategoryId: "sc-master",
    cabinNumber: "Cabin 301",
    deck: "upper",
    deckLabel: "Upper Deck",
    name: "Master Suite",
    areaSqm: 24,
    areaSqft: 258,
    bedType: "King Bed",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Panoramic Lake View",
    basePriceMYR: 1850,
    status: "available",
    image: media("Master Suite with king bed and lake view", "/images/rooms/sc-master.webp"),
    slotPosition: {
      row: 1,
      col: "port",
      label: "Upper Forward Port",
    },
  },
  {
    id: "slot-302",
    roomCategoryId: "gh-panorama",
    cabinNumber: "Cabin 302",
    deck: "upper",
    deckLabel: "Upper Deck",
    name: "Panorama Balcony Suite",
    areaSqm: 26,
    areaSqft: 280,
    bedType: "King Bed + Balcony",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Private Balcony & Forward Lake View",
    basePriceMYR: 2150,
    status: "available",
    image: media("Green Horizon panorama suite balcony", "/images/rooms/gh-panorama.webp"),
    slotPosition: {
      row: 1,
      col: "starboard",
      label: "Upper Forward Starboard",
    },
  },

  // ===================== MAIN DECK (Saloon & Deluxe Staterooms) =====================
  {
    id: "slot-201",
    roomCategoryId: "sc-deluxe-double",
    cabinNumber: "Cabin 201",
    deck: "main",
    deckLabel: "Main Deck",
    name: "Deluxe Double Stateroom",
    areaSqm: 18,
    areaSqft: 194,
    bedType: "Queen Bed",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Eye-level Picture Window",
    basePriceMYR: 1450,
    status: "available",
    image: media("Summer Cruise deluxe double room", "/images/rooms/sc-deluxe.webp"),
    slotPosition: {
      row: 1,
      col: "port",
      label: "Main Forward Port",
    },
  },
  {
    id: "slot-202",
    roomCategoryId: "sc-deluxe-double",
    cabinNumber: "Cabin 202",
    deck: "main",
    deckLabel: "Main Deck",
    name: "Deluxe Twin Stateroom",
    areaSqm: 18,
    areaSqft: 194,
    bedType: "Two Single Beds",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Eye-level Picture Window",
    basePriceMYR: 1450,
    status: "available",
    image: media("Green Horizon twin room", "/images/rooms/gh-twin.webp"),
    slotPosition: {
      row: 1,
      col: "starboard",
      label: "Main Forward Starboard",
    },
  },
  {
    id: "slot-203",
    roomCategoryId: "sc-deluxe-double",
    cabinNumber: "Cabin 203",
    deck: "main",
    deckLabel: "Main Deck",
    name: "Deluxe Double Midship",
    areaSqm: 18,
    areaSqft: 194,
    bedType: "Queen Bed",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Picture Window",
    basePriceMYR: 1450,
    status: "available",
    image: media("Summer Cruise deluxe midship stateroom", "/images/rooms/sc-deluxe.webp"),
    slotPosition: {
      row: 2,
      col: "port",
      label: "Main Midship Port",
    },
  },
  {
    id: "slot-204",
    roomCategoryId: "sc-deluxe-double",
    cabinNumber: "Cabin 204",
    deck: "main",
    deckLabel: "Main Deck",
    name: "Deluxe Twin Midship",
    areaSqm: 18,
    areaSqft: 194,
    bedType: "Two Single Beds",
    maxOccupancy: 2,
    hasEnsuite: true,
    viewType: "Picture Window",
    basePriceMYR: 1450,
    status: "available",
    image: media("Green Horizon twin midship stateroom", "/images/rooms/gh-twin.webp"),
    slotPosition: {
      row: 2,
      col: "starboard",
      label: "Main Midship Starboard",
    },
  },

  // ===================== LOWER DECK (Waterline & Family) =====================
  {
    id: "slot-101",
    roomCategoryId: "sc-family",
    cabinNumber: "Cabin 101",
    deck: "lower",
    deckLabel: "Lower Deck",
    name: "Explorer Family Suite",
    areaSqm: 28,
    areaSqft: 301,
    bedType: "1 Queen + 2 Bunks",
    maxOccupancy: 4,
    hasEnsuite: true,
    viewType: "Dual Waterline Portholes",
    basePriceMYR: 1650,
    status: "available",
    image: media("Summer Cruise family room with bunk beds", "/images/rooms/sc-family.webp"),
    slotPosition: {
      row: 1,
      col: "port",
      label: "Lower Waterline Port",
    },
  },
  {
    id: "slot-102",
    roomCategoryId: "gh-family",
    cabinNumber: "Cabin 102",
    deck: "lower",
    deckLabel: "Lower Deck",
    name: "Grand Horizon Family Suite",
    areaSqm: 30,
    areaSqft: 322,
    bedType: "1 Double + 3 Bunks",
    maxOccupancy: 5,
    hasEnsuite: true,
    viewType: "Waterline Scenic Portholes",
    basePriceMYR: 1750,
    status: "unavailable",
    image: media("Green Horizon family room", "/images/rooms/gh-family.webp"),
    slotPosition: {
      row: 1,
      col: "starboard",
      label: "Lower Waterline Starboard",
    },
  },
];
