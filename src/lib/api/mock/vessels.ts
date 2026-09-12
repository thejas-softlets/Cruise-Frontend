import type { Vessel } from "@/types";

import { media } from "./media";

export const MOCK_VESSELS: Vessel[] = [
  {
    id: "summer-cruise",
    name: "Summer Cruise",
    tagline: "Our flagship luxury houseboat — intimate, handcrafted, and quietly loved on Lake Kenyir.",
    heroImage: media("Summer Cruise luxury houseboat aerial view on Kenyir Lake", "/images/real/DJI_0061.webp", 1920, 1080),
    gallery: [
      media("Summer Cruise panoramic bedroom with lake view", "/images/real/sc-superior-bedroom.webp", 1920, 1440),
      media("Houseboat deck dining lounge", "/images/real/DSC01523-min-scaled.webp", 1920, 1280),
      media("Summer Cruise aerial cruising across Kenyir coves", "/images/real/DJI_0911-min-scaled.webp", 2048, 1536),
      media("Upper sun deck with loungers", "/images/real/6P3A8577-min-scaled.webp", 1920, 1280),
      media("Summer Cruise anchored in serene emerald bay", "/images/real/DJI_0123-min-scaled.webp", 1920, 1080),
    ],
    capacity: 34,
    crewCount: 10,
    roomCount: 12,
    statLine: "Accommodates up to 34 guests across 12 private rooms with 10 dedicated crew members.",
    highlights: [
      "Lasir Waterfall",
      "Kelah Sanctuary",
      "Bewah Cave",
      "Melunak Trail",
      "Saok Waterfall",
      "Orchid Garden",
      "Cave Hiking",
      "Jungle Trekking",
    ],
    packageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    id: "green-horizon",
    name: "Green Horizon",
    tagline: "Newly launched luxury grand houseboat — grand proportions, modern elegance, built for gathering.",
    heroImage: media("Green Horizon luxury houseboat front profile at Tasik Kenyir", "/images/real/about-1-Green-Horizon_summer-cruise.webp", 1920, 1080),
    gallery: [
      media("Green Horizon side profile on water", "/images/real/about-2-Green-Horizon_summer-cruise.webp", 1920, 1080),
      media("Green Horizon aerial view with lush rainforest backdrop", "/images/real/DJI_20240629102555_0058_D-min.webp", 2048, 1536),
      media("Spacious modern cabin and dining facilities", "/images/real/sc-dinner-spread.webp", 1920, 1280),
      media("Green Horizon cruising pristine rainforest lake", "/images/real/DJI_0993-min.webp", 1920, 1080),
    ],
    capacity: 60,
    crewCount: 10,
    roomCount: 15,
    statLine: "Accommodates up to 60 guests across 15 spacious rooms with 10 dedicated crew members.",
    highlights: [
      "Lasir Waterfall",
      "Kelah Sanctuary",
      "Bewah Cave",
      "Melunak Trail",
      "Saok Waterfall",
      "Orchid Garden",
      "Sunset Deck",
      "Karaoke Lounge",
    ],
    packageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
];