import type { Offer } from "@/types";

import { MOCK_OFFERS } from "./mock/offers";

export async function getAllOffers(): Promise<Offer[]> {
  return MOCK_OFFERS;
}

export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  return MOCK_OFFERS.find((o) => o.slug === slug);
}
