import type { Package } from "@/types";

import { media } from "./media";

export const MOCK_PACKAGES: Package[] = [
  {
    slug: "3d2n-kenyir-explorer",
    title: "The Whispering Canopy Passage",
    vesselId: "summer-cruise",
    durationNights: 2,
    durationLabel: "3 Days · 2 Nights",
    fromPriceMYR: 1450,
    heroImage: media("Summer Cruise cruising Kenyir Lake at golden hour", "/images/vessels/sc-hero.webp"),
    overview:
      "An unhurried passage through the lake's sheltered coves and emerald bays. Two quiet nights adrift beneath ancient rainforest canopies, swimming in secluded waterfall lagoons at Lasir, and dining on the open teak deck as twilight mist rises off the water.",
    highlights: [
      "Secluded swim in Lasir waterfall lagoons",
      "Dawn mist tea on the upper teak deck",
      "Starlit night-sounds drift with engines cut",
      "Freshly prepared lake-to-table dining",
    ],
    itinerary: [
      {
        day: 1,
        title: "Cast Off into the Living Rainforest",
        description:
          "Board at Pengkalan Gawi Jetty at 10:00. Welcome refreshment, gentle orientation, then cast off toward the secluded Lasir river mouth. Afternoon swim from the swim platform; open-air dinner as twilight settles over the canopy.",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Hidden Waterfalls & The Twilight Drift",
        description:
          "Tender boat transfer to the multi-tiered Lasir cascades for an undisturbed morning swim. Afternoon slow-drift into a sheltered cove; optional line fishing off the stern. Evening silent drift under starlight with engines turned off.",
        meals: ["Breakfast", "Lunch", "Tea", "Dinner"],
      },
      {
        day: 3,
        title: "Dawn Stillness & Homeward Waters",
        description:
          "Early brew on deck as mist lifts off the glassy water. Unhurried navigation back to port by 11:00, pausing whenever wildlife stirs along the forested shoreline.",
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "2 nights on board (full board dining)",
      "All artisanal meals + afternoon tea service",
      "Private Lasir waterfall excursion & tender transfer",
      "Snorkelling gear & leisure water equipment",
      "Dedicated crew of 4 with private host",
      "Jetty welcome & arrival refreshments",
    ],
    exclusions: [
      "Transfers to Pengkalan Gawi Jetty",
      "Travel insurance",
      "Cellar & reserve beverages",
      "Crew gratuities (discretionary)",
    ],
    roomCategoryIds: ["sc-master", "sc-deluxe-double", "sc-family"],
    experienceSlugs: ["lasir-waterfall", "kelah-sanctuary", "kayaking-rafting"],
    isPlaceholder: true,
  },
  {
    slug: "4d3n-kenyir-grand-voyage",
    title: "The Ancient Basin & Canyon Odyssey",
    vesselId: "green-horizon",
    durationNights: 3,
    durationLabel: "4 Days · 3 Nights",
    fromPriceMYR: 2050,
    heroImage: media("Green Horizon crossing the open lake at sunrise", "/images/vessels/gh-hero.webp"),
    overview:
      "An immersive four-day expedition into Kenyir's most remote, untamed reaches. Traverse soaring river canyons, discover prehistoric limestone caverns, encounter traditional lakeside heritage, and sleep beneath uninterrupted starlit skies in deep wilderness.",
    highlights: [
      "Tembat river canyon drift & private gorge swim",
      "Prehistoric Bewah cavern exploration & ancient limestone trails",
      "Lakeside botanical herb walk & local morning market",
      "Kampung Sekayu traditional fishing settlement encounter",
    ],
    itinerary: [
      {
        day: 1,
        title: "Departure into Emerald Gorges",
        description:
          "Embark at Pengkalan Gawi at 10:00. Navigate south into the dramatic Tembat river canyon with a mid-afternoon swim stop in crystal-clear mountain runoff. Sunset dinner served on the panoramic observation deck.",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Limestone Caverns & The Botanical Trail",
        description:
          "Guided morning excursion into the prehistoric Bewah limestone cave system, followed by an aromatic rainforest herb garden walk. Afternoon at leisure with paddleboarding and quiet angling off the stern.",
        meals: ["Breakfast", "Lunch", "Tea", "Dinner"],
      },
      {
        day: 3,
        title: "Heritage Waters & The Whispering Bay",
        description:
          "Early morning cruise to Kampung Sekayu for an authentic village market visit and cultural walk. Afternoon paddleboarding and private swimming in a tranquil, mirror-like bay surrounded by towering jungle hills.",
        meals: ["Breakfast", "Lunch", "Tea", "Dinner"],
      },
      {
        day: 4,
        title: "Sunrise Stillness & Return to Port",
        description:
          "A silent sunrise drift across the open basin, generous freshly prepared breakfast on deck, and scenic homeward navigation to the jetty by 11:00.",
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "3 nights on board (full board dining)",
      "All artisanal meals + afternoon tea service",
      "Bewah cave & rainforest trail guided excursions",
      "Kampung Sekayu cultural village expedition",
      "Snorkelling gear, kayaks & stand-up paddleboards",
      "Dedicated vessel crew of 5 & local nature guide",
    ],
    exclusions: [
      "Transfers to Pengkalan Gawi Jetty",
      "Travel insurance",
      "Cellar & reserve beverages",
      "Crew gratuities (discretionary)",
    ],
    roomCategoryIds: ["gh-panorama", "gh-twin", "gh-family"],
    experienceSlugs: ["bewah-cave", "melunak-trail", "kayaking-rafting"],
    isPlaceholder: true,
  },
];
