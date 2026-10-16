import type { Package } from "@/types";

import { media } from "./media";

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
      "Explore the stunning scenery of Kenyir Lake, enjoy various water activities, and experience guided tours of the surrounding rainforest with all-inclusive meals and accommodations.",
    highlights: [
      "Explore the stunning scenery of Kenyir Lake",
      "Enjoy various water activities",
      "Experience guided tours of the surrounding rainforest",
      "Relax on the cruise with all-inclusive meals and accommodations",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival, Check-in & Lasir Waterfall",
        description:
          "Arrival & registration at Gawi Jetty Check-in Point, luggage check-in. Welcome drink & refreshments served on board, room check-in. Light refreshments. Visit Lasir Waterfall & water activities. Western Fine Dining at Summer Lake View Café. On-board fishing or Free & Easy (Stargazing / Karaoke / Mini Theater).",
        meals: ["Welcome Drinks", "Light Refreshments", "Western Fine Dining"],
        schedule: [
          { time: "11:30 AM", activity: "Arrival & registration at Gawi Jetty Check-in Point, luggage check-in" },
          { time: "1:00 PM – 4:00 PM", activity: "Welcome drink & refreshments served on board, room check-in" },
          { time: "2:30 PM – 5:00 PM", activity: "Light refreshments" },
          { time: "4:00 PM – 6:30 PM", activity: "Visit Lasir Waterfall & water activities" },
          { time: "6:30 PM – 9:00 PM", activity: "Western Fine Dining at Summer Lake View Café" },
          { time: "9:00 PM – 10:30 PM", activity: "On-board fishing or Free & Easy (Stargazing / Karaoke / Mini Theater)" },
        ],
      },
      {
        day: 2,
        title: "Sanctuary / Excursion, Saok Waterfall & Steamboat Dinner",
        description:
          "Breakfast at Summer Lake View Café. Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March). Lunch at Summer Lake View Café. Visit Saok Waterfall & water activities. Light refreshments. Steamboat Dinner at Summer Lake View Café. Night fishing or Free & Easy.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
        schedule: [
          { time: "7:00 AM – 10:00 AM", activity: "Breakfast at Summer Lake View Café" },
          { time: "9:00 AM – 12:00 PM", activity: "Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March)" },
          { time: "12:00 PM – 2:00 PM", activity: "Lunch at Summer Lake View Café" },
          { time: "2:00 PM – 6:30 PM", activity: "Visit Saok Waterfall & water activities" },
          { time: "4:30 PM – 5:00 PM", activity: "Light refreshments" },
          { time: "6:30 PM – 9:00 PM", activity: "Steamboat Dinner at Summer Lake View Café" },
          { time: "9:00 PM – 10:30 PM", activity: "Night fishing or Free & Easy" },
        ],
      },
      {
        day: 3,
        title: "Orchid Garden / Herbal Island & Disembarkation",
        description:
          "Breakfast at Summer Lake View Café. Visit Orchid Garden / Herbal Island with hanging suspension walkways. Scenic cruise back to Gawi Jetty. Check-out and disembarkation at Pengkalan Gawi.",
        meals: ["Breakfast"],
        schedule: [
          { time: "7:00 AM – 10:00 AM", activity: "Breakfast at Summer Lake View Café" },
          { time: "8:30 AM – 10:00 AM", activity: "Visit Orchid Garden / Herbal Island with hanging suspension walkways" },
          { time: "10:00 AM", activity: "Scenic cruise back to Gawi Jetty" },
          { time: "11:00 AM", activity: "Check-out and disembarkation at Pengkalan Gawi" },
        ],
      },
    ],
    inclusions: [
      "Stand Up Paddle Boarding",
      "Kayaking",
      "Night Sky Viewing",
      "Cruise-Side Fishing",
      "Visit Gua Bewah",
      "Explore Peninsular Malaysia's Largest Melunak Tree",
      "Kenyir Waterfall Exploration",
      "Visit Kelah Sanctuary (March – October)",
      "Elephant Conservation Village (October – March)",
    ],
    exclusions: [
      "5% Service Charge",
      "Gawi Jetty Fees",
      "Tourism Tax",
      "Fuel Charge",
      "Attraction Entrance Fee",
      "Personal Accident Insurance",
      "Land Transfer",
    ],
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
      "Explore the stunning scenery of Kenyir Lake, enjoy various water activities, and experience guided tours of the surrounding rainforest with full-charter privacy.",
    highlights: [
      "Extended exploration of Kenyir Lake’s natural beauty",
      "Participate in additional water sports and activities",
      "Take in more comprehensive guided tours of the rainforest",
      "All-inclusive meals and accommodations for a relaxing and immersive experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival, Check-in & Lasir Waterfall",
        description:
          "Arrival & registration at Gawi Jetty, luggage check-in. Welcome drink & refreshments on board, room check-in. Visit Lasir Waterfall & water activities. Western Fine Dining at Summer Lake View Café. On-board fishing or Free & Easy.",
        meals: ["Welcome Drinks", "Light Refreshments", "Western Fine Dining"],
        schedule: [
          { time: "11:30 AM", activity: "Arrival & registration at Gawi Jetty, luggage check-in" },
          { time: "1:00 PM – 4:00 PM", activity: "Welcome drink & refreshments on board, room check-in" },
          { time: "4:00 PM – 6:30 PM", activity: "Visit Lasir Waterfall & water activities" },
          { time: "6:30 PM – 9:00 PM", activity: "Western Fine Dining at Summer Lake View Café" },
          { time: "9:00 PM – 10:30 PM", activity: "On-board fishing or Free & Easy" },
        ],
      },
      {
        day: 2,
        title: "Sanctuary / Excursion, Saok Waterfall & Steamboat Dinner",
        description:
          "Breakfast at Summer Lake View Café. Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March). Lunch at Summer Lake View Café. Visit Saok Waterfall & water sports. Steamboat Dinner at Summer Lake View Café. Night fishing / Stargazing.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
        schedule: [
          { time: "7:00 AM – 10:00 AM", activity: "Breakfast at Summer Lake View Café" },
          { time: "9:00 AM – 12:00 PM", activity: "Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March)" },
          { time: "12:00 PM – 2:00 PM", activity: "Lunch at Summer Lake View Café" },
          { time: "2:00 PM – 6:30 PM", activity: "Visit Saok Waterfall & water sports" },
          { time: "6:30 PM – 9:00 PM", activity: "Steamboat Dinner at Summer Lake View Café" },
          { time: "9:00 PM – 10:30 PM", activity: "Night fishing / Stargazing" },
        ],
      },
      {
        day: 3,
        title: "Jungle Trekking to Melunak Giant Tree, Gua Bewah & BBQ Dinner",
        description:
          "Breakfast at Summer Lake View Café. Guided rainforest trek to Malaysia’s Largest Melunak Tree and prehistoric Gua Bewah Cave. Lunch at Summer Lake View Café. Water activities (Kayaking / SUP / Lake Slide). Light refreshments. BBQ Grill Dinner at Summer Lake View Café. Night fishing or Free & Easy.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "BBQ Grill Dinner"],
        schedule: [
          { time: "7:00 AM – 10:00 AM", activity: "Breakfast at Summer Lake View Café" },
          { time: "8:30 AM – 12:00 PM", activity: "Guided rainforest trek to Malaysia’s Largest Melunak Tree and prehistoric Gua Bewah Cave" },
          { time: "12:00 PM – 2:00 PM", activity: "Lunch at Summer Lake View Café" },
          { time: "2:30 PM – 6:30 PM", activity: "Water activities (Kayaking / SUP / Lake Slide)" },
          { time: "4:30 PM", activity: "Light refreshments" },
          { time: "6:30 PM – 9:00 PM", activity: "BBQ Grill Dinner at Summer Lake View Café" },
          { time: "9:00 PM – 10:30 PM", activity: "Night fishing or Free & Easy" },
        ],
      },
      {
        day: 4,
        title: "Orchid Garden / Herbal Island & Homeward Cruise",
        description:
          "Breakfast at Summer Lake View Café. Visit Orchid Garden / Herbal Island suspension walkway. Travel back to Gawi Jetty. Check-out and disembarkation at Pengkalan Gawi.",
        meals: ["Breakfast"],
        schedule: [
          { time: "7:00 AM – 10:00 AM", activity: "Breakfast at Summer Lake View Café" },
          { time: "8:30 AM – 10:00 AM", activity: "Visit Orchid Garden / Herbal Island suspension walkway" },
          { time: "10:00 AM", activity: "Travel back to Gawi Jetty" },
          { time: "11:00 AM", activity: "Check-out and disembarkation at Pengkalan Gawi" },
        ],
      },
    ],
    inclusions: [
      "Stand Up Paddle Boarding",
      "Kayaking",
      "Night Sky Viewing",
      "Cruise-Side Fishing",
      "Visit Gua Bewah",
      "Explore Peninsular Malaysia's Largest Melunak Tree",
      "Kenyir Waterfall Exploration",
      "Visit Kelah Sanctuary (March – October)",
      "Elephant Conservation Village (October – March)",
    ],
    exclusions: [
      "5% Service Charge",
      "Gawi Jetty Fees",
      "Tourism Tax",
      "Fuel Charge",
      "Attraction Entrance Fee",
      "Personal Accident Insurance",
      "Land Transfer",
    ],
    roomCategoryIds: ["sc-premium", "sc-deluxe", "sc-superior"],
    experienceSlugs: ["bewah-cave", "melunak-trail", "kayaking-rafting"],
    isPlaceholder: true,
  },
];
