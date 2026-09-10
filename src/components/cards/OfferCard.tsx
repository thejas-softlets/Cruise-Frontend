import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { Offer } from "@/types";

/** Image-only offer card: title + shortTag on the scrim, nothing else (§11.6). */
export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian"
    >
      <PlaceholderMedia
        asset={offer.heroImage}
        className="aspect-[3/4] sm:aspect-[4/3]"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <h3 className="font-display text-2xl font-medium text-[#F4F4F6] sm:text-3xl">
          {offer.title}
        </h3>
        <p className="font-script mt-1.5 text-xl leading-tight text-gold-bright">
          {offer.shortTag}
        </p>
      </div>
    </Link>
  );
}
