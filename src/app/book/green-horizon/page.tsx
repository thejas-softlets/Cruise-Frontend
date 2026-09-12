import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { GreenHorizonBookingFlow } from "@/components/booking/GreenHorizonBookingFlow";
import { getRoomsByVessel } from "@/lib/api/rooms";
import { getPackageBySlug } from "@/lib/api/packages";

export const metadata: Metadata = {
  title: "Green Horizon — Visual Cabin Selection",
  description:
    "Pick your stateroom directly on the Green Horizon deck plan — balcony staterooms, panorama suite and roof deck.",
};

export default async function GreenHorizonBookPage() {
  const [roomCategories, pkg] = await Promise.all([
    getRoomsByVessel("green-horizon"),
    getPackageBySlug("4d3n-kenyir-grand-voyage"),
  ]);

  const crumbs = await buildCrumbs(["book"], { "/book": "Cabin Booking" });

  return (
    <>
      <PageHero
        asset={{
          src: "/images/vessels/gh-hero.webp",
          alt: "Green Horizon luxury houseboat on Lake Kenyir",
          width: 1920,
          height: 1080,
        }}
        title="Green Horizon — Choose Your Cabin"
        line="Select staterooms visually on the real deck plan. Balcony staterooms on the 1st floor, the panorama suite above."
        crumbs={crumbs}
        size="md"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <FadeIn>
          {pkg ? (
            <GreenHorizonBookingFlow pkg={pkg} roomCategories={roomCategories} />
          ) : (
            <p className="text-sm text-text-muted">Booking unavailable — package data missing.</p>
          )}
        </FadeIn>
      </div>
    </>
  );
}
