import type { GiftVoucherOption, LakeInfo } from "@/types";

import { media } from "./media";

export const MOCK_LAKE: LakeInfo = {
  overview:
    "Kenyir is one of the largest man-made lakes in Southeast Asia — 260,000 hectares of flooded rainforest dotted with more than 340 islands. What that means on a cruise: wide open water that suddenly narrows into river canyons, waterfalls you can hear before you see, and evenings where the only sounds are the forest and the water.",
  bestTimeToVisit:
    "March to October is the drier, calmer window — best for swimming and first-time cruisers. November to February brings afternoon showers, quieter waters and the most dramatic skies. Every season has its own kind of perfect; tell us what you want from the trip and we'll suggest dates honestly.",
  gettingThere: {
    byRoad:
      "From Kuala Lumpur, take the E8 (Karak Highway) and LEKAS on to Highway 14 toward Kuala Berang — roughly 4.5 to 5.5 hours total. From Kuala Terengganu city, it's about 1 hour by car or taxi to the jetty.",
    nearestAirport:
      "Sultan Mahmud Airport (Kuala Terengganu, TGG) — about 1 hour from the jetty. Daily flights from Kuala Lumpur and Singapore. We can arrange a driver to meet you: just ask when you enquire.",
    jettyDetails:
      "All cruises depart from Pengkalan Gawi Jetty, Tasik Kenyir. Free parking is available at the jetty. Be there by 9:45am on departure day — look for the Summer Cruise crew in teal shirts at the main gate.",
  },
  heroGallery: [
    media("Aerial view of Kenyir Lake islands", "/images/lake/kenyir-aerial.webp"),
    media("Rainforest shoreline at first light", "/images/lake/kenyir-shoreline.webp"),
    media("Houseboat dwarfed by the lake at dusk", "/images/lake/kenyir-dusk.webp"),
  ],
};

export const MOCK_VOUCHERS: GiftVoucherOption[] = [
  {
    id: "voucher-100",
    amountMYR: 100,
    isPlaceholder: true,
    description: "A contribution toward any cruise — pairs well with everything.",
  },
  {
    id: "voucher-250",
    amountMYR: 250,
    isPlaceholder: true,
    description: "Covers a couple's afternoon tea, transfers, or a good chunk of a night on board.",
  },
  {
    id: "voucher-500",
    amountMYR: 500,
    isPlaceholder: true,
    description: "Most of a night's cruise for two — the gift people actually remember.",
  },
  {
    id: "voucher-1000",
    amountMYR: 1000,
    isPlaceholder: true,
    description: "A full night on board for two, or two nights for one very lucky person.",
  },
];

export const MOCK_FAQS: { id: string; question: string; answer: string }[] = [
  { id: "faq-book-1", question: "How do I book?", answer: "Enquire through any page on this site, message us on WhatsApp, or call us. We reply with a personalised quote, and you confirm with a 30% deposit." },
  { id: "faq-book-2", question: "Do I need to create an account?", answer: "No. You never need an account to browse, enquire, book or check in." },
  { id: "faq-book-3", question: "Can I book entirely through WhatsApp?", answer: "Yes — many guests do exactly that, from first question to boarding time." },
  { id: "faq-book-4", question: "What are your payment methods?", answer: "Bank transfer, credit/debit card, or cash at our office near the jetty. Payment details come with your quote." },
  { id: "faq-pay-1", question: "When is the balance due?", answer: "The 30% deposit confirms your booking; the balance is due 14 days before departure." },
  { id: "faq-pay-2", question: "What is your cancellation policy?", answer: "More than 30 days before departure: full deposit refund. 14–30 days: 50% of the deposit. Within 14 days: deposit non-refundable, but we'll move your booking once to another date, free." },
  { id: "faq-onboard-1", question: "Is there phone signal on the lake?", answer: "Patchy. Signal fades within the first hour and returns near the jetty. Most guests call it the best feature of the trip — tell your office before you board." },
  { id: "faq-onboard-2", question: "Is the food halal?", answer: "Yes — everything on board is halal, prepared fresh by our on-board chefs. Vegetarian and kids' portions are always available; just tell us at enquiry." },
  { id: "faq-onboard-3", question: "Can children come on board?", answer: "Absolutely — children of all ages are welcome. Family Rooms book out first every school holiday, so enquire early. Life jackets are mandatory for all water activities." },
  { id: "faq-onboard-4", question: "Will I get seasick?", answer: "Almost certainly not — Kenyir is a calm freshwater lake and we anchor in sheltered coves every night. If you're prone to motion sickness generally, bring your usual remedy just in case." },
  { id: "faq-checkin-1", question: "How does check-in work?", answer: "Once online check-in opens (30 days before departure), enter just your booking code and last name on the check-in page. Until then, nothing is needed — we'll WhatsApp or email you when it opens." },
  { id: "faq-checkin-2", question: "What time do we board?", answer: "Be at Pengkalan Gawi Jetty by 9:45am on departure day. Look for the Summer Cruise crew in teal shirts at the main gate." },
];
