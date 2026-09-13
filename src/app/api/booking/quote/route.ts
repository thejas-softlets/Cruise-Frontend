import { NextResponse } from "next/server";
import { SC_CABIN_SPOTS } from "@/lib/sc-deck-plan";
import { GH_CABIN_SPOTS } from "@/lib/gh-deck-plan";

interface CabinInput {
  adults: number;
  children: number;
  spotId: string | null;
}

interface QuoteRequestBody {
  packageSlug: string;
  departureDateIso: string;
  cabins?: CabinInput[];
  mode?: "cabin" | "charter";
  charterPax?: number;
  nonMalaysianPax?: number;
}

export async function POST(request: Request) {
  try {
    const body: QuoteRequestBody = await request.json();
    const { packageSlug, departureDateIso, cabins = [], mode = "cabin", charterPax = 16, nonMalaysianPax = 0 } = body;

    const is4D3N = packageSlug.includes("4d3n");
    const nights = is4D3N ? 3 : 2;
    const vesselId = is4D3N ? "green-horizon" : "summer-cruise";
    const allSpots = vesselId === "green-horizon" ? GH_CABIN_SPOTS : SC_CABIN_SPOTS;

    // Check if departure qualifies for early bird
    const depDate = new Date(departureDateIso || "2026-11-01");
    const isEarlyBird = [1, 2, 5, 9, 10, 11].includes(depDate.getMonth() + 1);

    // ================== CHARTER MODE ==================
    if (mode === "charter") {
      const baseCharterRate = is4D3N ? 26000 : 18000;
      const maxPax = is4D3N ? 30 : 24;
      const actualPax = Math.min(maxPax, Math.max(1, charterPax));
      
      const jettyFeePerPax = 10;
      const entranceTicketsPerPax = is4D3N ? 70 : 40;
      const insurancePerPax = 7.5;
      const tourismTaxPerNonMalaysian = 20;

      const ticketsTotal = actualPax * entranceTicketsPerPax;
      const jettyTotal = actualPax * jettyFeePerPax;
      const insuranceTotal = Math.round(actualPax * insurancePerPax);
      const tourismTaxTotal = nonMalaysianPax * tourismTaxPerNonMalaysian;

      const earlyBirdDiscount = isEarlyBird ? Math.round(baseCharterRate * 0.05) : 0;
      const grandTotalMYR = baseCharterRate - earlyBirdDiscount + ticketsTotal + jettyTotal + insuranceTotal + tourismTaxTotal;

      return NextResponse.json({
        success: true,
        mode: "charter",
        vesselId,
        nights,
        isEarlyBird,
        baseCharterRate,
        earlyBirdDiscount,
        charterPax: actualPax,
        maxPax,
        ticketsTotal,
        jettyTotal,
        insuranceTotal,
        tourismTaxTotal,
        subtotalMYR: baseCharterRate - earlyBirdDiscount,
        grandTotalMYR,
        currency: "MYR",
        formattedGrandTotal: `RM ${grandTotalMYR.toLocaleString("en-MY")}`,
        ratePerAdult: Math.round(grandTotalMYR / actualPax),
      });
    }

    // ================== CABIN MODE ==================
    let totalAdults = 0;
    let totalChildren = 0;

    const cabinQuotes = cabins.map((cabin, idx) => {
      const spot = allSpots.find((s) => s.id === cabin.spotId);
      // Base double-occupancy rate per adult: 3D2N = RM 1,450; 4D3N = RM 2,050
      const basePerAdultDouble = spot?.basePriceMYR
        ? spot.basePriceMYR * nights
        : is4D3N ? 2050 : 1450;

      // When 1 adult in cabin (solo occupancy): rate per adult is higher (solo supplement 25%)
      // When 2 adults in cabin (double occupancy): rate per adult drops to base (e.g. 1450 vs 1800)
      const isSolo = cabin.adults === 1 && cabin.children === 0;
      const soloSurcharge = isSolo ? Math.round(basePerAdultDouble * 0.25) : 0;

      const adultTotalGross = (cabin.adults * basePerAdultDouble) + soloSurcharge;
      
      // Children: 50% of adult base rate
      const childRate = Math.round(basePerAdultDouble * 0.5);
      const childrenTotal = cabin.children * childRate;

      // Early bird discount: 5% off package fare
      const grossFare = adultTotalGross + childrenTotal;
      const earlyBirdDiscount = isEarlyBird ? Math.round(grossFare * 0.05) : 0;
      const packageFareNet = grossFare - earlyBirdDiscount;

      // Per-guest official fees matching PDF proforma invoice
      const entranceTicketsPerGuest = is4D3N ? 70 : 40;
      const jettyFeePerGuest = 10;
      const insurancePerGuest = 7.5;
      const totalGuestsInCabin = cabin.adults + cabin.children;

      const entranceTicketsTotal = totalGuestsInCabin * entranceTicketsPerGuest;
      const jettyFeesTotal = totalGuestsInCabin * jettyFeePerGuest;
      const insuranceTotal = Math.round(totalGuestsInCabin * insurancePerGuest);
      const tourismTaxTotal = 0; // standard domestic

      const total = packageFareNet + entranceTicketsTotal + jettyFeesTotal + insuranceTotal + tourismTaxTotal;

      totalAdults += cabin.adults;
      totalChildren += cabin.children;

      const ratePerAdult = cabin.adults > 0 ? Math.round(total / cabin.adults) : total;

      return {
        cabinIndex: idx,
        spotId: cabin.spotId,
        spotName: spot?.name || `Cabin ${idx + 1}`,
        planLabel: spot?.planLabel || "—",
        adults: cabin.adults,
        children: cabin.children,
        basePerAdultDouble,
        isSolo,
        soloSurcharge,
        ratePerAdult,
        adultTotalGross,
        childRate,
        childrenTotal,
        earlyBirdDiscount,
        packageFareNet,
        entranceTicketsTotal,
        jettyFeesTotal,
        insuranceTotal,
        tourismTaxTotal,
        total,
      };
    });

    const subtotalMYR = cabinQuotes.reduce((sum, c) => sum + c.packageFareNet, 0);
    const feesTotalMYR = cabinQuotes.reduce(
      (sum, c) => sum + c.entranceTicketsTotal + c.jettyFeesTotal + c.insuranceTotal + c.tourismTaxTotal,
      0
    );
    const grandTotalMYR = subtotalMYR + feesTotalMYR;
    const overallRatePerAdult = totalAdults > 0 ? Math.round(grandTotalMYR / totalAdults) : grandTotalMYR;

    return NextResponse.json({
      success: true,
      mode: "cabin",
      vesselId,
      nights,
      isEarlyBird,
      totalAdults,
      totalChildren,
      cabins: cabinQuotes,
      subtotalMYR,
      feesTotalMYR,
      grandTotalMYR,
      overallRatePerAdult,
      currency: "MYR",
      formattedGrandTotal: `RM ${grandTotalMYR.toLocaleString("en-MY")}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate quote";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
