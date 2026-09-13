import { NextResponse } from "next/server";

import { submitEnquiry } from "@/lib/api/enquiry";

const VALID_SOURCES = new Set([
  "package-detail",
  "offer-detail",
  "gift-voucher",
  "private-charter",
  "contact",
  "how-it-works",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Minimal server-side validation mirroring the client form (§9.5).
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (name.length < 2 || phone.length < 6) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const source = VALID_SOURCES.has(body.source) ? body.source : "contact";

    const record = await submitEnquiry({
      name,
      phone,
      email: typeof body.email === "string" && body.email.includes("@") ? body.email : undefined,
      preferredDate:
        typeof body.preferredDate === "string" && body.preferredDate
          ? body.preferredDate
          : undefined,
      adults: Number.isFinite(body.adults) ? Math.max(1, Number(body.adults)) : 2,
      children: Number.isFinite(body.children) ? Math.max(0, Number(body.children)) : 0,
      message: typeof body.message === "string" && body.message ? body.message : undefined,
      source,
      packageSlug: typeof body.packageSlug === "string" ? body.packageSlug : undefined,
      offerSlug: typeof body.offerSlug === "string" ? body.offerSlug : undefined,
      vesselId: typeof body.vesselId === "string" ? body.vesselId : undefined,
      bookingType: typeof body.bookingType === "string" ? body.bookingType : undefined,
      preferredLanguage:
        body.preferredLanguage === "en" ? "en" : undefined,
    });

    return NextResponse.json({ ref: record.ref });
  } catch (err) {
    console.error("[api/enquiry] failed:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
