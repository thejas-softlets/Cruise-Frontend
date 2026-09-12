import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

import "../styles/tokens.css";

/** Migatsu — Summer Cruise official brand display & headline font */
const migatsu = localFont({
  src: "../../public/fonts/Migatsu-Regular.woff2",
  variable: "--font-migatsu",
  display: "swap",
  weight: "400",
});

/** Marker Mark — Summer Cruise official handwritten marker/script font */
const markerMark = localFont({
  src: "../../public/fonts/MarkerMark-Regular.ttf",
  variable: "--font-marker",
  display: "swap",
  weight: "400",
});

/** Outfit — Summer Cruise official primary sans font (body + UI) */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

/* Explicit viewport: China browsers (WeChat X5, QQ, UC) honor declared
   viewport-fit better than heuristics; maximum-scale avoids their
   auto-inflate-text heuristic. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.home");
  return {
    title: {
      default: t("title"),
      template: "%s · Summer Cruise",
    },
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cookie-based locale (§7.2): there is no [locale] URL segment, so the
  // language follows the cookie while every URL stays language-neutral.
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      className={`${migatsu.variable} ${markerMark.variable} ${outfit.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-obsidian focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-gold-bright"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <SmoothScroll />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
