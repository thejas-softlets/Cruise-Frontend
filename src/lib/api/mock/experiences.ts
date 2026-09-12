import type { Experience } from "@/types";

import { media } from "./media";

export const MOCK_EXPERIENCES: Experience[] = [
  {
    slug: "elephant-conservation-village",
    kind: "excursions",
    title: "Kenyir Elephant Conservation Village",
    images: [
      media("Kenyir Elephant Conservation Village interaction at Tasik Kenyir", "/images/real/Kenyir-Elephant-Conservation-Village.webp", 1200, 800),
    ],
    lines: [
      "Get up close with Asian elephants in their protected forest sanctuary — learn about conservation and ethical wildlife care.",
      "A guided eco-experience suitable for families and nature lovers of all ages.",
    ],
    tags: ["Wildlife", "Conservation", "Family friendly"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "kelah-sanctuary",
    kind: "excursions",
    title: "Playing in Kenyir Kelah Sanctuary",
    images: [
      media("Natural Kelah Fish Spa Sanctuary at Petang River Kenyir", "/images/real/DSC07600.webp", 1920, 1280),
      media("Feeding and wading with wild Malaysian Mahseer fish", "/images/real/DSC07610.webp", 1920, 1280),
    ],
    lines: [
      "Wade into crystal-clear river currents for a natural fish spa with hundreds of protected Kelah (Malaysian Mahseer).",
      "Feed the friendly fish and immerse yourself in one of Kenyir's most vibrant living waters.",
    ],
    tags: ["Fish Spa", "River", "Iconic"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "bewah-cave",
    kind: "excursions",
    title: "Exploring Bewah Cave",
    images: [
      media("Conqueror of Bewah Cave subterranean chamber exploration", "/images/real/495.webp", 1200, 800),
      media("Ancient limestone formations inside Gua Bewah", "/images/real/bewah-cave-formations.webp", 1920, 1280),
    ],
    lines: [
      "Climb into Southeast Asia's famous prehistoric limestone cave where ancient relics and mesmerising stalactites reside.",
      "Boardwalk pathways and elevated viewing decks make exploration safe and fascinating.",
    ],
    tags: ["Subterranean", "Prehistoric", "Guided walk"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "melunak-trail",
    kind: "excursions",
    title: "Melunak Trail Giant Tree Hike",
    images: [
      media("Enchanting Melunak Tree rainforest trail trekking", "/images/real/DSC07563-scaled.webp", 1920, 1280),
      media("Hikers on the suspension canopy walkway", "/images/real/DSC07724-1.webp", 1920, 1280),
    ],
    lines: [
      "Trek through ancient dipterocarp rainforest to stand before Malaysia's largest thousand-year-old Melunak tree.",
      "Cross scenic suspension bridges and immerse yourself in pristine jungle ecology.",
    ],
    tags: ["Jungle Trek", "Giant Tree", "Adventure"],
    includedInPackageSlugs: ["4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "lasir-waterfall",
    kind: "excursions",
    title: "Lasir Waterfall & Natural Lagoons",
    images: [
      media("Lasir multi-tiered waterfall cascading into freshwater swimming pool", "/images/real/DSC07615-scaled.webp", 1920, 1280),
    ],
    lines: [
      "A scenic tender ride to Kenyir's iconic multi-tiered waterfall with refreshing natural rock swimming pools.",
      "Relax on sunny granite rocks or swim beneath cooling jungle torrents.",
    ],
    tags: ["Waterfall", "Swimming", "Must-Visit"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "saok-waterfall",
    kind: "excursions",
    title: "Saok Waterfall & Forest Canopy",
    images: [
      media("Air Terjun Saok cascades through rainforest canopy", "/images/real/air-terjun-saok-1-scaled.webp", 1920, 1280),
    ],
    lines: [
      "A quieter, lush waterfall tucked within emerald ravines with tranquil shallow pools.",
      "Perfect for relaxing picnics and gentle forest bathing.",
    ],
    tags: ["Waterfall", "Nature", "Quiet"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer"],
  },
  {
    slug: "kayaking-rafting",
    kind: "activities",
    title: "Kayaking & Bamboo Rafting",
    images: [
      media("Guests enjoying kayak and bamboo rafting on Kenyir Lake", "/images/real/DSC07926-min-1-scaled.webp", 1920, 1280),
      media("Red kayak paddling across peaceful lake surface", "/images/real/DSC07934-scaled.webp", 1920, 1280),
    ],
    lines: [
      "Glide silently across calm glassy lake waters in personal kayaks or traditional bamboo rafts.",
      "All equipment and buoyancy aids provided with safety supervision.",
    ],
    tags: ["Water Sports", "Kayak", "Bamboo Raft"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "fishing-terengganu",
    kind: "activities",
    title: "Lake Angling & Sport Fishing",
    images: [
      media("Angling and game fishing on Kenyir Lake", "/images/real/fishing-terengganu.webp", 1200, 800),
    ],
    lines: [
      "Cast your lines for legendary Toman (Giant Snakehead), Kelah, and Sebarau in deep secluded bays.",
      "Catch-and-release sport fishing with experienced local guides.",
    ],
    tags: ["Fishing", "Angling", "Toman"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
];
