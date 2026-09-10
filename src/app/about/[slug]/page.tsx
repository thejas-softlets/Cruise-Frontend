import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { ABOUT_PAGES } from "@/lib/about";
import { getTranslations } from "next-intl/server";
import { media } from "@/lib/api/mock/media";

export function generateStaticParams() {
  return ABOUT_PAGES.map((p) => ({ slug: p.slug }));
}

export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = ABOUT_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  const crumbs = await buildCrumbs(["about", slug], {
    [`/about/${slug}`]: t(`pages.${slug}.title` as const),
  });

  const sections = page.sections.map((key) => ({
    key,
    title: t(`pages.${slug}.sections.${key}.title` as const),
    body: t(`pages.${slug}.sections.${key}.body` as const),
  }));

  return (
    <div>
      <PageHero
        asset={media("Life on board a Summer Cruise houseboat", "/images/page-heroes/hero-about-slug.webp")}
        title={t(`pages.${slug}.title` as const)}
        line={t(`pages.${slug}.intro` as const)}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="max-w-2xl space-y-12 pt-14">
          {sections.map((section, i) => (
            <FadeIn key={section.key} delay={i * 0.05}>
              <section>
                <h2 className="font-display text-3xl font-medium">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">{section.body}</p>
              </section>
            </FadeIn>
          ))}
        </div>

        <div className="pt-16">
          <Button href="/contact" size="lg">
            {tc("enquireNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
