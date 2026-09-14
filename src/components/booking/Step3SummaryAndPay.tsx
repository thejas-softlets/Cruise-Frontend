"use client";

import { useState } from "react";
import {
  Bookmark,
  FileText,
  ChevronLeft,
  ShieldCheck,
  Edit2,
  Crown,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { ProformaInvoiceView, type ProformaInvoiceData } from "./ProformaInvoiceView";
import type { CabinSlot, GuestField } from "./booking-types";
import type { DeckCabinSpot } from "@/lib/vessel-deck-plan";
import type { MultiCabinQuoteSummary } from "@/lib/booking-pricing";
import type { Package, Vessel } from "@/types";

interface Step3SummaryAndPayProps {
  /** Mode: individual cabins vs full-vessel charter */
  isCharter?: boolean;
  /** Active expedition package */
  packageInfo: Package;
  /** Vessel object */
  vessel: Vessel;
  /** Human-readable date label */
  dateLabel: string;
  /** Official booking reference (#SCA26-03-XXXX) */
  bookingRef: string;
  /** Active cabin slots */
  cabinSlots: CabinSlot[];
  /** Cabin guest records */
  cabinGuests: Record<string, GuestField[]>;
  /** All cabin spots */
  allCabinSpots: DeckCabinSpot[];
  /** Special requests text */
  specialRequests: string;
  /** Server multi-cabin quote summary */
  quote: MultiCabinQuoteSummary | null;
  /** Grand total MYR */
  grandTotal: number;
  /** Proforma invoice data structure */
  proformaInvoiceData: ProformaInvoiceData;
  /** Navigation callbacks */
  onBackToCabins: () => void;
  onProceedToPayment: () => void;
}

/**
 * Step 3: Booking Summary & Official Proforma Invoice Dossier
 *
 * Provides a dual-perspective review:
 * 1. Manifest Summary: Clear visual confirmation of all booked cabins, adult nationalities,
 *    and child DOB classifications.
 * 2. Official Proforma Invoice: Bank-grade accounting invoice formatted to match the authentic
 *    Summer Bay Travels & Tours dossier (#SCA26-03-XXXX).
 */
export function Step3SummaryAndPay({
  isCharter = false,
  packageInfo,
  vessel,
  dateLabel,
  bookingRef,
  cabinSlots,
  cabinGuests,
  allCabinSpots,
  specialRequests,
  quote,
  grandTotal,
  proformaInvoiceData,
  onBackToCabins,
  onProceedToPayment,
}: Step3SummaryAndPayProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "invoice">("summary");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Switcher: Manifest Summary vs Official Proforma Invoice */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">
            {activeTab === "invoice" ? "Official Proforma Invoice" : "Booking Summary"}
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            {activeTab === "invoice"
              ? `Official proforma billing dossier reference ${bookingRef} issued by Summer Bay Travels & Tours Sdn. Bhd.`
              : "Please review your staterooms and passenger manifest details before confirming."}
          </p>
        </div>

        <div className="inline-flex rounded-2xl bg-ink/5 p-1.5 border border-ink/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              activeTab === "summary"
                ? "bg-white text-ink shadow-md"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Bookmark className="size-3.5" />
            <span>Manifest Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoice")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              activeTab === "invoice"
                ? "bg-teal-deep text-white shadow-md"
                : "text-text-muted hover:text-ink"
            )}
          >
            <FileText className="size-3.5" />
            <span>Official Invoice ({bookingRef})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW A: OFFICIAL PROFORMA INVOICE VIEW                        */}
      {/* ============================================================ */}
      {activeTab === "invoice" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Manifest Summary</span>
            </button>

            <button
              type="button"
              onClick={onProceedToPayment}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-deep px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-obsidian transition"
            >
              <ShieldCheck className="size-4" />
              <span>Proceed to Confirm &amp; Pay</span>
            </button>
          </div>

          <ProformaInvoiceView data={proformaInvoiceData} />
        </div>
      ) : (
        /* ============================================================ */
        /* VIEW B: MANIFEST SUMMARY OVERVIEW                            */
        /* ============================================================ */
        <div className="space-y-8">
          {/* Charter Mode Summary */}
          {isCharter ? (
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    <Crown className="size-3.5 fill-amber-600 text-amber-600" />
                    Private Full-Vessel Buyout
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-medium text-ink">
                    {vessel.name} Exclusive Charter
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {packageInfo.title} · {dateLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onBackToCabins}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
                >
                  <Edit2 className="size-3.5" /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-text-muted">Lead Charterer</span>
                  <div className="mt-0.5 font-semibold text-ink">
                    {cabinGuests["cabin-1"]?.[0]?.firstName} {cabinGuests["cabin-1"]?.[0]?.lastName}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Contact Email</span>
                  <div className="mt-0.5 font-semibold text-ink">
                    {cabinGuests["cabin-1"]?.[0]?.email}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Contact Phone</span>
                  <div className="mt-0.5 font-semibold text-ink">
                    {cabinGuests["cabin-1"]?.[0]?.phoneCode} {cabinGuests["cabin-1"]?.[0]?.phoneNumber}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Included Staterooms</span>
                  <div className="mt-0.5 font-semibold text-ink">
                    All 12 Private Lakeview Staterooms
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Cabin Expeditions Manifest Cards */
            <div className="space-y-6">
              {cabinSlots.map((slot, idx) => {
                const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);
                const guestsInSlot = cabinGuests[slot.id] || [];
                const quoteCabin = quote?.cabins?.[idx];

                return (
                  <div
                    key={slot.id}
                    className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-medium text-ink">
                            Cabin {idx + 1}
                          </h3>
                          {assignedSpot && (
                            <span className="rounded-md bg-teal-deep/10 px-2.5 py-0.5 text-xs font-bold text-teal-deep">
                              {assignedSpot.name} · Room {assignedSpot.planLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {slot.adults} Adult{slot.adults > 1 ? "s" : ""}
                          {slot.children > 0 && ` + ${slot.children} Child${slot.children > 1 ? "ren" : ""}`}
                          {quoteCabin && ` · Subtotal: ${formatPrice(quoteCabin.cabinGrossTotal)}`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={onBackToCabins}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:underline"
                      >
                        <Edit2 className="size-3.5" /> Edit
                      </button>
                    </div>

                    {/* Guest Manifest Table for this Cabin */}
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                            <th className="pb-2">Guest</th>
                            <th className="pb-2">Tier / Category</th>
                            <th className="pb-2">Country of Residence</th>
                            <th className="pb-2">Attraction Ticket</th>
                            <th className="pb-2 text-right">Package Fare</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/8 text-ink">
                          {Array.from({ length: slot.adults }).map((_, aIdx) => {
                            const g = guestsInSlot[aIdx];
                            const itemized = quoteCabin?.itemizedGuests?.[aIdx];
                            return (
                              <tr key={`a-${aIdx}`} className="py-2.5">
                                <td className="py-2 font-medium">
                                  {g?.firstName ? `${g.firstName} ${g.lastName}` : `Adult ${aIdx + 1}`}
                                  {idx === 0 && aIdx === 0 && " (Primary)"}
                                </td>
                                <td className="py-2 text-text-muted">Adult</td>
                                <td className="py-2">
                                  <span className="font-medium text-ink">
                                    {g?.country || "Malaysia"}
                                  </span>
                                </td>
                                <td className="py-2 text-text-muted">
                                  {itemized
                                    ? formatPrice(itemized.attractionTicket)
                                    : g?.country?.toLowerCase() === "malaysia"
                                    ? "RM 40 (Domestic)"
                                    : "RM 70 (Foreigner)"}
                                </td>
                                <td className="py-2 text-right font-semibold">
                                  {itemized ? formatPrice(itemized.packageFare) : "—"}
                                </td>
                              </tr>
                            );
                          })}

                          {Array.from({ length: slot.children }).map((_, cIdx) => {
                            const gIdx = slot.adults + cIdx;
                            const g = guestsInSlot[gIdx];
                            const dob = slot.childBirthDates[cIdx];
                            const itemized = quoteCabin?.itemizedGuests?.[gIdx];

                            return (
                              <tr key={`c-${cIdx}`} className="py-2.5 text-teal-deep">
                                <td className="py-2 font-medium">
                                  {g?.firstName ? `${g.firstName} ${g.lastName}` : `Child ${cIdx + 1}`}
                                </td>
                                <td className="py-2">
                                  {itemized?.category === "infant"
                                    ? "Infant (< 2 yrs · Complimentary)"
                                    : itemized?.category === "toddler"
                                    ? "Toddler (2–3 yrs · Nominal Fee)"
                                    : itemized?.category === "child"
                                    ? "Child (4–11 yrs · 50% Fare)"
                                    : "Adult Rate (12+ yrs)"}
                                </td>
                                <td className="py-2 text-text-muted">
                                  DOB: {dob ? `${dob.day} ${dob.month} ${dob.year}` : "—"}
                                </td>
                                <td className="py-2 text-text-muted">
                                  {itemized ? formatPrice(itemized.attractionTicket) : "—"}
                                </td>
                                <td className="py-2 text-right font-semibold">
                                  {itemized ? formatPrice(itemized.packageFare) : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Room Tax Line */}
                    {quoteCabin && quoteCabin.tourismTaxTotal > 0 && (
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 border border-amber-200/60">
                        <span>Malaysian Tourism Tax (Foreign Room Occupancy):</span>
                        <span className="font-bold">
                          {formatPrice(quoteCabin.tourismTaxTotal)} (RM 10/night)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Special Requests Note */}
          {specialRequests && (
            <div className="rounded-2xl border border-ink/10 bg-[#FAFAF8] p-5 text-xs">
              <span className="font-bold text-ink">Special Requests &amp; Preferences:</span>
              <p className="mt-1 text-text-muted">{specialRequests}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
            <button
              type="button"
              onClick={onBackToCabins}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-ink transition"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Cabin Selection</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("invoice")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-deep/30 bg-teal-soft/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-teal-deep hover:bg-teal-soft/25 transition"
              >
                <FileText className="size-3.5" />
                <span>View Full Proforma Invoice</span>
              </button>

              <button
                type="button"
                onClick={onProceedToPayment}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-deep px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-obsidian transition"
              >
                <ShieldCheck className="size-4" />
                <span>Confirm &amp; Pay ({formatPrice(grandTotal)})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
