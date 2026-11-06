/**
 * Mappers translating Navora API responses into MHG Cruise domain types.
 */

import type { FaqCategory, LakeInfo, Review } from '@/types';
import type {
  NavoraDestinationInfo,
  NavoraFaqItem,
  NavoraReviewItem,
} from './types';

/**
 * Groups a flat array of FAQs by category into `FaqCategory` records.
 */
export function mapNavoraFaqsToCategories(faqs: NavoraFaqItem[]): FaqCategory[] {
  const categoryMap = new Map<string, { id: string; title: string; items: { question: string; answer: string }[] }>();

  faqs.forEach((faq) => {
    const catTitle = faq.category || 'General';
    const catId = catTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        id: catId,
        title: catTitle,
        items: [],
      });
    }

    categoryMap.get(catId)!.items.push({
      question: faq.question,
      answer: faq.answer,
    });
  });

  return Array.from(categoryMap.values());
}

/**
 * Transforms Navora guest review items to the `Review` interface.
 */
export function mapNavoraReviews(reviews: NavoraReviewItem[]): Review[] {
  return reviews.map((r) => ({
    id: r.id,
    guestName: r.guestName,
    guestLocation: r.location,
    rating: r.rating,
    quote: r.quote,
    vesselId: r.vesselId,
    packageSlug: r.packageSlug,
  }));
}

/**
 * Transforms Navora Lake Kenyir destination overview to `LakeInfo`.
 */
export function mapNavoraDestination(dest: NavoraDestinationInfo, fallbackGallery: any[] = []): LakeInfo {
  return {
    overview: dest.overview,
    bestTimeToVisit: dest.bestTimeToVisit,
    gettingThere: {
      byRoad: dest.gettingThereRoad,
      nearestAirport: dest.gettingThereAirport,
      jettyDetails: dest.gettingThereJetty,
    },
    heroGallery: fallbackGallery,
  };
}
