import { getTranslations } from "next-intl/server";

import { CheckInForm } from "@/components/forms/CheckInForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { media } from "@/lib/api/mock/media";

export default async function CheckInPage() {
  const t = await getTranslations("checkIn");
  const crumbs = await buildCrumbs(["check-in"]);

  return (
    <>
      <PageHero
        asset={media("Summer Cruise casting off at Lake Kenyir", "/images/page-heroes/hero-checkin.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="pt-14">
          <CheckInForm />
        </div>
      </div>
    </>
  );
}
