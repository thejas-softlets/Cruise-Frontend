"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageToggle } from "./LanguageToggle";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { SITE } from "@/lib/site";
import { cn, whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";

const NAV = [
  { href: "/vessels", key: "vessels" },
  { href: "/packages", key: "packages" },
  { href: "/experiences", key: "experiences" },
  { href: "/the-lake", key: "theLake" },
  { href: "/gallery", key: "gallery" },
  { href: "/about", key: "about" },
  { href: "/journal", key: "journal" },
] as const;

/**
 * Light glass header: transparent over image heroes, frosted cream once
 * scrolled. Compact 16-unit bar, pill nav links with a soft gold underline.
 */
export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the path changes — via the click handler, not a
  // synchronous setState-in-effect (React 19 lint rule).
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onDark = !scrolled && !menuOpen; // sitting over a hero image

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || menuOpen
          ? "border-b border-ink/6 bg-[#faf9f6]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label={SITE.name}
          className={cn(
            "group inline-flex items-center gap-2 transition-colors duration-500",
            onDark ? "text-white" : "text-ink",
          )}
        >
          <Image
            src="/images/logo/summer-cruise-logo.webp"
            alt=""
            width={40}
            height={40}
            className={cn(
              "size-8 shrink-0 rounded-full object-contain ring-1 ring-white/20 transition-opacity duration-500 group-hover:opacity-85",
              onDark ? "bg-white/10" : "bg-ink/5",
            )}
          />
          <span className="font-display text-lg font-semibold tracking-[0.06em] sm:text-xl">
            Summer&nbsp;Cruise
          </span>
        </Link>

        {/* Desktop nav — compact pill links */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative rounded-full px-3 py-2 text-[0.8125rem] font-medium tracking-wide transition-colors duration-300",
                onDark
                  ? "text-white/75 hover:text-white"
                  : "text-ink/60 hover:text-ink",
                pathname === item.href && (onDark ? "text-white" : "text-ink"),
              )}
            >
              {t(item.key)}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 bottom-0.5 h-px origin-left bg-gold-bright transition-transform duration-400 ease-out",
                  pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageToggle onDark={onDark} />
          <a
            href={SITE.phoneHref}
            aria-label={tc("callUs")}
            className={cn(
              "hidden size-9 items-center justify-center rounded-full transition-colors sm:inline-flex",
              onDark ? "text-white/80 hover:bg-white/10" : "text-ink/60 hover:bg-ink/5",
            )}
          >
            <Phone aria-hidden className="size-4" />
          </a>
          <Link
            href="/contact"
            className={cn(
              "font-secondary hidden min-h-9 items-center rounded-full px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-all duration-400 md:inline-flex",
              onDark
                ? "bg-white text-ink hover:bg-gold hover:text-white"
                : "bg-obsidian text-white hover:bg-gold-bright",
            )}
          >
            {tc("enquire")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? tc("closeMenu") : tc("openMenu")}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full transition-colors lg:hidden",
              onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5",
            )}
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile overlay — cream, curated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-[#faf9f6] lg:hidden"
          >
            <nav aria-label="Mobile" className="px-6 py-8">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="font-display flex min-h-14 items-center border-b border-ink/8 text-3xl font-medium text-ink transition-colors hover:text-gold-bright"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                  className="pt-6"
                >
                  <Link
                    href="/how-it-works"
                    onClick={closeMenu}
                    className="font-script block text-2xl text-gold-bright"
                  >
                    {t("howItWorks")}
                  </Link>
                </motion.li>
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, tc("whatsappMessage"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#128C7E] px-5 text-sm font-semibold text-white"
                >
                  <MessageCircle aria-hidden className="size-4" />
                  {tc("whatsapp")}
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink"
                >
                  <Phone aria-hidden className="size-4" />
                  {SITE.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
