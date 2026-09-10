import type { Package } from "@/types";

import { MOCK_PACKAGES } from "./mock/packages";

export async function getAllPackages(): Promise<Package[]> {
  return MOCK_PACKAGES;
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  return MOCK_PACKAGES.find((p) => p.slug === slug);
}

export interface PackageFilters {
  vessel?: string;
  duration?: string;
  room?: string;
}

export async function getFilteredPackages(filters: PackageFilters): Promise<Package[]> {
  let list = [...MOCK_PACKAGES];

  if (filters.vessel) {
    list = list.filter((p) => p.vesselId === filters.vessel);
  }
  if (filters.duration) {
    const nights = parseInt(filters.duration, 10);
    list = list.filter((p) => Number.isFinite(nights) && p.durationNights === nights);
  }
  if (filters.room) {
    const room = filters.room;
    list = list.filter((p) => p.roomCategoryIds.includes(room));
  }

  return list;
}
