import type { Package, ItineraryDay } from "@/types";

import { media } from "./media";

// ==================== 3D2N ITINERARIES (FROM OFFICIAL PDF) ====================
const ITINERARY_3D2N_MAR_OCT: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival, Welcome & Lasir Waterfall",
    description:
      "Registration at Summer Cruise Check in Point for Luggage check in. Getting on board, Welcome Drink served on board & Room Check-in. Light Refreshments at Summer Lake View Café. Lasir Waterfall excursion and water activities. Casual Western Dinner. Evening fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater).",
    meals: ["Welcome Drink", "Light Refreshments", "Casual Western Dinner"],
    schedule: [
      { time: "12:00 PM", activity: "Registration at Summer Cruise Check in Point for Luggage check in" },
      { time: "12:30 PM", activity: "Getting on board, Welcome Drink served on board & Room Check-in" },
      { time: "2:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "4:00 PM – 7:00 PM", activity: "Lasir Waterfall / Water activities" },
      { time: "7:00 PM – 9:00 PM", activity: "Casual Western Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 2,
    title: "Kelah Sanctuary, Melunak Giant Tree & Gua Bewah",
    description:
      "Breakfast served at Summer Lake View Café. Morning excursion to Petang River Kelah Sanctuary. Lunch at Summer Lake View Café. Jungle Trekking to explore Peninsular Malaysia's Largest Melunak Tree. Light Refreshments. Visit Home of Bewah Man (Bewah Cave). Steamboat Dinner. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Visit Kelah Sanctuary" },
      { time: "12:00 PM – 2:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "3:00 PM – 5:00 PM", activity: "Jungle Trekking & explore Malaysia Largest Melunak Tree" },
      { time: "5:00 PM – 5:30 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "5:30 PM – 7:00 PM", activity: "Visit Home of Bewah Man" },
      { time: "7:00 PM – 9:00 PM", activity: "Steamboat Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 3,
    title: "Free & Easy, Lake Lunch & Disembarkation",
    description:
      "Breakfast served at Summer Lake View Café. Free & Easy lake morning. Lunch served at Summer Lake View Café. Room check out and scenic cruise back to Summer Cruise Check in Point (Gawi Point). Disembarkation at 1:00 PM.",
    meals: ["Breakfast", "Lunch"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Free & Easy" },
      { time: "12:00 PM – 1:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "12:45 PM", activity: "Room Check out, Back to Summer Cruise Check in Point (Gawi Point)" },
      { time: "1:00 PM", activity: "Disembark" },
    ],
  },
];

const ITINERARY_3D2N_OCT_MAR: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival, Welcome & Home of Bewah Man",
    description:
      "Registration at Summer Cruise Check in Point for Luggage check in. Getting on board, Welcome Drink served on board & Room Check-in. Light Refreshments at Summer Lake View Café. Visit Home of Bewah Man (Bewah Cave) & Water Activities. Casual Western Dinner. Evening fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater).",
    meals: ["Welcome Drink", "Light Refreshments", "Casual Western Dinner"],
    schedule: [
      { time: "12:00 PM", activity: "Registration at Summer Cruise Check in Point for Luggage check in" },
      { time: "12:30 PM", activity: "Getting on board, Welcome Drink served on board & Room Check-in" },
      { time: "2:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "5:00 PM – 7:00 PM", activity: "Visit Home of Bewah Man (Bewah Cave) & Water Activities" },
      { time: "7:00 PM – 9:00 PM", activity: "Casual Western Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 2,
    title: "Melunak Giant Tree & Lasir Waterfall",
    description:
      "Breakfast served at Summer Lake View Café. Jungle Trekking to explore Peninsular Malaysia's Largest Melunak Tree. Lunch at Summer Lake View Café. Afternoon at Lasir Waterfall & water activities. Light Refreshments. Steamboat Dinner served at Summer Lake View Café. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Jungle Trekking & explore Malaysia Largest Melunak Tree" },
      { time: "12:00 PM – 2:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "3:00 PM – 7:00 PM", activity: "Lasir Waterfall / Water activities" },
      { time: "5:00 PM – 5:30 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "7:00 PM – 9:00 PM", activity: "Steamboat Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 3,
    title: "Free & Easy, Disembarkation & Elephant Conservation Village",
    description:
      "Breakfast served at Summer Lake View Café. Free & Easy lake morning. Lunch served at Summer Lake View Café. Room check out, return to Summer Cruise Check in Point (Gawi Point). Disembark at 1:00 PM, followed by an afternoon visit to Kenyir Elephant Conservation Village (KECV) at 1:30 PM.",
    meals: ["Breakfast", "Lunch"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Free & Easy" },
      { time: "12:00 PM – 1:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "12:45 PM", activity: "Room Check out, Back to Summer Cruise Check in Point (Gawi Point)" },
      { time: "1:00 PM", activity: "Disembark" },
      { time: "1:30 PM", activity: "Visit Kenyir Elephant Conservation Village (KECV)" },
    ],
  },
];

// ==================== 4D3N ITINERARIES (FROM OFFICIAL PDF) ====================
const ITINERARY_4D3N_MAR_OCT: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival, Welcome & Lasir Waterfall",
    description:
      "Registration at Summer Cruise Check in Point for Luggage check in. Getting on board, Welcome Drink served on board & Room Check-in. Light Refreshments at Summer Lake View Café. Lasir Waterfall excursion and water activities. Dinner at Summer Lake View Café. Evening fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater).",
    meals: ["Welcome Drink", "Light Refreshments", "Dinner"],
    schedule: [
      { time: "12:00 PM", activity: "Registration at Summer Cruise Check in Point for Luggage check in" },
      { time: "12:30 PM", activity: "Getting on board, Welcome Drink served on board & Room Check-in" },
      { time: "2:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "4:00 PM – 7:00 PM", activity: "Lasir Waterfall / Water activities" },
      { time: "7:00 PM – 9:00 PM", activity: "Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 2,
    title: "Kelah Sanctuary & Home of Bewah Man",
    description:
      "Breakfast served at Summer Lake View Café. Morning excursion to Kelah Sanctuary. Lunch at Summer Lake View Café. Afternoon visit to Home of Bewah Man (Bewah Cave). Light Refreshments. Dinner served at Summer Lake View Café. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Visit Kelah Sanctuary" },
      { time: "12:00 PM – 2:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "3:00 PM – 7:00 PM", activity: "Visit Home of Bewah Man" },
      { time: "4:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "7:00 PM – 9:00 PM", activity: "Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 3,
    title: "Melunak Giant Tree & Soak Waterfall",
    description:
      "Breakfast served at Summer Lake View Café. Jungle Trekking to explore Peninsular Malaysia's Largest Melunak Tree. Lunch at Summer Lake View Café. Light Refreshments. Visit Soak Waterfall. Dinner served at Summer Lake View Café. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "8:30 AM – 11:30 AM", activity: "Jungle Trekking & explore Malaysia Largest Melunak Tree" },
      { time: "12:00 PM – 2:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "4:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "4:00 PM – 7:00 PM", activity: "Visit Soak Waterfall" },
      { time: "7:00 PM – 9:00 PM", activity: "Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 4,
    title: "Breakfast, Homeward Cruise & Disembarkation",
    description:
      "Breakfast served at Summer Lake View Café. Scenic morning cruise back to Gawi Jetty, room check out. Disembarkation at 11:00 AM.",
    meals: ["Breakfast"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "10:00 AM", activity: "Back to Gawi Jetty, Room Check out" },
      { time: "11:00 AM", activity: "Disembark" },
    ],
  },
];

const ITINERARY_4D3N_OCT_MAR: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival, Welcome & Home of Bewah Man",
    description:
      "Registration at Summer Cruise Check in Point for Luggage check in. Getting on board, Welcome Drink served on board & Room Check-in. Light Refreshments at Summer Lake View Café. Visit Home of Bewah Man (Bewah Cave) & Water Activities. Casual Western Dinner. Evening fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater).",
    meals: ["Welcome Drink", "Light Refreshments", "Casual Western Dinner"],
    schedule: [
      { time: "12:00 PM", activity: "Registration at Summer Cruise Check in Point for Luggage check in" },
      { time: "12:30 PM", activity: "Getting on board, Welcome Drink served on board & Room Check-in" },
      { time: "2:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "5:00 PM – 7:00 PM", activity: "Visit Home of Bewah Man (Bewah Cave) & Water Activities" },
      { time: "7:00 PM – 9:00 PM", activity: "Casual Western Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 2,
    title: "Melunak Giant Tree & Lasir Waterfall",
    description:
      "Breakfast served at Summer Lake View Café. Jungle Trekking to explore Peninsular Malaysia's Largest Melunak Tree. Lunch at Summer Lake View Café. Afternoon at Lasir Waterfall & water activities. Light Refreshments. Steamboat Dinner served at Summer Lake View Café. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Jungle Trekking & explore Malaysia Largest Melunak Tree" },
      { time: "12:00 PM – 2:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "3:00 PM – 7:00 PM", activity: "Lasir Waterfall / Water activities" },
      { time: "5:00 PM – 5:30 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "7:00 PM – 9:00 PM", activity: "Steamboat Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 3,
    title: "Free & Easy & Soak Waterfall",
    description:
      "Breakfast served at Summer Lake View Café. Free & Easy lake morning. Lunch served at Summer Lake View Café. Light Refreshments. Afternoon visit to Soak Waterfall. Dinner served at Summer Lake View Café. Night fishing on board or Free & Easy.",
    meals: ["Breakfast", "Lunch", "Light Refreshments", "Dinner"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM – 12:00 PM", activity: "Free & Easy" },
      { time: "12:00 PM – 1:00 PM", activity: "Lunch served at Summer Lake View Cafe" },
      { time: "4:00 PM", activity: "Light Refreshment served at Summer Lake View Cafe" },
      { time: "4:00 PM – 7:00 PM", activity: "Visit Soak Waterfall" },
      { time: "7:00 PM – 9:00 PM", activity: "Dinner served at Summer Lake View Cafe" },
      { time: "9:00 PM – 10:30 PM", activity: "Fishing on board or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
    ],
  },
  {
    day: 4,
    title: "Free & Easy, Disembarkation & Elephant Conservation Village",
    description:
      "Breakfast served at Summer Lake View Café. Free & Easy. Return to Gawi Jetty, room check out. Disembarkation at 11:00 AM, followed by a visit to Kenyir Elephant Conservation Village (KECV) at 11:30 AM.",
    meals: ["Breakfast"],
    schedule: [
      { time: "7:00 AM – 9:00 AM", activity: "Breakfast served at Summer Lake View Cafe" },
      { time: "9:00 AM", activity: "Free & Easy" },
      { time: "10:00 AM", activity: "Back to Gawi Jetty, Room Check out" },
      { time: "11:00 AM", activity: "Disembark" },
      { time: "11:30 AM", activity: "Visit Kenyir Elephant Conservation Village (KECV)" },
    ],
  },
];

const COMMON_INCLUSIONS = [
  "Stand Up Paddle Boarding",
  "Kayaking",
  "Night Sky Viewing",
  "Cruise-Side Fishing",
  "Visit Gua Bewah",
  "Explore Peninsular Malaysia's Largest Melunak Tree",
  "Kenyir Waterfall Exploration",
  "Visit Kelah Sanctuary (March – October)",
  "Elephant Conservation Village (October – March)",
];

const COMMON_EXCLUSIONS = [
  "5% Service Charge",
  "Gawi Jetty Fees",
  "Tourism Tax",
  "Fuel Charge",
  "Attraction Entrance Fee",
  "Personal Accident Insurance",
  "Land Transfer",
];

export const MOCK_PACKAGES: Package[] = [
  {
    slug: "3d2n-kenyir-explorer",
    title: "3D2N Summer Cruise Package",
    vesselId: "summer-cruise",
    durationNights: 2,
    durationLabel: "3 Days · 2 Nights",
    fromPriceMYR: 1698,
    customPriceLabel: "From RM1,698 per pax",
    heroImage: media("Summer Cruise cruising Kenyir Lake at golden hour", "/images/vessels/sc-hero.webp"),
    overview:
      "Explore the stunning scenery of Kenyir Lake. Enjoy various water activities. Experience guided tours of the surrounding rainforest. Relax on the cruise with all-inclusive meals and accommodations.",
    highlights: [
      "Explore the stunning scenery of Kenyir Lake",
      "Enjoy various water activities",
      "Experience guided tours of the surrounding rainforest",
      "Relax on the cruise with all-inclusive meals and accommodations",
    ],
    itinerary: ITINERARY_3D2N_MAR_OCT,
    seasonalItineraries: {
      "mar-oct": ITINERARY_3D2N_MAR_OCT,
      "oct-mar": ITINERARY_3D2N_OCT_MAR,
    },
    pdfUrl: "/documents/summer-cruise-route-and-itinerary.pdf",
    inclusions: COMMON_INCLUSIONS,
    exclusions: COMMON_EXCLUSIONS,
    roomCategoryIds: ["sc-premium", "sc-deluxe", "sc-superior"],
    experienceSlugs: ["lasir-waterfall", "kelah-sanctuary", "kayaking-rafting"],
    isPlaceholder: true,
  },
  {
    slug: "4d3n-kenyir-grand-voyage",
    title: "4D3N Summer Cruise Package",
    vesselId: "summer-cruise",
    durationNights: 3,
    durationLabel: "4 Days · 3 Nights",
    fromPriceMYR: 44000,
    customPriceLabel: "Only available for Charter Cruise | From RM 44,000 for 24 pax",
    heroImage: media("Green Horizon crossing the open lake at sunrise", "/images/vessels/gh-hero.webp"),
    overview:
      "Explore the stunning scenery of Kenyir Lake. Enjoy various water activities. Experience guided tours of the surrounding rainforest. Relax on the cruise with all-inclusive meals and accommodations.",
    highlights: [
      "Extended exploration of Kenyir Lake’s natural beauty",
      "Participate in additional water sports and activities",
      "Take in more comprehensive guided tours of the rainforest",
      "All-inclusive meals and accommodations for a relaxing and immersive experience",
    ],
    itinerary: ITINERARY_4D3N_MAR_OCT,
    seasonalItineraries: {
      "mar-oct": ITINERARY_4D3N_MAR_OCT,
      "oct-mar": ITINERARY_4D3N_OCT_MAR,
    },
    pdfUrl: "/documents/summer-cruise-route-and-itinerary.pdf",
    inclusions: COMMON_INCLUSIONS,
    exclusions: COMMON_EXCLUSIONS,
    roomCategoryIds: ["sc-premium", "sc-deluxe", "sc-superior"],
    experienceSlugs: ["bewah-cave", "melunak-trail", "kayaking-rafting"],
    isPlaceholder: true,
  },
];
