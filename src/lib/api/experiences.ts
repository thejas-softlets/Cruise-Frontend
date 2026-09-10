import type { Experience, ExperienceKind } from "@/types";

import { MOCK_EXPERIENCES } from "./mock/experiences";

export async function getAllExperiences(): Promise<Experience[]> {
  return MOCK_EXPERIENCES;
}

export async function getExperiencesByKind(kind: ExperienceKind): Promise<Experience[]> {
  return MOCK_EXPERIENCES.filter((e) => e.kind === kind);
}

export async function getExperienceBySlug(
  slug: string,
  kind?: ExperienceKind,
): Promise<Experience | undefined> {
  return MOCK_EXPERIENCES.find((e) => e.slug === slug && (!kind || e.kind === kind));
}

export async function getExperiencesBySlugs(slugs: string[]): Promise<Experience[]> {
  return MOCK_EXPERIENCES.filter((e) => slugs.includes(e.slug));
}
