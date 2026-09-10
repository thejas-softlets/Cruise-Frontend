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
      className="group relative block overflow-hidden rounded-2xl bg-obsidian"
    >
      <PlaceholderMedia
        asset={article.coverImage}
        className="aspect-[3/4] sm:aspect-[4/3]"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <p className="font-secondary text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-bright/90">
          {article.tag} · <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
        </p>
        <h3 className="font-display mt-2 text-2xl font-normal leading-snug text-[#F4F4F6] sm:text-[1.75rem]">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
