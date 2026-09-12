import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { FadeIn, ParallaxImage } from "@/components/motion";
import type { MediaAsset } from "@/types";

/**
 * The editorial signature on every page: a huge cinematic image band with the
 * page title living on it. One consistent, immersive opening frame across the site.
 */
export async function PageHero({
  asset,
  title,
  line,
  script,
  eyebrow,
  crumbs,
  size = "md",
}: {
  asset: MediaAsset;
  title: string;
  line?: string;
  script?: string;
  eyebrow?: string;
  crumbs?: Crumb[];
  size?: "md" | "lg";
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-obsidian text-white ${
        size === "lg" ? "min-h-[75vh] min-h-[75dvh]" : "min-h-[56vh] min-h-[56dvh]"
      } pb-16 pt-36 sm:pb-20 sm:pt-44`}
    >
      {/* ── Parallax Background Media ── */}
      <ParallaxImage asset={asset} className="absolute inset-0 h-[118%]" priority />

      {/* ── Cinematic Scrims: Lagoon Gradient + Radial Vignette ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_40%,rgba(12,43,51,0.55)_100%)]"
      />

      {/* ── Hero Content ── */}
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {crumbs ? (
          <div className="mb-6 print:hidden">
            <Breadcrumbs crumbs={crumbs} light />
          </div>
        ) : null}

        <FadeIn>
          {eyebrow ? (
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.32em] text-teal-soft/90">
              {eyebrow}
            </p>
          ) : script ? (
            <p className="font-script text-2xl text-teal-soft/95 sm:text-3xl">{script}</p>
          ) : (
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.32em] text-teal-soft/90">
              Tasik Kenyir · Terengganu · Malaysia
            </p>
          )}

          <h1
            className={`font-display mt-3 max-w-4xl font-medium leading-[1.02] tracking-tight text-white text-balance ${
              size === "lg"
                ? "text-4xl sm:text-6xl lg:text-7xl"
                : "text-3xl sm:text-5xl lg:text-6xl"
            }`}
          >
            {title}
          </h1>

          {line ? (
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white/85 sm:text-lg">
              {line}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}
