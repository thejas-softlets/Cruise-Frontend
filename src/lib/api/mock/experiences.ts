import type { Experience } from "@/types";

import { media } from "./media";

export const MOCK_EXPERIENCES: Experience[] = [
  {
    slug: "lasir-waterfall",
    kind: "excursions",
    title: "Lasir Waterfall",
    images: [
      media("Lasir waterfall cascading into a clear pool", "/images/experiences/lasir-waterfall.webp"),
      media("Guests swimming at the base of Lasir waterfall", "/images/experiences/lasir-swim.webp"),
    ],
    lines: [
      "A ten-minute boat ride to one of Kenyir's most loved waterfalls — a multi-tier cascade falling into a swimmable pool.",
      "Life jackets provided; the crew carries dry bags and sets up fruit and cold drinks on the rocks.",
    ],
    tags: ["Swim", "Half-day", "Family friendly"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer"],
  },
  {
    slug: "hawa-cave",
    kind: "excursions",
    title: "Hawa Cave",
    images: [
      media("Limestone cave entrance framed by rainforest", "/images/experiences/hawa-cave-entrance.webp"),
      media("Inside Hawa cave with daylight shafts", "/images/experiences/hawa-cave-inside.webp"),
    ],
    lines: [
      "A guided walk through a limestone cave system with daylight shafts, swiftlets and ancient water-carved walls.",
      "Helmets and lights provided — no climbing experience needed, just shoes that can get wet.",
    ],
    tags: ["Guided walk", "Half-day"],
    includedInPackageSlugs: ["4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "kampung-visit",
    kind: "excursions",
    title: "Kampung Sekayu Visit",
    images: [
      media("Village jetty at Kampung Sekayu", "/images/gallery/gallery-12-kampung-morning.webp"),
      media("Morning market stalls at Kampung Sekayu", "/images/deck/company-trip.webp"),
    ],
    lines: [
      "A morning at the fishing village most visitors never reach — market stalls, a lakeside school visit, and coffee with locals.",
      "Purchases made here go straight to village families; the crew can point you to the best keropok on the lake.",
    ],
    tags: ["Culture", "Morning", "Family friendly"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "tembat-river-drift",
    kind: "activities",
    title: "Tembat River Drift",
    images: [media("Kayaks drifting down the Tembat river canyon", "/images/experiences/tembat-kayak.webp")],
    lines: [
      "Engines off, kayaks out — a slow drift down the Tembat river canyon beneath 40-metre trees.",
      "Guided by our crew; suitable for first-time paddlers.",
    ],
    tags: ["Kayak", "Gentle"],
    includedInPackageSlugs: ["4d3n-kenyir-grand-voyage"],
  },
  {
    slug: "night-sounds-cruise",
    kind: "activities",
    title: "Night Sounds Cruise",
    images: [media("Houseboat lit softly at night on the lake", "/images/experiences/night-sounds.webp")],
    lines: [
      "After dinner, we drift with engines off and lights low while the forest calls across the water.",
      "The crew's favourite hour of the trip — bring something warm; the lake cools after dark.",
    ],
    tags: ["Evening", "Wildlife"],
    includedInPackageSlugs: ["3d2n-kenyir-explorer"],
  },
  {
    slug: "sunrise-paddle",
    kind: "activities",
    title: "Sunrise Paddle",
    images: [media("Paddleboarder at sunrise with mist over the lake", "/images/experiences/sunrise-paddle.webp")],
    lines: [
      "An early paddleboard or kayak session as mist lifts off the water — the quietest moment on the lake.",
      "Beginner-friendly boards, or just ride along in the support boat with coffee.",
    ],
    tags: ["Sunrise", "Kayak", "Paddleboard"],
    includedInPackageSlugs: ["4d3n-kenyir-grand-voyage"],
  },
];
