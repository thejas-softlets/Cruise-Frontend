import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PackageCard } from "@/components/cards/PackageCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { getVesselById, getAllVessels } from "@/lib/api/vessels";
import { getRoomsByVessel } from "@/lib/api/rooms";
import { getReviewsByVessel } from "@/lib/api/reviews";
import { getAllPackages } from "@/lib/api/packages";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const vessels = await getAllVessels();
  return vessels.map((v) => ({ id: v.id }));
}

export default async function VesselDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vessel = await getVesselById(id);
  if (!vessel) notFound();

  const t = await getTranslations("vessels");
  const tp = await getTranslations("packages");
  const tRoot = await getTranslations();

  const [rooms, reviews, packages] = await Promise.all([
    getRoomsByVessel(vessel.id),
    getReviewsByVessel(vessel.id),
    getAllPackages().then((all) => all.filter((p) => vessel.packageSlugs.includes(p.slug))),
  ]);

  const crumbs = await buildCrumbs(["vessels", id], { [`/vessels/${id}`]: vessel.name });

  return (
    <div>
      <PageHero
        asset={vessel.heroImage}
        title={vessel.name}
        line={vessel.tagline}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <p className="max-w-2xl pt-14 text-lg leading-relaxed text-text-muted">{vessel.statLine}</p>

        {/* On-board gallery */}
        <section className="pt-14">
          <h2 className="font-display text-3xl font-medium">{t("galleryTitle")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vessel.gallery.map((asset, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="group relative overflow-hidden rounded-3xl bg-obsidian shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl">
                  <PlaceholderMedia
                    asset={asset}
                    className="aspect-[4/3]"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section className="pt-20">
          <h2 className="font-display text-3xl font-medium">{tp("rooms")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, i) => (
              <FadeIn key={room.id} delay={i * 0.06}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white">
                  <PlaceholderMedia
                    asset={room.image}
                    className="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-medium">{room.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                      {room.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {room.amenities.map((a) => (
                        <li
                          key={a}
                          className="rounded-full bg-bg-base px-2.5 py-1 text-xs text-text-muted"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink/8 pt-4">
                      <p className="text-sm text-text-muted">
                        {tp("occupancy", { count: room.occupancy })}
                      </p>
                      <p className="text-sm text-text-muted">
                        {tRoot("common.indicative")} ·{" "}
                        <span className="font-semibold text-ink">
                          {formatPrice(room.indicativePriceMYR)}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Cruises on this vessel */}
        <section className="pt-20">
          <h2 className="font-display text-3xl font-medium">{t("detailCta")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.slug} delay={i * 0.06}>
                <PackageCard pkg={pkg} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <section className="pt-20">
            <h2 className="font-display text-3xl font-medium">{tp("reviews")}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <FadeIn key={review.id} delay={i * 0.06}>
                  <ReviewCard review={review} />
                </FadeIn>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap gap-4 pt-16">
          <Button href={`/packages?vessel=${vessel.id}`} size="lg">
            {t("detailCta")}
          </Button>
          {vessel.id === "green-horizon" && (
            <Button href="/book/green-horizon" size="lg" variant="ghost">
              Visual Cabin Selection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
