"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";

/** §7.1: floating WhatsApp help channel, visible on every single page. */
export function WhatsAppFloat() {
  const t = useTranslations("common");
  const tFloat = useTranslations("whatsappFloat");

  return (
    <a
      href={whatsappLink(WHATSAPP_NUMBER, t("whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tFloat("ariaLabel")}
      className="fixed bottom-5 right-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3 text-[0.8125rem] font-semibold text-white shadow-lg shadow-ink/20 transition-transform duration-500 hover:scale-[1.04] motion-reduce:transition-none"
    >
      <MessageCircle aria-hidden className="size-5" />
      <span className="hidden xs:inline">{tFloat("label")}</span>
    </a>
  );
}
