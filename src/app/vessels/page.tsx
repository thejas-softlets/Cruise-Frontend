import { getTranslations } from "next-intl/server";

import { VesselCard } from "@/components/cards/VesselCard";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { getAllVessels } from "@/lib/api/vessels";
import { media } from "@/lib/api/mock/media";

export default async function VesselsHubPage() {
  const t = await getTranslations("vessels");
  const [vessels, crumbs] = await Promise.all([getAllVessels(), buildCrumbs(["vessels"])]);

  return (
    <>
      <PageHero
        asset={vessels[0]?.heroImage ?? media("Houseboat on Kenyir Lake", "/images/page-heroes/hero-vessels.webp")}
        title={t("hubTitle")}
        line={t("hubLine")}
        crumbs={crumbs}
        size="lg"
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 pt-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {vessels.map((vessel, i) => (
            <FadeIn key={vessel.id} delay={i * 0.1} className={i === 1 ? "md:mt-14" : undefined}>
              <VesselCard vessel={vessel} />
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
