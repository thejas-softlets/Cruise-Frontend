import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getAllVessels } from "@/lib/api/vessels";
import { getAllPackages } from "@/lib/api/packages";
import { getRoomsByVessel } from "@/lib/api/rooms";
import { media } from "@/lib/api/mock/media";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ vessel?: string; mode?: string }>;
}) {
  const { vessel, mode } = await searchParams;

  const vessels = await getAllVessels();
  const packages = await getAllPackages();
  const roomCategories = (
    await Promise.all(vessels.map((v) => getRoomsByVessel(v.id)))
  ).flat();

  const crumbs = await buildCrumbs(["book"], { "/book": "Booking" });

  const heroAsset = media(
    "Summer Cruise Lake Kenyir expedition",
    "/images/vessels/sc-hero.webp"
  );

  const initialVesselId = vessel === "green-horizon" || vessel === "summer-cruise" ? vessel : undefined;
  const initialMode = mode === "charter" ? "charter" : mode === "cabin" ? "cabin" : undefined;

  return (
    <>
      <PageHero
        asset={heroAsset}
        title="Book Your Voyage"
        line="Reserve a stateroom on a scheduled sailing, or charter the whole ship for a private group."
        crumbs={crumbs}
        size="md"
      />

      <BookingWizard
        vessels={vessels}
        packages={packages}
        roomCategories={roomCategories}
        initialVesselId={initialVesselId}
        initialMode={initialMode}
      />
    </>
  );
}
