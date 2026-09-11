import { useTranslations } from "next-intl";

import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { Package } from "@/types";
import { formatPrice } from "@/lib/format";

/**
 * Image-only editorial card (§8.3 indicative pricing kept as a quiet overlay
 * line, not a badge chip).
 */
export function PackageCard({ pkg }: { pkg: Package }) {
  const tc = useTranslations("common");

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:ring-gold/30"
    >
      <PlaceholderMedia
        asset={pkg.heroImage}
        className="aspect-[3/4] w-full"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-108 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/45 to-transparent transition-opacity duration-500 group-hover:from-obsidian/95 group-hover:via-obsidian/60"
      />
      {/* Duration caption */}
      <p className="font-secondary absolute left-5 top-5 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/90">
        {pkg.durationLabel}
      </p>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <h3 className="font-display max-w-sm text-3xl font-normal leading-tight text-[#F4F4F6] sm:text-4xl group-hover:text-white transition-colors duration-300">
          {pkg.title}
        </h3>
        <p className="font-body mt-3 text-[0.8125rem] tracking-wide text-white/75">
          {tc("from")}{" "}
          <span className="font-secondary text-xl font-bold text-gold-bright">
            {formatPrice(pkg.fromPriceMYR)}
          </span>{" "}
          {tc("perPax")}
        </p>
      </div>
    </Link>
  );
}
