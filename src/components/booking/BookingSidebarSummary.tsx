"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Info,
  Users,
  Percent,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { MultiCabinQuoteSummary } from "@/lib/booking-pricing";
import type { Package } from "@/types";

interface BookingSidebarSummaryProps {
  /** Selected expedition package */
  packageInfo: Package;
  /** Human-readable departure date label */
  dateLabel: string;
  /** Server-calculated or local dynamic multi-cabin quote */
  quote: MultiCabinQuoteSummary | null;
  /** True while background quote recalculation is in flight */
  isLoading?: boolean;
  /** Active wizard step index (0 to 4) */
  step: number;
  /** Callback to advance to the next step */
  onNext?: () => void;
  /** Whether the user can advance from the current step */
  canAdvance?: boolean;
  /** Custom label for the primary action button */
  actionLabel?: string;
  /** Optional secondary back button callback */
  onBack?: () => void;
  /** Optional secondary back button label */
  backLabel?: string;
  /** Agency commission rate percent override (default 10%) */
  agencyCommissionPercent?: number;
  /** Optional charter buyout mode indicator */
  isCharter?: boolean;
  /** Charter grand total */
  charterGrandTotal?: number;
  /** Charter vessel name */
  vesselName?: string;
}

/**
 * Sticky Right-Rail Booking Summary & Financial Itemization
 *
 * Displays live, itemized pricing per cabin and per guest, strictly enforcing
 * Lake Kenyir operating guidelines:
 * 1. Base Package Fare is distinguished from government/port pass-through fees.
 * 2. Adult country of residence drives domestic (RM 40) vs foreign (RM 70) tickets.
 * 3. Malaysian Tourism Tax (TTx) applies cabin-by-cabin (RM 10/night for foreign rooms).
 * 4. Travel agency commission is deducted strictly from the Package Fare subtotal.
 */
