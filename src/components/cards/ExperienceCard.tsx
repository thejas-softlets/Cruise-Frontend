import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { Experience } from "@/types";

/** Image-only experience card. */
export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link
      href={`/experiences/${experience.kind}/${experience.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian"
    >
      <PlaceholderMedia
        asset={experience.images[0]}
        className="aspect-[3/4] sm:aspect-[4/3]"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="font-display text-2xl font-normal text-[#F4F4F6] sm:text-3xl">
          {experience.title}
        </h3>
        {experience.tags.length > 0 ? (
          <p className="font-secondary mt-1.5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/75">
            {experience.tags.join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
