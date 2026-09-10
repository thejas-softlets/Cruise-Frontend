import { notFound } from "next/navigation";

import { Breadcrumbs, buildCrumbs } from "@/components/layout/Breadcrumbs";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PackageCard } from "@/components/cards/PackageCard";
import { getOfferBySlug, getAllOffers } from "@/lib/api/offers";
import { getAllPackages } from "@/lib/api/packages";
import { getTranslations, getLocale } from "next-intl/server";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const offers = await getAllOffers();
  return offers.map((o) => ({ slug: o.slug }));
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const t = await getTranslations("offers");
  const locale = await getLocale();

  const applicablePackages = (await getAllPackages()).filter((p) =>
    offer.applicablePackageSlugs.includes(p.slug),
  );

  const crumbs = await buildCrumbs(["offers", slug], { [`/offers/${slug}`]: offer.title });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <FadeIn>
          <PlaceholderMedia
            asset={offer.heroImage}
            className="aspect-[16/10] rounded-3xl"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </FadeIn>
        <FadeIn delay={0.08}>
          <Badge variant="gold" className="text-sm">
            {offer.shortTag}
          </Badge>
          <h1 className="mt-4 font-display text-4xl leading-tight text-balance sm:text-5xl">
            {offer.title}
          </h1>

          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {t("eligibility")}
              </dt>
              <dd className="mt-2 space-y-1">
                {offer.eligibility.map((e) => (
                  <p key={e}>{e}</p>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {t("discount")}
              </dt>
              <dd className="mt-2 leading-relaxed">{offer.discountSummary}</dd>
            </div>
            {offer.validDateRange ? (
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  {t("validDates")}
                </dt>
                <dd className="mt-2">
                  {t("validDatesValue", {
                    start: formatDate(offer.validDateRange.start, locale),
                    end: formatDate(offer.validDateRange.end, locale),
                  })}
                </dd>
              </div>
            ) : null}
          </dl>
        </FadeIn>
      </div>

      {/* Applicable packages */}
      <section className="mt-16">
        <h2 className="font-display text-2xl">{t("applicablePackages")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {applicablePackages.map((pkg, i) => (
            <FadeIn key={pkg.slug} delay={i * 0.06}>
              <PackageCard pkg={pkg} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl">{t("terms")}</h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-text-muted">
          {offer.terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </section>

      {/* Enquiry */}
      <section className="mt-16 max-w-2xl">
        <EnquiryForm
          source="offer-detail"
          offerSlug={offer.slug}
          bookingType="cruise"
          heading={t("enquireTitle")}
          line={t("enquireLine")}
        />
      </section>
    </div>
  );
}