export function BookingSidebarSummary({
  packageInfo,
  dateLabel,
  quote,
  isLoading = false,
  step,
  onNext,
  canAdvance = true,
  actionLabel,
  onBack,
  backLabel,
  agencyCommissionPercent = 10,
  isCharter = false,
  charterGrandTotal = 0,
  vesselName = "Kenyir Luxury Fleet",
}: BookingSidebarSummaryProps) {
  // Toggle per-cabin detailed breakdown accordions
  const [expandedCabins, setExpandedCabins] = useState<Record<number, boolean>>({
    0: true, // Expand first cabin by default
  });

  const toggleCabin = (idx: number) => {
    setExpandedCabins((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const defaultActionLabels: Record<number, string> = {
    1: "Next: Personal Details",
    2: "Next: Review Summary",
    3: "Proceed to Confirm & Pay",
  };

  const currentActionLabel = actionLabel || defaultActionLabels[step] || "Continue";

  return (
    <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl">
      {/* Header: Expedition Package & Voyage Metadata */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-deep">
          {isCharter ? "Private Buyout Details" : "Expedition Details"}
        </span>
        <h4 className="font-display text-xl font-medium text-ink">
          {packageInfo.title}
        </h4>
        <div className="mt-1 text-xs text-text-muted">
          {packageInfo.durationNights} Nights | Pengkalan Gawi Berth (Roundtrip)
        </div>
        <div className="mt-1 font-semibold text-xs text-ink">{dateLabel}</div>
        <div className="mt-0.5 text-xs text-text-muted">{vesselName}</div>
      </div>

      {/* Charter Mode Simple Summary */}
      {isCharter ? (
        <div className="space-y-4 border-t border-ink/10 pt-4 text-xs">
          <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200/80">
            <span className="font-bold text-amber-900 block">Full Vessel Private Buyout</span>
            <span className="text-text-muted text-[11px] mt-0.5 block">
              100% exclusive vessel occupancy with full crew of 4–5 & private chef
            </span>
          </div>

          <div className="flex justify-between font-semibold text-ink pt-2">
            <span>Charter Base Fare</span>
            <span>{formatPrice(charterGrandTotal)}</span>
          </div>
        </div>
      ) : (
        /* Multi-Cabin Expeditions Dynamic Itemization */
        <div className="space-y-4 border-t border-ink/10 pt-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted">
            <span className="flex items-center gap-1.5">
              <Users className="size-3 text-teal-deep" />
              Stateroom Itemization ({quote?.totalCabins ?? 1} {quote?.totalCabins === 1 ? "Cabin" : "Cabins"})
            </span>
            {isLoading && <Loader2 className="size-3 animate-spin text-teal-deep" />}
          </div>

          {/* Cabin List */}
          <div className="space-y-3">
            {quote?.cabins.map((cabin, cIdx) => {
              const isExpanded = !!expandedCabins[cIdx];
              return (
                <div
                  key={cabin.cabinId || cIdx}
                  className="rounded-2xl border border-ink/8 bg-[#FAFAF8] p-3.5 text-xs transition-all"
                >
                  {/* Cabin Card Title & Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-ink">
                        Cabin {cIdx + 1}
                        {cabin.spotName ? ` · ${cabin.spotName}` : ""}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {cabin.adultsCount} Adult{cabin.adultsCount > 1 ? "s" : ""}
                        {cabin.childrenCount > 0 && ` + ${cabin.childrenCount} Child`}
                        {cabin.toddlersCount > 0 && ` + ${cabin.toddlersCount} Toddler`}
                        {cabin.infantsCount > 0 && ` + ${cabin.infantsCount} Infant`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-obsidian">
                        {formatPrice(cabin.cabinGrossTotal)}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCabin(cIdx)}
                        className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-deep hover:underline"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Breakdown"}</span>
                        {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Guest-by-Guest & Pass-Through Itemization */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2.5 border-t border-ink/10 pt-2.5 text-[11px]">
                      {/* Individual Guests */}
                      <div className="space-y-2">
                        {cabin.itemizedGuests.map((g) => (
                          <div key={g.guestIndex} className="rounded-lg bg-white p-2 border border-ink/5">
                            <div className="flex justify-between font-semibold text-ink">
                              <span>
                                {g.name}
                                <span className="ml-1 text-[10px] font-normal text-text-muted">
                                  ({g.category === "adult" ? "Adult" : g.category === "child" ? "Child (50%)" : g.category === "toddler" ? "Toddler" : "Infant FOC"})
                                </span>
                              </span>
                              <span>{formatPrice(g.packageFare)}</span>
                            </div>

                            {/* Pass-through breakdown */}
                            <div className="mt-1 space-y-0.5 text-[10px] text-text-muted">
                              <div className="flex justify-between">
                                <span>
                                  Attraction Ticket ({g.isMalaysian ? "Domestic RM40" : "Foreigner RM70"})
                                </span>
                                <span>{formatPrice(g.attractionTicket)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Gawi Jetty Terminal Fee</span>
                                <span>{formatPrice(g.jettyFee)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Marine Passenger Insurance</span>
                                <span>{formatPrice(g.insurance)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Solo Surcharge if Single Occupancy */}
                      {cabin.soloSurcharge > 0 && (
                        <div className="flex items-center justify-between text-amber-700 bg-amber-50/80 px-2 py-1 rounded">
                          <span className="flex items-center gap-1">
                            <Info className="size-3" /> Single Occupancy Surcharge
                          </span>
                          <span className="font-semibold">+{formatPrice(cabin.soloSurcharge)}</span>
                        </div>
                      )}

                      {/* Cabin-Wise Tourism Tax */}
                      <div className="flex items-center justify-between border-t border-ink/8 pt-1.5 text-[11px]">
                        <span className="text-text-muted">
                          Malaysian Tourism Tax (TTx):
                        </span>
                        {cabin.tourismTaxTotal > 0 ? (
                          <span className="font-semibold text-amber-800">
                            {formatPrice(cabin.tourismTaxTotal)}{" "}
                            <span className="text-[10px] font-normal text-text-muted">
                              (Foreign Room RM10/n)
                            </span>
                          </span>
                        ) : (
                          <span className="font-medium text-emerald-700 text-[10px]">
                            Exempt (Malaysian Guests)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Subtotals & Travel Agency Commission Breakdown */}
          {quote && (
            <div className="space-y-1.5 border-t border-ink/10 pt-3 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Gross Package Fares</span>
                <span className="font-semibold text-ink">
                  {formatPrice(quote.grossPackageFaresTotal)}
                </span>
              </div>

              {/* Agency Commission (Calculated strictly on package fare) */}
              {quote.agencyCommissionDiscountMYR > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="size-3" /> Agency Partner ({agencyCommissionPercent}%)
                  </span>
                  <span>-{formatPrice(quote.agencyCommissionDiscountMYR)}</span>
                </div>
              )}

              {/* Pass-Through Fees (Non-commissionable) */}
              <div className="flex justify-between text-text-muted">
                <span className="flex items-center gap-1">
                  Pass-Through Fees
                  <span className="text-[10px] text-text-muted/70">(Port &amp; Park)</span>
                </span>
                <span>{formatPrice(quote.totalPassThroughFeesMYR)}</span>
              </div>

              {/* Tourism Tax */}
              {quote.totalTourismTaxMYR > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Tourism Tax (Act 791)</span>
                  <span>{formatPrice(quote.totalTourismTaxMYR)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grand Total & Booking Deposit */}
      <div className="border-t border-ink/10 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-sm text-ink">Grand Total (MYR)</span>
          <span className="font-display text-2xl font-bold text-obsidian">
            {formatPrice(isCharter ? charterGrandTotal : quote?.grandTotalNetMYR ?? 0)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-text-muted">
          All park permits, jetty fees, excursions &amp; full-board artisanal meals included.
        </p>

        {/* Deposit breakdown if applicable */}
        {!isCharter && quote && (
          <div className="mt-3 rounded-xl bg-teal-soft/15 p-2.5 text-[11px] space-y-1">
            <div className="flex justify-between text-teal-deep font-semibold">
              <span>Deposit Due Now (30%):</span>
              <span>{formatPrice(quote.depositRequiredMYR)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Balance Due at Boarding:</span>
              <span>{formatPrice(quote.balanceDueMYR)}</span>
            </div>
          </div>
        )}

        {/* Action Button to Next Step */}
        {onNext && (
          <button
            type="button"
            disabled={!canAdvance || isLoading}
            onClick={onNext}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-obsidian py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Updating Quote…</span>
              </>
            ) : (
              <>
                <span>{currentActionLabel}</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        )}

        {/* Back Link */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-3 w-full text-center text-xs font-semibold text-text-muted hover:text-ink transition"
          >
            {backLabel || "← Previous Step"}
          </button>
        )}

        {/* Trust Badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Official Performa Dossier · Bank-Grade Verification</span>
        </div>
      </div>
    </div>
  );
}
