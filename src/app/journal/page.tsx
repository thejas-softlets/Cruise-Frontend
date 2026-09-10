import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/components/cards/ArticleCard";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { getAllArticles } from "@/lib/api/journal";
import { media } from "@/lib/api/mock/media";

export default async function JournalHubPage() {
  const t = await getTranslations("journal");
  const [articles, crumbs] = await Promise.all([getAllArticles(), buildCrumbs(["journal"])]);

  return (
    <>
      <PageHero
        asset={articles[0]?.coverImage ?? media("Morning light over Kenyir Lake", "/images/page-heroes/hero-journal.webp")}
        title={t("hubTitle")}
        line={t("hubLine")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-6 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn key={article.slug} delay={i * 0.06}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
