import { getTranslations } from "next-intl/server";

import { PackageCard } from "@/components/cards/PackageCard";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { FadeIn } from "@/components/motion";
import { SelectField } from "@/components/forms/Field";
import { getAllVessels } from "@/lib/api/vessels";
import { getRoomsByVessel } from "@/lib/api/rooms";
import { getFilteredPackages, type PackageFilters } from "@/lib/api/packages";
import { media } from "@/lib/api/mock/media";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

interface SearchParams {
  vessel?: string;
  duration?: string;
  room?: string;
}

/**
 * Packages hub: cinematic image hero, then a compact filter row (small
 * rounded chips) and large image cards.
 */
export default async function PackagesHubPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("packages");
  const params = await searchParams;
  const filters: PackageFilters = {
    vessel: params.vessel,
    duration: params.duration,
    room: params.room,
  };

  const [packages, vessels, crumbs] = await Promise.all([
    getFilteredPackages(filters),
    getAllVessels(),
    buildCrumbs(["packages"]),
  ]);

  const rooms = filters.vessel
    ? await getRoomsByVessel(filters.vessel)
    : (await Promise.all(vessels.map((v) => getRoomsByVessel(v.id)))).flat();

  function filterHref(next: Partial<SearchParams>) {
    const merged = { ...params, ...next };
    const qs = Object.entries(merged)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return qs ? `/packages?${qs}` : "/packages";
  }

  return (
    <>
      <PageHero
        asset={packages[0]?.heroImage ?? media("Kenyir Lake cruise packages hero", "/images/page-heroes/hero-packages.webp")}
        title={t("hubTitle")}
        line={t("hubLine")}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        {/* Compact filter row */}
        <div className="-mt-7 flex flex-wrap items-center gap-2 rounded-3xl bg-white/95 p-3 shadow-xl shadow-ink/8 backdrop-blur">
          <span className="px-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            {t("filterVessel")}
          </span>
          <FilterChip href={filterHref({ vessel: undefined })} active={!filters.vessel}>
            {t("filterAll")}
          </FilterChip>
          {vessels.map((v) => (
            <FilterChip
              key={v.id}
              href={filterHref({ vessel: v.id })}
              active={filters.vessel === v.id}
            >
              {v.name}
            </FilterChip>
          ))}

          <span className="mx-2 hidden h-5 w-px bg-ink/10 sm:block" />

          <span className="px-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            {t("filterDuration")}
          </span>
          <FilterChip href={filterHref({ duration: undefined })} active={!filters.duration}>
            {t("filterAll")}
          </FilterChip>
          <FilterChip href={filterHref({ duration: "2" })} active={filters.duration === "2"}>
            3D2N
          </FilterChip>
          <FilterChip href={filterHref({ duration: "3" })} active={filters.duration === "3"}>
            4D3N
          </FilterChip>

          {/* No-JS fallback: GET form for room filter; chips above are links. */}
          <form action="/packages" method="get" className="ml-auto flex items-center gap-2">
            {filters.vessel ? <input type="hidden" name="vessel" value={filters.vessel} /> : null}
            {filters.duration ? (
              <input type="hidden" name="duration" value={filters.duration} />
            ) : null}
            <div className="w-44">
              <SelectField
                id="filter-room"
                name="room"
                label=""
                aria-label={t("filterRoom")}
                defaultValue={filters.room ?? ""}
                options={[
                  { value: "", label: `${t("filterRoom")}: ${t("filterAll")}` },
                  ...dedupeRooms(rooms).map((r) => ({ value: r.id, label: r.name })),
                ]}
              />
            </div>
          </form>
        </div>

        {/* Results */}
        {packages.length === 0 ? (
          <p className="mt-14 rounded-3xl border border-ink/8 bg-white p-10 text-center text-text-muted">
            {t("noResults")}
          </p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.slug} delay={i * 0.07}>
                <PackageCard pkg={pkg} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function dedupeRooms(rooms: { id: string; name: string }[]): { id: string; name: string }[] {
  const seen = new Set<string>();
  return rooms.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
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
