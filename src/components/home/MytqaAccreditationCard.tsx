"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, CheckCircle2, ShieldCheck, X, ZoomIn } from "lucide-react";
import { Portal } from "@/components/ui/Portal";

interface MytqaAccreditationCardProps {
  className?: string;
}

/**
 * MyTQA Platinum Accreditation Showcase Card
 *
 * Displays Summer Cruise's official Ministry of Tourism, Arts and Culture (MOTAC)
 * Malaysia Tourism Quality Assurance (MyTQA) Platinum accreditation plaque.
 * Includes an interactive lightbox modal to inspect the official brass plaque in detail.
 */
export function MytqaAccreditationCard({ className = "" }: MytqaAccreditationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5F0E6] p-6 sm:p-8 shadow-[0_12px_44px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${className}`}
      >
        {/* Subtle decorative gold shimmer background accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Plaque Thumbnail with zoom overlay */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group/img relative shrink-0 overflow-hidden rounded-2xl p-0.5 shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none"
            aria-label="View official MyTQA Platinum Accreditation Plaque"
          >
            <div className="relative size-32 sm:size-36 overflow-hidden rounded-xl bg-obsidian">
              <Image
                src="/mytqa.jpeg"
                alt="MyTQA Platinum Accreditation Plaque - Ministry of Tourism, Arts and Culture Malaysia"
                fill
                sizes="(max-width: 640px) 128px, 144px"
                className="object-cover transition-transform duration-500 group-hover/img:scale-110"
              />
              {/* Zoom Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-obsidian/40 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-obsidian shadow-sm backdrop-blur-xs">
                  <ZoomIn className="size-3 text-gold-bright" /> Inspect
                </span>
              </div>
            </div>
          </button>

          {/* Plaque Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest text-[#8F6B00]">
              <Award className="size-3.5 text-[#B8860B]" />
              Official Government Accreditation
            </div>

            <h3 className="font-display mt-2.5 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              MyTQA Platinum Award
            </h3>

            <p className="font-secondary mt-0.5 text-xs font-semibold uppercase tracking-wider text-teal-deep">
              Ministry of Tourism, Arts and Culture Malaysia (MOTAC)
            </p>

            <p className="mt-2 text-xs leading-relaxed text-text-muted sm:text-sm">
              Summer Cruise has been officially awarded the highest <strong className="text-ink">Platinum Tier</strong> accreditation under the Malaysia Tourism Quality Assurance scheme (Valid: 7 Aug 2025 – 6 Aug 2028). Recognized for premier hospitality, strict maritime safety protocols, and sustainable environmental stewardship on Lake Kenyir.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-ink/80">
              <span className="inline-flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Platinum Tier Rating
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink/70">
                <ShieldCheck className="size-3.5 text-gold" /> Certified 2025–2028
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="font-secondary text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep hover:underline"
              >
                View Official Plaque →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal rendered via Portal to escape parent transforms and cover full viewport */}
      {isOpen && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in w-screen h-screen overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative max-w-lg w-full overflow-hidden rounded-3xl bg-[#0C2B33] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white sm:p-8 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>

              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-gold-bright">
                  MOTAC Official Plaque
                </span>
                <h4 className="font-display mt-2 text-2xl font-medium tracking-tight text-white">
                  Malaysia Tourism Quality Assurance
                </h4>
                <p className="mt-1 text-xs text-white/70">
                  Ministry of Tourism, Arts and Culture · Summer Cruise Platinum Plaque
                </p>
              </div>

              {/* High-Res Plaque Display without artificial borders */}
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/mytqa.jpeg"
                  alt="Full MyTQA Platinum Accreditation Plaque"
                  fill
                  sizes="(max-width: 640px) 90vw, 400px"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              <div className="mt-5 rounded-2xl bg-white/5 p-4 text-center text-xs text-white/80">
                <p className="font-semibold text-gold-bright">
                  Accreditation Ref: Platinum · Summer Cruise
                </p>
                <p className="mt-0.5 text-[11px] text-white/60">
                  Certified Tenure: 7 August 2025 – 6 August 2028 · Tasik Kenyir, Terengganu
                </p>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-gold px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-gold-bright shadow-md"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
