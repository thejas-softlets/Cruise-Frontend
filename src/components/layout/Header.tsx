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

  // Stay transparent while a `[data-nav-transparent-until]` region is under the
  // nav (hero + doors chapter on the landing page); frost once it passes.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const zone = document.querySelector("[data-nav-transparent-until]");
      if (zone) {
        const bottom = zone.getBoundingClientRect().bottom;
        setScrolled(bottom < 90); // 90 ≈ nav height + margin
      } else {
        setScrolled(window.scrollY > 24);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", onScroll);
      window.visualViewport.addEventListener("scroll", onScroll);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (typeof window !== "undefined" && window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onScroll);
        window.visualViewport.removeEventListener("scroll", onScroll);
      }
    };
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top,0px)]",
        scrolled || menuOpen
          ? "bg-[#f7fafb]/95 shadow-[0_8px_30px_rgba(12,43,51,0.08)] backdrop-blur-2xl"
          : "bg-gradient-to-b from-obsidian/60 to-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={SITE.name}
          className="group inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-85"
        >
          <Image
            src="/images/logo/summer-cruise-logo-white.webp"
            alt={SITE.name}
            width={180}
            height={46}
            className="h-10 w-auto translate-y-[1px] object-contain sm:h-12"
            priority
          />
        </Link>

        {/* Desktop nav — compact pill links */}
        <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex 2xl:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative whitespace-nowrap rounded-full px-3 py-2 text-[0.875rem] font-semibold tracking-wide transition-colors duration-300 2xl:px-3.5 2xl:py-2.5 2xl:text-[0.9375rem]",
                onDark
                  ? "text-white/90 [text-shadow:0_1px_8px_rgba(12,43,51,0.6)] hover:text-white"
                  : "text-ink/75 hover:text-teal-deep",
                pathname === item.href && (onDark ? "text-white" : "text-teal-deep"),
              )}
            >
              {t(item.key)}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 bottom-0.5 h-[2px] origin-left rounded-full bg-teal transition-transform duration-500 ease-out",
                  pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <LanguageToggle onDark={onDark} />
          <a
            href={SITE.phoneHref}
            aria-label={tc("callUs")}
            className={cn(
              "hidden size-9 items-center justify-center rounded-full transition-colors 2xl:inline-flex",
              onDark ? "text-white/80 hover:bg-white/10" : "text-ink/60 hover:bg-ink/5",
            )}
          >
            <Phone aria-hidden className="size-4" />
          </a>
          <Link
            href="/book"
            className={cn(
              "font-secondary hidden min-h-9 items-center whitespace-nowrap rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-500 sm:inline-flex sm:min-h-10 sm:px-5 sm:tracking-[0.14em]",
              onDark
                ? "bg-teal text-white hover:bg-white hover:text-obsidian"
                : "bg-teal text-white hover:bg-teal-deep",
            )}
          >
            {tc("bookNow")}
          </Link>
          <Link
            href="/contact"
            className={cn(
              "font-secondary hidden min-h-10 items-center whitespace-nowrap rounded-full px-5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-500 2xl:inline-flex",
              onDark
                ? "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-obsidian"
                : "bg-obsidian text-white hover:bg-teal-deep",
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
              "inline-flex size-10 items-center justify-center rounded-full transition-colors xl:hidden",
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
            className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-[#f7fafb] xl:hidden min-h-[calc(100dvh-5rem)] h-[calc(100dvh-5rem)] pb-[env(safe-area-inset-bottom,2rem)]"
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
                      className="font-display flex min-h-14 items-center border-b border-ink/8 text-3xl font-medium text-ink transition-colors hover:text-teal-deep"
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
                    className="font-script block text-2xl text-teal-deep"
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
