"use client";

import { Check, Printer, MessageCircle, ShieldCheck, Home } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";
import type { Package, Vessel } from "@/types";
import type { ProformaInvoiceData } from "./ProformaInvoiceView";

interface Step4ConfirmationProps {
  bookingRef: string;
  packageInfo: Package;
  vessel: Vessel;
  dateLabel: string;
  grandTotal: number;
  totalCabins: number;
  totalGuests: number;
  leadGuestName: string;
  leadGuestEmail: string;
  onOpenInvoice: () => void;
}

/**
 * Step 4: Booking Confirmation & Final Performa Invoice Settlement
 *
 * Displays verified reservation confirmation matching official Kenyir operating protocol:
 * 1. Confirms reference number (#SCA26-03-XXXX).
 * 2. Instant WhatsApp concierge link pre-populated with reference and payment instructions.
 * 3. Proforma invoice printing / download link for bank transfer documentation.
 */
export function Step4Confirmation({
  bookingRef,
  packageInfo,
  vessel,
  dateLabel,
  grandTotal,
  totalCabins,
  totalGuests,
  leadGuestName,
  leadGuestEmail,
  onOpenInvoice,
}: Step4ConfirmationProps) {
  const depositAmount = Math.round(grandTotal * 0.3);

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-xl sm:p-12 animate-fade-in">
      {/* Success Icon */}
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-teal-deep text-white shadow-lg">
        <Check className="size-10 stroke-[3]" />
      </div>

      <span className="mt-6 inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
        Reservation Confirmed
      </span>

      <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
        Bon Voyage!
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Your Lake Kenyir luxury voyage is secured. An official proforma billing invoice ({bookingRef}) has been prepared for your reservation.
      </p>

      {/* Reservation Receipt Card */}
      <div className="mt-8 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-6 text-left text-xs space-y-3">
        <div className="flex justify-between border-b border-ink/10 pb-2">
          <span className="text-text-muted">Booking Reference</span>
          <span className="font-mono font-bold text-ink">{bookingRef}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Expedition Package</span>
          <span className="font-semibold text-ink">{packageInfo.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Vessel &amp; Fleet</span>
          <span className="font-semibold text-ink">{vessel.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Sailing Date</span>
          <span className="font-semibold text-ink">{dateLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Berth &amp; Departure</span>
          <span className="font-semibold text-ink">Pengkalan Gawi Jetty (12:00 PM)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Party Manifest</span>
          <span className="font-semibold text-ink">
            {totalCabins} {totalCabins === 1 ? "Cabin" : "Cabins"} · {totalGuests} Guests
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Lead Passenger</span>
          <span className="font-semibold text-ink">
            {leadGuestName} ({leadGuestEmail})
          </span>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold">
          <span className="text-ink">Grand Total</span>
          <span className="font-display text-base font-bold text-obsidian">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <div className="flex justify-between text-teal-deep font-semibold">
          <span>Security Deposit Required (30%)</span>
          <span>{formatPrice(depositAmount)}</span>
        </div>
      </div>

      {/* Bank Transfer Instructions Callout */}
      <div className="mt-6 rounded-2xl bg-teal-soft/20 p-5 text-left text-xs text-ink/80 space-y-2 border border-teal-deep/15">
        <div className="flex items-center gap-2 font-bold text-teal-deep">
          <ShieldCheck className="size-4" />
          <span>Official Payment Settlement (CIMB Bank)</span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-muted">
          Please transfer your 30% confirmation deposit to <strong>Summer Bay Travels &amp; Tours Sdn. Bhd.</strong> using reference <strong className="font-mono text-ink">{bookingRef}</strong>.
        </p>
        <div className="font-mono text-xs font-bold text-ink bg-white/70 p-2 rounded-lg border border-teal-deep/10">
          CIMB Bank: 800-843-9060 | Beneficiary: Summer Bay Travels &amp; Tours
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onOpenInvoice}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 bg-white py-3 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-ink/5 shadow-xs"
        >
          <Printer className="size-4" />
          <span>View / Print Proforma Invoice</span>
        </button>

        <a
          href={whatsappLink(
            WHATSAPP_NUMBER,
            `Hello Summer Cruise Concierge! I have confirmed booking ${bookingRef} for ${packageInfo.title} on ${dateLabel}. My party is ${totalGuests} guests in ${totalCabins} cabins. I would like to submit my payment receipt.`
          )}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-95 shadow-md"
        >
          <MessageCircle className="size-4" />
          <span>Submit Payment via WhatsApp</span>
        </a>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-ink transition"
        >
          <Home className="size-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
