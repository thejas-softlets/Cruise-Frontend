import type { Offer } from "@/types";

import { media } from "./media";

/** The eight offers from plan §11.7 — this business's own levers, not Aqua's. */
export const MOCK_OFFERS: Offer[] = [
  {
    slug: "early-bird",
    title: "Early Bird",
    shortTag: "Save up to 15%",
    heroImage: media("Sunrise over Kenyir Lake", "/images/offers/offer-sunrise.webp"),
    eligibility: ["Book 60+ days before your travel date"],
    discountSummary:
      "15% off the package price when you book at least 60 days ahead. Deposit due within 7 days of quotation.",
    validDateRange: { start: "2026-09-01", end: "2027-08-31" },
    applicablePackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
    terms: [
      "Discount applies to the package price only, not add-ons.",
      "Cannot be combined with other offers.",
      "Dates subject to availability at time of quotation.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "family-getaway",
    title: "Family Getaway",
    shortTag: "Kids stay 50% off",
    heroImage: media("Family splashing off the houseboat deck", "/images/offers/offer-family.webp"),
    eligibility: ["Families with children aged 4–12", "Minimum 2 adults"],
    discountSummary:
      "Children aged 4–12 receive 50% off the per-person rate in the Family Room. Cots and kids' life jackets included at no charge.",
    applicablePackageSlugs: ["3d2n-kenyir-explorer"],
    terms: [
      "Applies to the Family Room category only.",
      "Up to 2 discounted children per booking.",
      "Not valid with Local Resident Discount.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "honeymoon-and-romantic",
    title: "Honeymoon & Romantic",
    shortTag: "Complimentary couples' extras",
    heroImage: media("Couple watching sunset from the houseboat deck", "/images/offers/offer-romantic.webp"),
    eligibility: ["Couples on any 2-night-or-longer cruise"],
    discountSummary:
      "Complimentary room upgrade (when available), floating lantern dinner on your final evening, and a late checkout on board.",
    applicablePackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
    terms: [
      "Upgrade subject to availability on the day of boarding.",
      "Mention the occasion at enquiry so the crew can prepare.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "corporate-and-team-building",
    title: "Corporate & Team Building",
    shortTag: "Group rates from 10 pax",
    heroImage: media("Team activity on the upper deck", "/images/offers/offer-corporate.webp"),
    eligibility: ["Corporate groups of 10 or more"],
    discountSummary:
      "10% off full-boat charter, plus a facilitated half-day team program (kayak relay, shoreline clean-up challenge, or night navigation walk) at no extra cost.",
    applicablePackageSlugs: ["4d3n-kenyir-grand-voyage"],
    terms: [
      "Available midweek (Sunday–Thursday departures).",
      "Team program selected at least 14 days before departure.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "festive-and-school-holiday",
    title: "Festive & School Holiday Special",
    shortTag: "4th night free",
    heroImage: media("Lanterns strung across the houseboat deck at night", "/images/offers/offer-festive.webp"),
    eligibility: ["Travel during gazetted Malaysian school holidays and festive periods"],
    discountSummary:
      "Book 4D3N and receive a complimentary 4th night on board, plus festive-themed meals and activities for the kids.",
    validDateRange: { start: "2026-11-15", end: "2027-01-04" },
    applicablePackageSlugs: ["4d3n-kenyir-grand-voyage"],
    terms: [
      "Extra night is on board, moored at a sheltered cove.",
      "Minimum 2 rooms to qualify.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "local-resident-discount",
    title: "Local Resident Discount",
    shortTag: "20% with Malaysian IC",
    heroImage: media("Guests waving from the deck of a houseboat", "/images/offers/offer-local.webp"),
    eligibility: ["Malaysian IC holders"],
    discountSummary:
      "20% off any package for Malaysian citizens — our thanks to the neighbours who share this lake with us.",
    applicablePackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
    terms: [
      "IC shown at check-in.",
      "Valid any day of the week.",
      "Cannot be combined with Early Bird.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "group-booking-discount",
    title: "Group Booking Discount",
    shortTag: "1 free place per 10",
    heroImage: media("Large group gathered on the houseboat deck", "/images/offers/offer-group.webp"),
    eligibility: ["Groups of 10 or more travelling together"],
    discountSummary:
      "One complimentary place for every 10 paying guests — the organiser cruises free.",
    applicablePackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
    terms: [
      "Free place covers cruise only, not transport to the jetty.",
      "Applies to bookings made as a single group reservation.",
    ],
    isPlaceholder: true,
  },
  {
    slug: "returning-guest-perks",
    title: "Returning Guest Perks",
    shortTag: "Come back for less",
    heroImage: media("Returning guest greeted by the crew at the jetty", "/images/offers/offer-returning.webp"),
    eligibility: ["Anyone who has cruised with us before"],
    discountSummary:
      "10% off your next cruise, priority for new-departure dates before they go public, and a welcome-back dinner dish of your choice.",
    applicablePackageSlugs: ["3d2n-kenyir-explorer", "4d3n-kenyir-grand-voyage"],
    terms: [
      "Mention your previous booking code at enquiry.",
      "Not combinable with Early Bird.",
    ],
    isPlaceholder: true,
  },
];
