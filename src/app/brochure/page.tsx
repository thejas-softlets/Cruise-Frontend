import { FileDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { media } from "@/lib/api/mock/media";

export default async function BrochurePage() {
  const t = await getTranslations("brochure");
  const tc = await getTranslations("common");
  const crumbs = await buildCrumbs(["brochure"]);

  return (
    <>
      <PageHero
        asset={media("Summer Cruise houseboat cruising Lake Kenyir", "/images/page-heroes/hero-brochure.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-6 pt-16 lg:grid-cols-2">
          <FadeIn>
            <div className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-8">
              {/* §13: no fake brochure PDF yet — honest placeholder state. */}
              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-gold/15 via-sage/15 to-gold/25">
                <FileDown aria-hidden className="size-10 text-gold-bright/60" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-text-muted">
                {t("placeholderNote")}
              </p>
              <div className="mt-6">
                <Button href="/packages" variant="ghost">
                  {tc("learnMore")}
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-gold/25 bg-gold/8 p-8">
              <p className="font-script text-2xl text-gold-bright">{t("requestTitle")}</p>
              <h2 className="font-display mt-2 text-3xl font-medium">{t("requestLine")}</h2>
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  href={whatsappLink(WHATSAPP_NUMBER, t("requestLine"))}
                  variant="whatsapp"
                  external
                >
                  {t("whatsapp")}
                </Button>
                <Button
                  href={`mailto:${SITE.email}?subject=Brochure request`}
                  variant="ghost"
                  external
                >
                  {t("email")}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
