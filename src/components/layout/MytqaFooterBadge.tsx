"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, ShieldCheck, X } from "lucide-react";

interface MytqaFooterBadgeProps {
  className?: string;
}

/**
 * Compact MyTQA Platinum Trust Badge for Footer & Global Navigations
 */
export function MytqaFooterBadge({ className = "" }: MytqaFooterBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 p-3 text-left transition-all duration-300 hover:border-gold/60 hover:bg-white/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold ${className}`}
        aria-label="View official MyTQA Platinum Accreditation Plaque"
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#D4AF37]/50 bg-obsidian shadow-xs">
          <Image
            src="/mytqa.jpeg"
            alt="MyTQA Platinum Plaque"
            fill
            sizes="48px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-bright">
            <Award className="size-3 text-gold" />
            <span>MyTQA Platinum</span>
          </div>
          <p className="text-xs font-semibold text-white/90 leading-tight">
            Ministry of Tourism, Arts &amp; Culture
          </p>
          <p className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="size-3 text-emerald-400" />
            Certified 2025–2028 · Click to inspect
          </p>
        </div>
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto overscroll-contain"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-lg w-full overflow-hidden rounded-3xl bg-[#0C2B33] p-6 shadow-2xl text-white sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <div className="text-center mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-gold-bright">
                MOTAC Official Plaque
              </span>
              <h4 className="font-display mt-2 text-2xl font-medium tracking-tight text-white">
                Malaysia Tourism Quality Assurance
              </h4>
              <p className="mt-1 text-xs text-white/70">
                Ministry of Tourism, Arts and Culture · Summer Cruise Platinum Plaque
              </p>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-2 border-gold/60 shadow-2xl">
              <Image
                src="/mytqa.jpeg"
                alt="Full MyTQA Platinum Accreditation Plaque"
                fill
                sizes="(max-width: 640px) 90vw, 400px"
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-5 rounded-xl bg-white/5 p-3.5 text-center text-xs text-white/80">
              <p className="font-semibold text-gold-bright">
                Accreditation Ref: Platinum · Summer Cruise
              </p>
              <p className="mt-0.5 text-[11px] text-white/60">
                Certified Tenure: 7 August 2025 – 6 August 2028 · Tasik Kenyir, Terengganu
              </p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gold px-6 py-2 text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-gold-bright shadow-md"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
