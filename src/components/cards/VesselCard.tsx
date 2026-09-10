import { useTranslations } from "next-intl";

import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { Vessel } from "@/types";

/**
 * Image-only editorial card: the media IS the card. Title and one stat line
 * sit on a scrim over the image; hover zooms slowly (700ms). No white block,
 * no badges.
 */
export function VesselCard({ vessel }: { vessel: Vessel }) {
  const t = useTranslations("vessels");

  return (
    <Link
      href={`/vessels/${vessel.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian"
    >
      <PlaceholderMedia
        asset={vessel.heroImage}
        className="aspect-[3/4] sm:aspect-[4/3]"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Scrim only where the text sits — strongest at the bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="font-secondary text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-bright/90">
          {t("capacity", { count: vessel.capacity })} · {t("rooms", { count: vessel.roomCount })}
        </p>
        <h3 className="font-display mt-2 text-3xl font-normal text-[#F4F4F6] sm:text-4xl">
          {vessel.name}
        </h3>
        <p className="font-body mt-2 max-w-md text-sm leading-relaxed text-white/75 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:opacity-100 max-sm:hidden">
          {vessel.tagline}
        </p>
      </div>
    </Link>
  );
}
