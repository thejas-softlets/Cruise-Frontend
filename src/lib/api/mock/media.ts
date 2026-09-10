import type { MediaAsset } from "@/types";

/**
 * Builds a MediaAsset. When `src` is provided (a path under /images), real
 * photos render via next/image; when null the branded "photo coming soon"
 * placeholder shows instead.
 */
export function media(alt: string, src?: string | null, width = 1600, height = 1000): MediaAsset {
  return { src: src ?? null, alt, width, height };
}
