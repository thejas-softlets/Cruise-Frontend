import { useLocale } from "next-intl";

import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Link } from "@/lib/i18n/navigation";
import type { JournalArticle } from "@/types";
import { formatDate } from "@/lib/utils";

/** Image-only journal card: tag and date as an editorial overlay line. */
export function ArticleCard({ article }: { article: JournalArticle }) {
  const locale = useLocale();

  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-obsidian ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:ring-gold/30"
    >
      <PlaceholderMedia
        asset={article.coverImage}
        className="aspect-[3/4] w-full"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-108 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/45 to-transparent transition-opacity duration-500 group-hover:from-obsidian/95 group-hover:via-obsidian/60"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <p className="font-secondary text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-bright/90 group-hover:text-gold transition-colors duration-300">
          {article.tag} · <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
        </p>
        <h3 className="font-display mt-2 text-2xl font-normal leading-snug text-[#F4F4F6] sm:text-[1.75rem] group-hover:text-white transition-colors duration-300">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
