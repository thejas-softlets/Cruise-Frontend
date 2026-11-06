import type { Review } from "@/types";
import { getNavoraMarketingContent } from "@/lib/navora/client";
import { mapNavoraReviews } from "@/lib/navora/mappers";

import { MOCK_REVIEWS } from "./mock/reviews";

export async function getAllReviews(): Promise<Review[]> {
  try {
    const content = await getNavoraMarketingContent();
    if (content?.reviews && content.reviews.length > 0) {
      return mapNavoraReviews(content.reviews);
    }
  } catch (err) {
    console.warn("[Reviews] Failed to fetch dynamic reviews from Navora, using fallback:", err);
  }
  return MOCK_REVIEWS;
}

export async function getReviewsByVessel(vesselId: string): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter((r) => r.vesselId === vesselId);
}

export async function getReviewsByPackage(packageSlug: string): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter((r) => r.packageSlug === packageSlug);
}
