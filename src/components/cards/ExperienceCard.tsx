import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { Experience } from "@/types";

/** Image-only experience card. */
export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link
      href={`/experiences/${experience.kind}/${experience.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:ring-gold/30"
    >
      <PlaceholderMedia
        asset={experience.images[0]}
        className="aspect-[3/4] w-full"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-108 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/45 to-transparent transition-opacity duration-500 group-hover:from-obsidian/95 group-hover:via-obsidian/60"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <h3 className="font-display text-2xl font-normal text-[#F4F4F6] sm:text-3xl group-hover:text-white transition-colors duration-300">
          {experience.title}
        </h3>
        {experience.tags.length > 0 ? (
          <p className="font-secondary mt-1.5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/80 group-hover:text-gold-bright transition-colors duration-300">
            {experience.tags.join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
