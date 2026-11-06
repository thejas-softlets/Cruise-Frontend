import type { Package } from "@/types";
import { getNavoraPackages } from "@/lib/navora/client";

import { MOCK_PACKAGES } from "./mock/packages";

export async function getAllPackages(): Promise<Package[]> {
  try {
    const remote = await getNavoraPackages();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return remote.map((p) => {
        const local = MOCK_PACKAGES.find((m) => m.slug === p.slug);
        const fromPrice =
          typeof p.fromPriceMYR === 'number'
            ? p.fromPriceMYR
            : typeof p.packageCost === 'number'
            ? p.packageCost
            : Number(p.packageCost) || local?.fromPriceMYR || 1000;
        return {
          slug: p.slug || local?.slug || 'package',
          title: p.title || p.categoryName || local?.title || 'Kenyir Lake Cruise',
          vesselId: p.vesselId || local?.vesselId || 'summer-cruise',
          durationNights: p.durationNights || local?.durationNights || 2,
          durationLabel: p.durationLabel || local?.durationLabel || '3 Days 2 Nights',
          fromPriceMYR: fromPrice,
          customPriceLabel: p.customPriceLabel || local?.customPriceLabel,
          heroImage: p.heroImage || local?.heroImage || { src: null, alt: p.title || 'Package', width: 1920, height: 1080 },
          overview: p.overview || p.shortDescription || local?.overview || '',
          highlights: p.highlights || local?.highlights || [],
          itinerary: p.itinerary || local?.itinerary || [],
          seasonalItineraries: p.seasonalItineraries || local?.seasonalItineraries,
          pdfUrl: p.brochurePdfUrl || p.pdfUrl || local?.pdfUrl,
          inclusions: p.inclusions || p.inclusionsList || local?.inclusions || [],
          exclusions: p.exclusions || p.exclusionsList || local?.exclusions || [],
          roomCategoryIds: p.roomCategoryIds || local?.roomCategoryIds || [],
          experienceSlugs: p.experienceSlugs || local?.experienceSlugs || [],
          isPlaceholder: true,
        };
      });
    }
  } catch (err) {
    console.warn("[Packages] Failed to fetch dynamic packages from Navora, using fallback:", err);
  }
  return MOCK_PACKAGES;
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  const all = await getAllPackages();
  return all.find((p) => p.slug === slug);
}

export interface PackageFilters {
  vessel?: string;
  duration?: string;
  room?: string;
}

export async function getFilteredPackages(filters: PackageFilters): Promise<Package[]> {
  const list = await getAllPackages();
  let result = [...list];

  if (filters.vessel) {
    result = result.filter((p) => p.vesselId === filters.vessel);
  }
  if (filters.duration) {
    const nights = parseInt(filters.duration, 10);
    result = result.filter((p) => Number.isFinite(nights) && p.durationNights === nights);
  }
  if (filters.room) {
    const room = filters.room;
    result = result.filter((p) => p.roomCategoryIds.includes(room));
  }

  return result;
}
