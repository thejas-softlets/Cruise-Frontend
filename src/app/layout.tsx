import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import {
  Outfit,
  Plus_Jakarta_Sans,
  Roboto_Condensed,
  Yellowtail,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

import "../styles/tokens.css";

const caacupe = localFont({
  src: "../../public/fonts/CaacupeOne-Regular.ttf",
  variable: "--font-caacupe",
  display: "swap",
  weight: "400",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/** Outfit — the Summer Cruise site's primary sans (body + UI). */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

/** Handwritten script accent — sparingly: one or two words per page max for highlights. */
const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
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
      className={`${caacupe.variable} ${jakarta.variable} ${outfit.variable} ${robotoCondensed.variable} ${yellowtail.variable} antialiased`}
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
