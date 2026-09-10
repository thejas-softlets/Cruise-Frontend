/**
 * Static brand/story content whose copy is authored in the message files,
 * not structured backend data (§11.16). Kept separate from `lib/api` mock
 * data so Phase 5 wiring stays untouched.
 */
export const ABOUT_PAGES: { slug: string; sections: string[] }[] = [
  { slug: "our-story", sections: ["beginnings", "growth", "today"] },
  { slug: "sustainability", sections: ["lake", "community", "wildlife"] },
  { slug: "safety-and-wellbeing", sections: ["crew", "equipment", "weather"] },
  { slug: "dining-and-cuisine", sections: ["meals", "dietary", "occasions"] },
];
