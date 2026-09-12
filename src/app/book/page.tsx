import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { AquaBookingFlow } from "@/components/booking/AquaBookingFlow";
import { getAllPackages } from "@/lib/api/packages";
import { getCabinDeckSlots } from "@/lib/api/booking";
import { media } from "@/lib/api/mock/media";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: selectedSlug } = await searchParams;

  const [allPackages, cabinSlots] = await Promise.all([
    getAllPackages(),
    getCabinDeckSlots(),
  ]);

  const activePackage =
    allPackages.find((p) => p.slug === selectedSlug) || allPackages[0];

  const crumbs = await buildCrumbs(["book"], { "/book": "Cabin Booking" });

  const heroAsset = activePackage?.heroImage || media(
    "Summer Cruise Lake Kenyir expedition",
    "/images/vessels/sc-hero.webp"
  );

  return (
    <>
      <PageHero
        asset={heroAsset}
        title="Direct Stateroom & Cabin Reservation"
        line="Choose your preferred voyage, deck, and staterooms with instant pricing and flexible terms."
        crumbs={crumbs}
        size="md"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {/* Package Selector Bar if multiple packages available */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Select Cruise Voyage:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {allPackages.map((p) => (
                <a
                  key={p.slug}
                  href={`/book?package=${p.slug}`}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    p.slug === activePackage.slug
                      ? "bg-obsidian text-white shadow"
                      : "bg-ink/5 text-ink hover:bg-black/10"
                  }`}
                >
                  {p.title} ({p.durationLabel})
                </a>
              ))}
              {activePackage.vesselId === "green-horizon" && (
                <a
                  href="/book/green-horizon"
                  className="rounded-full bg-teal-deep px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-obsidian"
                >
                  ★ Visual Deck-Plan Selection
                </a>
              )}
            </div>
          </div>
          <span className="text-xs text-text-muted">
            Starting from RM {activePackage.fromPriceMYR} per pax
          </span>
        </div>

        <FadeIn>
          <AquaBookingFlow
            pkg={activePackage}
            availableCabins={cabinSlots}
          />
        </FadeIn>
      </div>
    </>
  );
}
