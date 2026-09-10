import { getTranslations } from "next-intl/server";

import { OfferCard } from "@/components/cards/OfferCard";
import { Breadcrumbs, buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllOffers } from "@/lib/api/offers";

export default async function OffersHubPage() {
  const t = await getTranslations("offers");
  const [offers, crumbs] = await Promise.all([getAllOffers(), buildCrumbs(["offers"])]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <Breadcrumbs crumbs={crumbs} />
      <SectionHeading className="mt-6" title={t("hubTitle")} line={t("hubLine")} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, i) => (
          <FadeIn key={offer.slug} delay={i * 0.06}>
            <OfferCard offer={offer} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
