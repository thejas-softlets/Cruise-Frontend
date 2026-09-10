import type { GalleryCategory, GalleryItem } from "@/types";

import { MOCK_GALLERY } from "./mock/gallery";

export async function getGalleryItems(category?: GalleryCategory): Promise<GalleryItem[]> {
  if (category) return MOCK_GALLERY.filter((g) => g.category === category);
  return MOCK_GALLERY;
}
