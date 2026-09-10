import { SITE } from "@/lib/site";

export interface EnquiryRecord extends Record<string, unknown> {
  ref: string;
  receivedAt: string;
  payload: {
    name: string;
    phone: string;
    email?: string;
    preferredDate?: string;
    adults: number;
    children: number;
    message?: string;
    source: string;
    packageSlug?: string;
    offerSlug?: string;
    vesselId?: string;
    bookingType?: string;
    preferredLanguage?: string;
  };
}

function makeRef() {
  return `ENQ-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * §9.5: enquiry delivery is functional at launch, independent of the backend
 * repo. Resend when RESEND_API_KEY is set; a console transport otherwise so
 * local/preview submissions are still observable.
 */
export async function submitEnquiry(payload: EnquiryRecord["payload"]): Promise<EnquiryRecord> {
  const record: EnquiryRecord = {
    ref: makeRef(),
    receivedAt: new Date().toISOString(),
    payload,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL ?? SITE.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },          body: JSON.stringify({
          from: "Summer Cruise <enquiries@summercruise.example>",
          to: [to],
          subject: `New enquiry ${record.ref} — ${payload.source}${payload.packageSlug ? ` (${payload.packageSlug})` : ""}`,
          text: JSON.stringify(record, null, 2),
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } catch (err) {
      console.error("[enquiry] Resend delivery failed:", err);
      console.info("[enquiry] Full record (console transport):", JSON.stringify(record, null, 2));
    }
  } else {
    console.info("[enquiry] Full record (console transport):", JSON.stringify(record, null, 2));
  }

  return record;
}
