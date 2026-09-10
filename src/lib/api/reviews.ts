import type { Review } from "@/types";

import { MOCK_REVIEWS } from "./mock/reviews";

export async function getAllReviews(): Promise<Review[]> {
  return MOCK_REVIEWS;
}

export async function getReviewsByVessel(vesselId: string): Promise<Review[]> {
  return MOCK_REVIEWS.filter((r) => r.vesselId === vesselId);
}

export async function getReviewsByPackage(packageSlug: string): Promise<Review[]> {
  return MOCK_REVIEWS.filter((r) => r.packageSlug === packageSlug);
}
