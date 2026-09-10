import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/ArticleCard";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/api/journal";
import { getPackageBySlug } from "@/lib/api/packages";
import { getTranslations, getLocale } from "next-intl/server";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations("journal");
  const locale = await getLocale();

  const [related, relatedPackage] = await Promise.all([
    getRelatedArticles(article.slug),
    article.relatedPackageSlug ? getPackageBySlug(article.relatedPackageSlug) : undefined,
  ]);

  const crumbs = await buildCrumbs(["journal", slug], { [`/journal/${slug}`]: article.title });

  return (
    <div>
      <PageHero
        asset={article.coverImage}
        title={article.title}
        line={`${article.tag} · ${formatDate(article.date, locale)}`}
        crumbs={crumbs}
        size="lg"
      />

      <article className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-2xl space-y-6 pt-14 text-lg leading-relaxed text-text-muted">
          {article.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Related package CTA */}
        {relatedPackage ? (
          <section className="mx-auto mt-20 max-w-2xl rounded-3xl border border-gold/25 bg-gold/8 p-10 text-center">
            <p className="font-script text-2xl text-gold-bright">{t("ctaTitle")}</p>
            <h2 className="font-display mt-2 text-2xl font-medium">{t("ctaLine")}</h2>
            <div className="mt-8 flex justify-center">
              <Button href={`/packages/${relatedPackage.slug}`} size="lg">
                {relatedPackage.title}
              </Button>
            </div>
          </section>
        ) : null}

        {/* Keep reading */}
        <section className="pt-20">
          <h2 className="font-display text-3xl font-medium">{t("relatedTitle")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
