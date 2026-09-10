import type { Vessel } from "@/types";

import { media } from "./media";

export const MOCK_VESSELS: Vessel[] = [
  {
    id: "summer-cruise",
    name: "Summer Cruise",
    tagline: "Our original houseboat — intimate, warm, quietly loved.",
    heroImage: media("Summer Cruise houseboat on Kenyir Lake at golden hour", "/images/vessels/sc-hero.webp"),
    gallery: [
      media("Summer Cruise deck at sunset", "/images/vessels/sc-deck-sunset.webp"),
      media("Summer Cruise lounge interior", "/images/vessels/sc-lounge.webp"),
      media("Guests swimming off the Summer Cruise deck", "/images/vessels/sc-swim.webp"),
      media("Summer Cruise cruising past forested islands", "/images/vessels/sc-cruising.webp"),
    ],
    capacity: 12,
    roomCount: 5,
    statLine: "Sleeps 12 across 5 rooms — ideal for one or two families, or a couple's escape with room to breathe.",
    packageSlugs: ["3d2n-kenyir-explorer"],
  },
  {
    id: "green-horizon",
    name: "Green Horizon",
    tagline: "Larger, lighter, built for gathering everyone.",
    heroImage: media("Green Horizon houseboat anchored in a quiet cove", "/images/vessels/gh-hero.webp"),
    gallery: [
      media("Green Horizon upper deck", "/images/vessels/gh-upper-deck.webp"),
      media("Green Horizon dining area set for dinner", "/images/vessels/gh-dining.webp"),
      media("Green Horizon anchored beneath the rainforest canopy", "/images/vessels/gh-anchored.webp"),
      media("Morning mist around Green Horizon", "/images/vessels/gh-morning-mist.webp"),
    ],
    capacity: 16,
    roomCount: 7,
    statLine: "Sleeps 16 across 7 rooms with a full-width upper deck — built for reunions, retreats and full-boat charters.",
    packageSlugs: ["4d3n-kenyir-grand-voyage"],
  },
];