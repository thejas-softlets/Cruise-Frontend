import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import { getGalleryItems } from "@/lib/api/gallery";
import { media } from "@/lib/api/mock/media";
import type { GalleryCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: GalleryCategory[] = ["vessels", "rooms", "lake", "experiences", "guests"];

/** Gallery: cinematic hero, compact category chips, masonry grid. */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const t = await getTranslations("gallery");
  const params = await searchParams;
  const activeCat = CATEGORIES.includes(params.cat as GalleryCategory)
    ? (params.cat as GalleryCategory)
    : undefined;

  const [items, crumbs] = await Promise.all([
    getGalleryItems(activeCat),
    buildCrumbs(["gallery"]),
  ]);

  return (
    <>
      <PageHero
        asset={items[0]?.media ?? media("Kenyir Lake gallery", "/images/page-heroes/hero-gallery.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="-mt-7 flex flex-wrap gap-2 rounded-3xl bg-white/95 p-3 shadow-xl shadow-ink/8 backdrop-blur">
          <CatChip href="/gallery" active={!activeCat}>
            {t("all")}
          </CatChip>
          {CATEGORIES.map((c) => (
            <CatChip key={c} href={`/gallery?cat=${c}`} active={activeCat === c}>
              {t(`cat.${c}`)}
            </CatChip>
          ))}
        </div>

        <div className="mt-14 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={(i % 8) * 0.05}>
              <figure className="break-inside-avoid">
                <PlaceholderMedia
                  asset={item.media}
                  className={cn(
                    "w-full rounded-3xl",
                    i % 5 === 0 ? "aspect-[4/5]" : "aspect-square",
                  )}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {item.caption ? (
                  <figcaption className="mt-1.5 px-1 text-xs text-text-muted">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}

function CatChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "font-secondary inline-flex min-h-9 items-center rounded-full border px-3.5 text-[0.8125rem] font-semibold uppercase tracking-wider transition-colors duration-300",
        active
          ? "border-obsidian bg-obsidian text-white"
          : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
