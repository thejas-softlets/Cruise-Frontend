import type { JournalArticle } from "@/types";

import { media } from "./media";

export const MOCK_ARTICLES: JournalArticle[] = [
  {
    slug: "green-horizon-newly-launched-luxury-houseboat",
    title: "Green Horizon: Newly Launched Luxury Houseboat at Tasik Kenyir",
    date: "2026-08-15",
    tag: "Fleet Launch",
    coverImage: media("Green Horizon newly launched luxury houseboat at Tasik Kenyir", "/images/real/about-1-Green-Horizon_summer-cruise.webp", 1920, 1080),
    body: [
      "We are thrilled to unveil Green Horizon, the newest addition to our luxury fleet on Kenyir Lake. Designed to accommodate up to 60 guests across 15 beautifully appointed suites, Green Horizon redefines group and family travel on Malaysia's premier freshwater paradise.",
      "Featuring a generous panoramic sun deck, expansive indoor-outdoor dining salons, state-of-the-art karaoke lounges, and dedicated private tenders, Green Horizon offers unparalleled comfort amidst ancient rainforest wilderness.",
    ],
    relatedPackageSlug: "4d3n-kenyir-grand-voyage",
  },
  {
    slug: "how-to-plan-terengganu-trip-10-easy-steps",
    title: "How to Plan a Terengganu Trip: 10 Easy Steps for Travellers",
    date: "2026-07-28",
    tag: "Travel Guide",
    coverImage: media("Coastline and iconic architectural landmarks of Kuala Terengganu", "/images/real/Featured-image-Coast-of-Kuala-Terengganu-Malaysia-1244x700-1.webp", 1244, 700),
    body: [
      "From the historical heritage of Kampung Cina and the majestic Crystal Mosque to the untouched rainforest waters of Tasik Kenyir, Terengganu offers a rare blend of culture and pristine nature.",
      "Here is our complete 10-step guide covering land transfers from TGG Sultan Mahmud Airport, local culinary delights, packing essentials, and combining a coastal city stay with a peaceful 3D2N houseboat retreat.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
  {
    slug: "hidden-islands-waterfalls-kenyir",
    title: "Hidden Waterfalls & Over 340 Islands: Discovering Kenyir",
    date: "2026-06-12",
    tag: "Exploration",
    coverImage: media("Aerial view of emerald islands and pristine waters across Lake Kenyir", "/images/real/DJI_0117-min-scaled.webp", 2048, 1536),
    body: [
      "With over 340 tropical islands and cascading rainforest waterfalls, Lake Kenyir is one of Southeast Asia's largest and most biologically diverse freshwater sanctuaries.",
      "Whether swimming in the natural stone jacuzzis of Lasir and Saok, trekking the prehistoric Melunak tree trails, or feeding Malaysian Mahseer in Kelah Sanctuary, every cove holds a new revelation.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
  {
    slug: "what-to-pack-kenyir-cruise",
    title: "What to pack for a houseboat cruise",
    date: "2026-05-18",
    tag: "Guides",
    coverImage: media("Canvas bag and sun hat on a houseboat deck chair", "/images/real/DSC07934-scaled.webp", 1920, 1280),
    body: [
      "Pack light and soft — literally. Soft bags stow easily in the rooms while hard suitcases fight for space. Beyond that, the list is short: swimwear, a hat, reef-safe sunscreen, sandals that can get wet, and one warm layer for after-dark cruising.",
      "We provide towels, snorkelling gear, life jackets and a hairdryer in every room. Mosquito repellent is on board, though the deck breeze keeps them away better than anything.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
];
