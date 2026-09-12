import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";
import { FadeIn } from "@/components/motion";
import { SITE } from "@/lib/site";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { media } from "@/lib/api/mock/media";

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const crumbs = await buildCrumbs(["contact"]);

  const channels = [
    {
      icon: Phone,
      label: t("phone"),
      value: SITE.phone,
      href: SITE.phoneHref,
    },
    {
      icon: MessageCircle,
      label: t("whatsapp"),
      value: tc("whatsapp"),
      href: whatsappLink(WHATSAPP_NUMBER, tc("whatsappMessage")),
    },
    {
      icon: Mail,
      label: t("email"),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
  ];

  return (
    <>
      <PageHero
        asset={media("Aerial view of the houseboat on Lake Kenyir", "/images/page-heroes/hero-contact.webp")}
        title={t("title")}
        line={t("subtitle")}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <div className="grid gap-12 pt-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <ul className="space-y-4">
              {channels.map((c, i) => (
                <FadeIn key={c.label} delay={i * 0.05}>
                  <li>
                    <a
                      href={c.href}
                      className="flex min-h-16 items-center gap-4 rounded-3xl border border-ink/8 bg-white p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/8"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15">
                        <c.icon aria-hidden className="size-5 text-gold-bright" />
                      </span>
                      <span>
                        <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {c.label}
                        </span>
                        <span className="font-semibold text-ink">{c.value}</span>
                      </span>
                    </a>
                  </li>
                </FadeIn>
              ))}
            </ul>

            <FadeIn delay={0.15}>
              <div className="mt-4 rounded-3xl border border-ink/8 bg-white p-5">
                <p className="flex items-start gap-3 text-sm leading-relaxed text-text-muted">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-bright" />
                  <span>
                    <span className="block font-semibold text-ink">{t("address")}</span>
                    {SITE.address}
                  </span>
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div>
              <h2 className="font-display text-3xl font-medium">{t("formTitle")}</h2>
              <p className="mt-1.5 text-text-muted">{t("formLine")}</p>
              <div className="mt-6">
                <EnquiryForm source="contact" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
