import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { FadeIn, ParallaxImage } from "@/components/motion";
import type { MediaAsset } from "@/types";

/**
 * The editorial signature on every page: a huge cinematic image band with the
 * page title living on it. One consistent opening frame across the site.
 */
export async function PageHero({
  asset,
  title,
  line,
  script,
  crumbs,
  size = "md",
}: {
  asset: MediaAsset;
  title: string;
  line?: string;
  script?: string;
  crumbs?: Crumb[];
  size?: "md" | "lg";
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-obsidian ${
        size === "lg" ? "min-h-[82svh]" : "min-h-[58svh]"
      } pb-16 pt-40`}
    >
      <ParallaxImage asset={asset} className="absolute inset-0 h-[115%]" priority />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/35 to-obsidian/20"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {crumbs ? (
          <div className="print:hidden">
            <Breadcrumbs crumbs={crumbs} light />
          </div>
        ) : null}
        <FadeIn>
          {script ? (
            <p className="font-script mt-6 text-3xl text-gold sm:text-4xl">{script}</p>
          ) : null}
          <h1
            className={`font-display mt-2 max-w-3xl font-medium leading-[1.04] text-[#F6F5F1] text-balance ${
              size === "lg" ? "text-5xl sm:text-7xl" : "text-4xl sm:text-6xl"
            }`}
          >
            {title}
          </h1>
          {line ? (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {line}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}
