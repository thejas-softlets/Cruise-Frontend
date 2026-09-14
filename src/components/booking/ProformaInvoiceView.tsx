"use client";

import { Printer, MessageCircle, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/utils";

export interface ProformaInvoiceData {
  referenceNumber: string; // e.g. #SCA26-03-0037
  createdDate: string;
  vesselName: string;
  packageTitle: string;
  durationNights: number;
  datesLabel: string;
  leadGuest: {
    name: string;
    email: string;
    phone: string;
    country: string;
    state?: string;
  };
  rooms: Array<{
    roomNumber: number;
    categoryName: string;
    spotLabel: string;
    guests: Array<{
      name: string;
      packageFare: number;
      entranceTickets: number;
      jettyFee: number;
      insurance: number;
    }>;
    tourismTax: number;
    roomTotal: number;
  }>;
  specialRequests?: string;
  subtotal: number;
  discount: number;
  discountLabel?: string;
  discountPercent?: number;
  grandTotal: number;
  depositAmount: number;
  depositPercent?: number;
  balanceDue: number;
  isCharter?: boolean;
}

export function ProformaInvoiceView({ data }: { data: ProformaInvoiceData }) {
  const totalAdults = data.rooms.reduce(
    (sum, r) => sum + r.guests.length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-ink/15 bg-white p-6 sm:p-10 shadow-2xl print:m-0 print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
      {/* Action Bar (Hidden on Print) */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-6 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-deep">
          <ShieldCheck className="size-4" />
          <span>Verified Proforma Invoice Dossier</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-ink/5 shadow-xs"
          >
            <Printer className="size-3.5" />
            <span>Print Invoice</span>
          </button>

          <a
            href={whatsappLink(
              WHATSAPP_NUMBER,
              `Hello Summer Cruise Concierge! Here is my invoice ref: ${data.referenceNumber} for ${data.packageTitle} (${data.datesLabel}). I would like to confirm my CIMB payment.`
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-95 shadow-xs"
          >
            <MessageCircle className="size-3.5" />
            <span>Submit Payment to Concierge</span>
          </a>
        </div>
      </div>

      {/* Official Invoice Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b-2 border-ink/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-teal-deep">
              SummerCruise
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-widest text-text-muted uppercase">
            Tasik Kenyir · Terengganu · Malaysia
          </p>
          <div className="mt-3 text-xs text-text-muted space-y-0.5">
            <p>Summer Bay Travels & Tours Sdn. Bhd. (1165017-V)</p>
            <p>219-E, Hotel Ming Paragon, Jalan Sultan Zainal Abidin</p>
            <p>20000 Kuala Terengganu, Terengganu, Malaysia</p>
            <p>Tel: +60 17 981 9827 | Email: enquiry@summercruise.com.my</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="inline-block rounded-md bg-teal-deep/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-teal-deep">
            Proforma Invoice
          </span>
          <div className="mt-2 font-mono text-xl font-bold tracking-tight text-ink">
            {data.referenceNumber}
          </div>
          <p className="text-[11px] text-text-muted">
            Note down this number for bank transfer reference
          </p>
          <p className="mt-2 text-[11px] text-text-muted">
            Issued: {data.createdDate} | Validated
          </p>
        </div>
      </div>

      {/* Reservation Summary Bar */}
      <div className="mt-6 rounded-2xl bg-[#F8F9FA] p-5 border border-ink/8 text-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Voyage & Vessel
            </span>
            <div className="font-semibold text-ink mt-0.5">{data.packageTitle}</div>
            <div className="text-text-muted">{data.vesselName}</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Sailing Schedule
            </span>
            <div className="font-semibold text-ink mt-0.5">{data.datesLabel}</div>
            <div className="text-text-muted">{data.durationNights} Nights Expedition</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Passenger Manifest
            </span>
            <div className="font-semibold text-ink mt-0.5">
              {data.rooms.length} Staterooms, {totalAdults} Guests
            </div>
            <div className="text-text-muted">Pengkalan Gawi Berth</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Lead Passenger
            </span>
            <div className="font-semibold text-ink mt-0.5">{data.leadGuest.name}</div>
            <div className="text-text-muted truncate">{data.leadGuest.email}</div>
          </div>
        </div>

        {data.specialRequests && (
          <div className="mt-4 pt-3 border-t border-ink/8">
            <span className="font-bold text-ink">Special Requests: </span>
            <span className="text-text-muted">{data.specialRequests}</span>
          </div>
        )}
      </div>

      {/* Itemized Room-by-Room Passenger Manifest Breakdown */}
      <div className="mt-8">
        <h4 className="font-display text-base font-semibold uppercase tracking-wider text-ink mb-4">
          Itemized Stateroom Breakdown
        </h4>

        <div className="space-y-4">
          {data.rooms.map((room) => (
            <div
              key={room.roomNumber}
              className="rounded-2xl border border-ink/10 overflow-hidden bg-white"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between bg-ink/5 px-5 py-3 border-b border-ink/8">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase text-teal-deep">
                    Room {room.roomNumber}
                  </span>
                  <span className="text-xs font-semibold text-ink">
                    · {room.categoryName} ({room.spotLabel})
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-ink">
                  Room Total: {formatPrice(room.roomTotal)}
                </span>
              </div>

              {/* Guest Lines */}
              <div className="p-5 space-y-4 text-xs divide-y divide-ink/8">
                {room.guests.map((g, gIdx) => (
                  <div key={gIdx} className={gIdx > 0 ? "pt-3" : ""}>
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>({gIdx + 1}) {g.name}</span>
                      <span>{formatPrice(g.packageFare)}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-text-muted space-y-0.5">
                      <div className="flex justify-between">
                        <span>Attraction Entrance Tickets (Lasir & Kelah Sanctuary)</span>
                        <span>{formatPrice(g.entranceTickets)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gawi Jetty Terminal Marine Fees</span>
                        <span>{formatPrice(g.jettyFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marine Passenger Insurance</span>
                        <span>{formatPrice(g.insurance)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {room.tourismTax > 0 && (
                  <div className="pt-2 flex justify-between text-[11px] text-text-muted">
                    <span>Tourism Tax (Foreign Passport Holders)</span>
                    <span>{formatPrice(room.tourismTax)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals & Grand Summary */}
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end">
        <div className="w-full sm:w-80 rounded-2xl bg-[#F8F9FA] p-5 border border-ink/10 space-y-2 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>Subtotal:</span>
            <span className="font-semibold text-ink">{formatPrice(data.subtotal)}</span>
          </div>

          {data.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>{data.discountLabel || `Travel Agency Commission (${data.discountPercent ?? 10}%):`}</span>
              <span>-{formatPrice(data.discount)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-ink/10 pt-2 font-display text-lg font-bold text-ink">
            <span>Grand Total:</span>
            <span className="text-teal-deep">{formatPrice(data.grandTotal)}</span>
          </div>

          <div className="flex justify-between border-t border-ink/10 pt-2 text-text-muted">
            <span>Security Deposit Due ({data.depositPercent ?? 30}%):</span>
            <span className="font-semibold text-ink">{formatPrice(data.depositAmount)}</span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Balance Due at Check-in:</span>
            <span className="font-semibold text-ink">{formatPrice(data.balanceDue)}</span>
          </div>
        </div>
      </div>

      {/* Official CIMB Bank Details Block (Exact Match from PDF) */}
      <div className="mt-8 rounded-2xl border-2 border-teal-deep/30 bg-teal-deep/5 p-6 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-teal-deep">
          <span>Official Payment & Bank Details</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-text-muted">Bank Name:</span>
            <div className="font-semibold text-ink">Commerce International Merchant Bankers (CIMB)</div>
          </div>

          <div>
            <span className="text-text-muted">Account Holder Name:</span>
            <div className="font-semibold text-ink">SUMMER BAY TRAVELS & TOURS SDN. BHD.</div>
          </div>

          <div>
            <span className="text-text-muted">Account Number:</span>
            <div className="font-mono text-base font-bold text-teal-deep">8007816670</div>
          </div>

          <div>
            <span className="text-text-muted">Swift Code:</span>
            <div className="font-mono font-semibold text-ink">CIBBMYKL</div>
          </div>
        </div>

        <div className="text-[11px] text-text-muted pt-2 border-t border-teal-deep/15 leading-relaxed">
          Please include your Reference Number <strong className="font-mono text-ink">{data.referenceNumber}</strong> in the bank transfer payment description and forward the transfer receipt via WhatsApp to <strong>+60 17 981 9827</strong>.
        </div>
      </div>

      {/* Official Terms & Notice (Exact Match from PDF) */}
      <div className="mt-8 border-t border-ink/10 pt-6 text-[11px] leading-relaxed text-text-muted space-y-2">
        <p className="font-bold text-ink">Important Notes & Maritime Regulations:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Departure time of Summer Cruise / Green Horizon from Gawi Jetty is 13:00 (Standby at 12:00 at Dataran Gawi).</li>
          <li>Disembarkation at Gawi Jetty: 3D2N at 13:00 & 4D3N at 11:00. Room check-in 14:30; check-out 09:30.</li>
          <li>Kindly provide individual guest names and IC/Passport numbers at least 2 weeks prior to departure for national park manifest clearance.</li>
          <li>Luggage weight limit: 20kg per passenger (maximum 2 bags). Overweight baggage charges apply.</li>
          <li>Bringing explosives, flammable substances, or unauthorized fireworks on board is strictly prohibited.</li>
        </ul>
      </div>
    </div>
  );
}
