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

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-6">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={(i % 8) * 0.04}>
              <figure className="group relative block overflow-hidden rounded-3xl bg-obsidian shadow-sm transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/20 break-inside-avoid">
                <PlaceholderMedia
                  asset={item.media}
                  className={cn(
                    "w-full",
                    i % 5 === 0 ? "aspect-[4/5]" : i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]",
                  )}
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Gradient mask: subtle baseline readability, deepening seamlessly on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/40 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
                />
                {/* Card overlay content */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 transition-transform duration-500 ease-out">
                  <p className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-bright transition-colors duration-300">
                    {t(`cat.${item.category}`)}
                  </p>
                  {item.caption ? (
                    <p className="font-display mt-1 text-xl font-medium leading-snug text-[#F6F5F1] drop-shadow-sm transition-all duration-500 group-hover:text-white sm:text-2xl">
                      {item.caption}
                    </p>
                  ) : null}
                </figcaption>
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
