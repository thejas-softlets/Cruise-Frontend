import { getTranslations } from "next-intl/server";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { getVoucherOptions } from "@/lib/api/vouchers";
import { media } from "@/lib/api/mock/media";
import { cn } from "@/lib/utils";

/**
 * Gift vouchers: amounts are indicative (§8.3); selection carries into the
 * enquiry form via a shareable URL param — no client state needed.
 */
export default async function GiftVouchersPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const t = await getTranslations("giftVouchers");
  const tc = await getTranslations("common");
  const params = await searchParams;

  const [vouchers, crumbs] = await Promise.all([getVoucherOptions(), buildCrumbs(["gift-vouchers"])]);
  const selectedAmount = params.amount
    ? vouchers.find((v) => String(v.amountMYR) === params.amount)?.amountMYR
    : undefined;

  return (
    <>
      <PageHero
        asset={media("Wrapped gift on the houseboat deck", "/images/page-heroes/hero-gift-vouchers.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <p className="max-w-2xl pt-16 text-lg leading-relaxed text-text-muted">{t("howItWorks")}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vouchers.map((v, i) => (
            <FadeIn key={v.id} delay={i * 0.05}>
              <a
                href={`/gift-vouchers?amount=${v.amountMYR}#enquire`}
                aria-current={selectedAmount === v.amountMYR ? "true" : undefined}
                className={cn(
                  "flex h-full flex-col rounded-3xl border-2 p-7 transition-all duration-500",
                  selectedAmount === v.amountMYR
                    ? "border-gold-bright bg-gold/10 shadow-lg shadow-gold/15"
                    : "border-ink/10 bg-white hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-ink/8",
                )}
              >
                <span className="font-display text-3xl font-medium">
                  {t("amountLabel", { amount: v.amountMYR })}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                  {v.description}
                </span>
                <span className="mt-4 inline-flex w-fit items-center rounded-full border border-gold/50 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-gold-bright">
                  {tc("indicative")}
                </span>
              </a>
            </FadeIn>
          ))}
        </div>

        <section id="enquire" className="mx-auto mt-20 max-w-2xl scroll-mt-24">
          <EnquiryForm
            source="gift-voucher"
            bookingType="voucher"
            voucherAmount={selectedAmount}
            heading={t("enquireTitle")}
            line={t("enquireLine")}
          />
        </section>
      </div>
    </>
  );
}
