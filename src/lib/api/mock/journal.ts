import type { JournalArticle } from "@/types";

import { media } from "./media";

export const MOCK_ARTICLES: JournalArticle[] = [
  {
    slug: "best-time-to-visit-kenyir",
    title: "When is the best time to cruise Kenyir Lake?",
    date: "2026-08-02",
    tag: "Planning",
    coverImage: media("Sun breaking over Kenyir Lake in the early morning", "/images/journal/journal-best-time.webp"),
    body: [
      "Kenyir is a year-round lake, but the seasons do change the character of a cruise. March to October brings the driest, calmest water — long still mornings, easy swimming, and waterfalls at a friendly flow.",
      "November to February is the wetter window. It sounds like a drawback, but it is when the forest is loudest and the lake is emptiest — rain usually arrives as a dramatic afternoon shower rather than an all-day soak, and the crew simply re-routes to sheltered coves.",
      "Our honest advice: if it is your first cruise and you have school-age children, aim for June or the March school break. If you are chasing photographs and solitude, February's shoulder weeks are the lake at its most cinematic.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
  {
    slug: "what-to-pack-kenyir-cruise",
    title: "What to pack for a houseboat cruise",
    date: "2026-07-18",
    tag: "Guides",
    coverImage: media("Canvas bag and sun hat on a houseboat deck chair", "/images/journal/journal-what-to-pack.webp"),
    body: [
      "Pack light and soft — literally. Soft bags stow easily in the rooms while hard suitcases fight for space. Beyond that, the list is short: swimwear, a hat, reef-safe sunscreen, sandals that can get wet, and one warm layer for after-dark cruising.",
      "We provide towels, snorkelling gear, life jackets and a hairdryer in every room. Mosquito repellent is on board, though the deck breeze keeps them away better than anything.",
      "The one thing guests always thank us for reminding them: a power bank. The lake makes you leave your phone down and look up — but the camera roll fills faster than you expect.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
  {
    slug: "kenyir-with-kids",
    title: "Kenyir with kids: a parent's honest guide",
    date: "2026-06-25",
    tag: "Family",
    coverImage: media("Children fishing off the houseboat deck with a crew member", "/images/journal/journal-kids.webp"),
    body: [
      "The most common thing parents tell us after a family cruise: the kids were off the screens within an hour, and nobody missed them. The lake does the entertaining — swimming off the deck, fishing lines off the stern, frogs and hornbills on the shoreline.",
      "Practicalities we have learned from hundreds of family bookings: the Family Room books out first in every school holiday, so enquire early; life jackets stay on for all water activities, no exceptions and no negotiations; and the crew are genuinely wonderful with children — many have kids of their own.",
      "If you are travelling with under-4s, message us before booking. We will walk you through which rooms and dates work best, honestly.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
  {
    slug: "rainy-day-on-the-lake",
    title: "What we actually do when it rains",
    date: "2026-05-30",
    tag: "On board",
    coverImage: media("Rain clouds over the rainforest shoreline of Kenyir Lake", "/images/journal/journal-rainy-day.webp"),
    body: [
      "Rain on Kenyir is theatre — a wall of grey that sweeps across the lake, drums on the deck canopy for twenty minutes, and leaves the air rinsed and the forest steaming.",
      "When it arrives, we slow down instead of stopping: the boat finds a sheltered cove, the chef puts tea and hot fritters on, and it becomes the nap-and-boardgames hour that half our guests describe as the highlight of the trip.",
      "The only truly rain-ruined activity is the cave walk, and we simply swap it with the next day's schedule. The captain's weather calls are final — they are also why our safety record is spotless.",
    ],
    relatedPackageSlug: "4d3n-kenyir-grand-voyage",
  },
  {
    slug: "how-booking-works",
    title: "How booking works (and why there's no online checkout)",
    date: "2026-04-12",
    tag: "Booking",
    coverImage: media("Crew member replying to guest messages at the Summer Cruise office", "/images/journal/journal-booking.webp"),
    body: [
      "We are often asked why we do not have an instant online checkout. The honest answer: every cruise is slightly different — room mixes, group sizes, jetty transfers, festive dates — and a human checking availability means the quote you receive is the price you actually pay.",
      "The flow is simple: enquire through the website or WhatsApp, receive a personalised quote within 24 hours, confirm with a 30% deposit, and pay the balance two weeks before departure.",
      "If you would rather do the entire booking over WhatsApp with a person — starting with 'hello' and ending with a boarding time — that is exactly how most of our guests do it.",
    ],
    relatedPackageSlug: "3d2n-kenyir-explorer",
  },
];
