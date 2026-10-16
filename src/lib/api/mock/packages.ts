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
      "Explore the stunning scenery of Kenyir Lake Enjoy various water activities Experience guided tours of the surrounding rainforest\n\n✅ Explore the stunning scenery of Kenyir Lake\n✅ Enjoy various water activities\n✅ Experience guided tours of the surrounding rainforest\n✅ Relax on the cruise with all-inclusive meals and accommodations",
    highlights: [
      "Explore the stunning scenery of Kenyir Lake",
      "Enjoy various water activities (Kayaking & Paddleboarding)",
      "Experience guided tours of the surrounding rainforest",
      "Relax on the cruise with all-inclusive meals and accommodations",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival, Check-in & Lasir Waterfall",
        description:
          "11:30 AM: Arrival & registration at Gawi Jetty Check-in Point, luggage check-in. 1:00 PM – 4:00 PM: Welcome drink & refreshments served on board, room check-in. 2:30 PM – 5:00 PM: Light refreshments. 4:00 PM – 6:30 PM: Visit Lasir Waterfall & water activities. 6:30 PM – 9:00 PM: Western Fine Dining at Summer Lake View Café. 9:00 PM – 10:30 PM: On-board fishing or Free & Easy (Stargazing / Karaoke / Mini Theater).",
        meals: ["Welcome Drinks", "Light Refreshments", "Western Fine Dining"],
      },
      {
        day: 2,
        title: "Sanctuary / Excursion, Saok Waterfall & Steamboat Dinner",
        description:
          "7:00 AM – 10:00 AM: Breakfast at Summer Lake View Café. 9:00 AM – 12:00 PM: Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March). 12:00 PM – 2:00 PM: Lunch at Summer Lake View Café. 2:00 PM – 6:30 PM: Visit Saok Waterfall & water activities. 4:30 PM – 5:00 PM: Light refreshments. 6:30 PM – 9:00 PM: Steamboat Dinner at Summer Lake View Café. 9:00 PM – 10:30 PM: Night fishing or Free & Easy.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
      },
      {
        day: 3,
        title: "Orchid Garden / Herbal Island & Disembarkation",
        description:
          "7:00 AM – 10:00 AM: Breakfast at Summer Lake View Café. 8:30 AM – 10:00 AM: Visit Orchid Garden / Herbal Island with hanging suspension walkways. 10:00 AM: Scenic cruise back to Gawi Jetty. 11:00 AM: Check-out and disembarkation at Pengkalan Gawi.",
        meals: ["Breakfast"],
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
    vesselId: "green-horizon",
    durationNights: 3,
    durationLabel: "4 Days · 3 Nights",
    fromPriceMYR: 44000,
    customPriceLabel: "Only available for Charter Cruise | From RM 44,000 for 24 pax",
    heroImage: media("Green Horizon crossing the open lake at sunrise", "/images/vessels/gh-hero.webp"),
    overview:
      "Explore the stunning scenery of Kenyir Lake Enjoy various water activities Experience guided tours of the surrounding rainforest\n\n✅ Extended exploration of Kenyir Lake’s natural beauty\n✅ Participate in additional water sports and activities\n✅ Take in more comprehensive guided tours of the rainforest\n✅ All-inclusive meals and accommodations for a relaxing and immersive experience",
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
          "11:30 AM: Arrival & registration at Gawi Jetty, luggage check-in. 1:00 PM – 4:00 PM: Welcome drink & refreshments on board, room check-in. 4:00 PM – 6:30 PM: Visit Lasir Waterfall & water activities. 6:30 PM – 9:00 PM: Western Fine Dining at Summer Lake View Café. 9:00 PM – 10:30 PM: On-board fishing or Free & Easy.",
        meals: ["Welcome Drinks", "Light Refreshments", "Western Fine Dining"],
      },
      {
        day: 2,
        title: "Sanctuary / Excursion, Saok Waterfall & Steamboat Dinner",
        description:
          "7:00 AM – 10:00 AM: Breakfast at Summer Lake View Café. 9:00 AM – 12:00 PM: Visit Kelah Sanctuary (March to October) or Elephant Conservation Village (October to March). 12:00 PM – 2:00 PM: Lunch at Summer Lake View Café. 2:00 PM – 6:30 PM: Visit Saok Waterfall & water sports. 6:30 PM – 9:00 PM: Steamboat Dinner at Summer Lake View Café. 9:00 PM – 10:30 PM: Night fishing / Stargazing.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "Steamboat Dinner"],
      },
      {
        day: 3,
        title: "Jungle Trekking to Melunak Giant Tree, Gua Bewah & BBQ Dinner",
        description:
          "7:00 AM – 10:00 AM: Breakfast at Summer Lake View Café. 8:30 AM – 12:00 PM: Guided rainforest trek to Malaysia’s Largest Melunak Tree and prehistoric Gua Bewah Cave. 12:00 PM – 2:00 PM: Lunch at Summer Lake View Café. 2:30 PM – 6:30 PM: Water activities (Kayaking / SUP / Lake Slide). 4:30 PM: Light refreshments. 6:30 PM – 9:00 PM: BBQ Grill Dinner at Summer Lake View Café. 9:00 PM – 10:30 PM: Night fishing or Free & Easy.",
        meals: ["Breakfast", "Lunch", "Light Refreshments", "BBQ Grill Dinner"],
      },
      {
        day: 4,
        title: "Orchid Garden / Herbal Island & Homeward Cruise",
        description:
          "7:00 AM – 10:00 AM: Breakfast at Summer Lake View Café. 8:30 AM – 10:00 AM: Visit Orchid Garden / Herbal Island suspension walkway. 10:00 AM: Travel back to Gawi Jetty. 11:00 AM: Check-out and disembarkation at Pengkalan Gawi.",
        meals: ["Breakfast"],
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
    roomCategoryIds: ["sc-premium", "sc-deluxe", "sc-superior", "gh-panorama", "gh-lake-view", "gh-vista", "gh-family"],
    experienceSlugs: ["bewah-cave", "melunak-trail", "kayaking-rafting"],
    isPlaceholder: true,
  },
];
