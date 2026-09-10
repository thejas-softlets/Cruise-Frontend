import { getTranslations } from "next-intl/server";

import { ReviewCard } from "@/components/cards/ReviewCard";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Link } from "@/lib/i18n/navigation";
import { getAllReviews } from "@/lib/api/reviews";
import { getAllVessels } from "@/lib/api/vessels";
import { media } from "@/lib/api/mock/media";
import { cn } from "@/lib/utils";

/** Guest reviews: verbatim quotes, vessel filter via shareable links. */
export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ vessel?: string }>;
}) {
  const t = await getTranslations("reviews");
  const params = await searchParams;
  const vessel = params.vessel;

  const [allReviews, vessels, crumbs] = await Promise.all([
    getAllReviews(),
    getAllVessels(),
    buildCrumbs(["reviews"]),
  ]);

  const reviews = vessel ? allReviews.filter((r) => r.vesselId === vessel) : allReviews;

  return (
    <>
      <PageHero
        asset={media("Guests on the deck of a houseboat at sunset", "/images/page-heroes/hero-reviews.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="-mt-7 flex flex-wrap gap-2 rounded-3xl bg-white/95 p-3 shadow-xl shadow-ink/8 backdrop-blur">
          <Chip href="/reviews" active={!vessel}>
            {t("filterAll")}
          </Chip>
          {vessels.map((v) => (
            <Chip key={v.id} href={`/reviews?vessel=${v.id}`} active={vessel === v.id}>
              {v.name}
            </Chip>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <FadeIn key={review.id} delay={(i % 6) * 0.06}>
              <ReviewCard review={review} />
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors duration-300",
        active
          ? "border-obsidian bg-obsidian text-white"
          : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
