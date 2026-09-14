import { NextResponse } from "next/server";
import {
  quoteMultiCabinBooking,
  checkIsMalaysian,
  type CabinBookingInput,
  type GuestConfig,
} from "@/lib/booking-pricing";

interface RawGuestInput {
  category?: "adult" | "child" | "toddler" | "infant";
  name?: string;
  country?: string;
  dob?: { day: string; month: string; year: string };
  email?: string;
  phone?: string;
}

interface RawCabinInput {
  id?: string;
  cabinId?: string;
  adults?: number;
  adultsCount?: number;
  children?: number;
  childrenCount?: number;
  toddlers?: number;
  toddlersCount?: number;
  infants?: number;
  infantsCount?: number;
  spotId?: string | null;
  spotName?: string;
  roomCategoryName?: string;
  guests?: RawGuestInput[];
}

interface QuoteRequestBody {
  packageSlug: string;
  vesselId?: "summer-cruise" | "green-horizon";
  departureDateIso: string;
  cabins?: RawCabinInput[];
  agencyCommissionPercent?: number;
  mode?: "cabin" | "charter";
  charterPax?: number;
  nonMalaysianPax?: number;
}

export async function POST(request: Request) {
  try {
    const body: QuoteRequestBody = await request.json();
    const {
      packageSlug,
      departureDateIso,
      cabins: rawCabins = [],
      agencyCommissionPercent = 10,
      mode = "cabin",
      charterPax = 16,
      nonMalaysianPax = 0,
      vesselId: rawVesselId,
    } = body;

    const is4D3N = packageSlug ? packageSlug.includes("4d3n") : false;
    const nights = is4D3N ? 3 : 2;
    const vesselId =
      rawVesselId === "green-horizon" || rawVesselId === "summer-cruise"
        ? rawVesselId
        : is4D3N
        ? "green-horizon"
        : "summer-cruise";

    // ================== CHARTER MODE ==================
    if (mode === "charter") {
      const baseCharterRate = is4D3N
        ? vesselId === "green-horizon" ? 26000 : 22000
        : vesselId === "green-horizon" ? 20000 : 18000;
      const maxPax = vesselId === "green-horizon" ? 30 : 24;
      const actualPax = Math.min(maxPax, Math.max(1, charterPax));

      const jettyFeePerPax = 10;
      const entranceTicketsPerPax = is4D3N ? 70 : 40;
      const insurancePerPax = 7.5;
      const tourismTaxPerNonMalaysian = 20;

      const ticketsTotal = actualPax * entranceTicketsPerPax;
      const jettyTotal = actualPax * jettyFeePerPax;
      const insuranceTotal = Math.round(actualPax * insurancePerPax);
      const tourismTaxTotal = nonMalaysianPax * tourismTaxPerNonMalaysian;

      // Agency commission / early bird discount strictly on base charter fare
      const commissionDiscount = Math.round(baseCharterRate * (agencyCommissionPercent / 100));
      const grandTotalMYR =
        baseCharterRate -
        commissionDiscount +
        ticketsTotal +
        jettyTotal +
        insuranceTotal +
        tourismTaxTotal;

      return NextResponse.json({
        success: true,
        mode: "charter",
        vesselId,
        nights,
        baseCharterRate,
        agencyCommissionDiscountMYR: commissionDiscount,
        charterPax: actualPax,
        maxPax,
        ticketsTotal,
        jettyTotal,
        insuranceTotal,
        tourismTaxTotal,
        subtotalMYR: baseCharterRate - commissionDiscount,
        grandTotalMYR,
        currency: "MYR",
        formattedGrandTotal: `RM ${grandTotalMYR.toLocaleString("en-MY")}`,
        ratePerAdult: Math.round(grandTotalMYR / actualPax),
      });
    }

    // ================== MULTI-CABIN EXPEDITION MODE ==================
    const normalizedCabins: CabinBookingInput[] = (
      rawCabins.length > 0
        ? rawCabins
        : [
            {
              id: "cabin-1",
              adults: 2,
              children: 0,
              toddlers: 0,
              infants: 0,
              spotId: null,
            },
          ]
    ).map((c, idx) => {
      const adultsCount = c.adultsCount ?? c.adults ?? 2;
      const childrenCount = c.childrenCount ?? c.children ?? 0;
      const toddlersCount = c.toddlersCount ?? c.toddlers ?? 0;
      const infantsCount = c.infantsCount ?? c.infants ?? 0;

      const guests: GuestConfig[] = (c.guests || []).map((g, gIdx) => {
        const country = g.country || "Malaysia";
        return {
          id: `c${idx + 1}-g${gIdx + 1}`,
          category: g.category || (gIdx < adultsCount ? "adult" : "child"),
          name: g.name || `Guest ${gIdx + 1}`,
          country,
          isMalaysian: checkIsMalaysian(country),
          dob: g.dob,
          email: g.email,
          phone: g.phone,
        };
      });

      return {
        cabinId: c.cabinId || c.id || `cabin-${idx + 1}`,
        spotId: c.spotId ?? null,
        spotName: c.spotName,
        roomCategoryName: c.roomCategoryName,
        adultsCount,
        childrenCount,
        toddlersCount,
        infantsCount,
        guests,
      };
    });

    const summary = quoteMultiCabinBooking(
      packageSlug || "3d2n-kenyir-explorer",
      departureDateIso || "2026-11-06",
      normalizedCabins,
      agencyCommissionPercent
    );

    return NextResponse.json({
      success: true,
      mode: "cabin",
      ...summary,
      // Backwards compatibility mappings for older summary displays
      subtotalMYR: summary.subtotalGrossMYR,
      feesTotalMYR: summary.totalPassThroughFeesMYR + summary.totalTourismTaxMYR,
      grandTotalMYR: summary.grandTotalNetMYR,
      overallRatePerAdult: summary.averageRatePerAdultMYR,
      formattedGrandTotal: `RM ${summary.grandTotalNetMYR.toLocaleString("en-MY")}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate quote";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

