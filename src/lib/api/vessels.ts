import type { Vessel } from "@/types";
import { getNavoraVessels } from "@/lib/navora/client";

import { MOCK_VESSELS } from "./mock/vessels";

export async function getAllVessels(): Promise<Vessel[]> {
  try {
    const remote = await getNavoraVessels();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      // Map remote vessels or merge with mock assets
      return remote.map((v) => {
        const local = MOCK_VESSELS.find((m) => m.id === v.id || m.name.toLowerCase() === v.name?.toLowerCase());
        return {
          id: v.id || local?.id || 'vessel',
          name: v.name || local?.name || 'Luxury Lake Cruise',
          tagline: v.tagline || local?.tagline || '',
          heroImage: v.heroImage || local?.heroImage || { src: null, alt: v.name, width: 1920, height: 1080 },
          gallery: v.gallery || local?.gallery || [],
          capacity: v.capacity || local?.capacity || 40,
          crewCount: v.crewCount || local?.crewCount || 10,
          roomCount: v.roomCount || local?.roomCount || 12,
          statLine: v.statLine || local?.statLine || '',
          highlights: v.highlights || local?.highlights || [],
          packageSlugs: v.packageSlugs || local?.packageSlugs || [],
        };
      });
    }
  } catch (err) {
    console.warn("[Vessels] Failed to fetch dynamic vessels from Navora, using fallback:", err);
  }
  return MOCK_VESSELS;
}

export async function getVesselById(id: string): Promise<Vessel | undefined> {
  const all = await getAllVessels();
  return all.find((v) => v.id === id);
}
