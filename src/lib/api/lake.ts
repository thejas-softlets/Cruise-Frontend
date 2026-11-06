import type { LakeInfo } from "@/types";
import { getNavoraMarketingContent } from "@/lib/navora/client";
import { mapNavoraDestination } from "@/lib/navora/mappers";

import { MOCK_LAKE } from "./mock/lake";

export async function getLakeInfo(): Promise<LakeInfo> {
  try {
    const content = await getNavoraMarketingContent();
    if (content?.destination && content.destination.overview) {
      return mapNavoraDestination(content.destination, MOCK_LAKE.heroGallery);
    }
  } catch (err) {
    console.warn("[Lake] Failed to fetch dynamic destination guide from Navora, using fallback:", err);
  }
  return MOCK_LAKE;
}
