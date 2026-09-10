import { NextResponse } from "next/server";

import { lookupBooking } from "@/lib/api/checkin";

/**
 * §9.8: honest stub. Until the backend repo supports booking lookups, every
 * request gets the same truthful "not available yet" answer — never a fake
 * success state.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingCode =
      typeof body.bookingCode === "string" ? body.bookingCode.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (!bookingCode || !lastName) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const result = await lookupBooking({ bookingCode, lastName });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/checkin] failed:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
