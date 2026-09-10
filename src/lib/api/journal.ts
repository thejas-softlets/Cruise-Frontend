import type { JournalArticle } from "@/types";

import { MOCK_ARTICLES } from "./mock/journal";

export async function getAllArticles(): Promise<JournalArticle[]> {
  return [...MOCK_ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleBySlug(slug: string): Promise<JournalArticle | undefined> {
  return MOCK_ARTICLES.find((a) => a.slug === slug);
}

export async function getRelatedArticles(slug: string, limit = 2): Promise<JournalArticle[]> {
  return (await getAllArticles()).filter((a) => a.slug !== slug).slice(0, limit);
}
