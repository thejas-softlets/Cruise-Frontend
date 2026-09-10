import { getTranslations } from "next-intl/server";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { VesselCard } from "@/components/cards/VesselCard";
import { getAllVessels } from "@/lib/api/vessels";
import { media } from "@/lib/api/mock/media";

export default async function PrivateCharterPage() {
  const t = await getTranslations("privateCharterPage");
  const [vessels, crumbs] = await Promise.all([getAllVessels(), buildCrumbs(["private-charter"])]);

  return (
    <>
      <PageHero
        asset={vessels[0]?.heroImage ?? media("Houseboat anchored in a quiet cove", "/images/page-heroes/hero-private-charter.webp")}
        title={t("enquireTitle")}
        line={t("body")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-6 pt-16 md:grid-cols-2">
          {vessels.map((vessel, i) => (
            <FadeIn key={vessel.id} delay={i * 0.08}>
              <VesselCard vessel={vessel} />
            </FadeIn>
          ))}
        </div>

        <section className="mx-auto mt-20 max-w-2xl">
          <EnquiryForm
            source="private-charter"
            bookingType="charter"
            heading={t("enquireTitle")}
            line={t("enquireLine")}
          />
        </section>
      </div>
    </>
  );
}
