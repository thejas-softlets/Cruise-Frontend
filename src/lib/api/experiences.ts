import type { Experience, ExperienceKind } from "@/types";
import { navoraFetch } from "@/lib/navora/client";
import { mapNavoraExperienceToDomain } from "@/lib/navora/mappers";
import type { NavoraExperienceItem } from "@/lib/navora/types";
import { MOCK_EXPERIENCES } from "./mock/experiences";

export async function getAllExperiences(): Promise<Experience[]> {
  const dynamic = await navoraFetch<NavoraExperienceItem[]>("/api/public/storefront/experiences");
  if (dynamic && dynamic.length > 0) {
    return dynamic.map(mapNavoraExperienceToDomain);
  }
  return MOCK_EXPERIENCES;
}

export async function getExperiencesByKind(kind: ExperienceKind): Promise<Experience[]> {
  const all = await getAllExperiences();
  return all.filter((e) => e.kind === kind);
}

export async function getExperienceBySlug(
  slug: string,
  kind?: ExperienceKind,
): Promise<Experience | undefined> {
  const all = await getAllExperiences();
  return all.find((e) => e.slug === slug && (!kind || e.kind === kind));
}

export async function getExperiencesBySlugs(slugs: string[]): Promise<Experience[]> {
  const all = await getAllExperiences();
  return all.filter((e) => slugs.includes(e.slug));
}
