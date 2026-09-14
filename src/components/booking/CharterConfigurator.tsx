"use client";

import { Users, Shield, Info } from "lucide-react";
import { formatPrice } from "@/lib/format";
import {
  CHARTER_MIN_PAX,
  CHARTER_MAX_PAX,
  CHARTER_ROOMS_TOTAL,
  quoteCharter,
  type CharterPackageId,
} from "@/lib/charter-pricing";

interface CharterConfiguratorProps {
  packageId: CharterPackageId;
  pax: number;
  onPaxChange: (pax: number) => void;
  nonMalaysianPax: number;
  onNonMalaysianPaxChange: (n: number) => void;
  wantsInsurance: boolean;
  onWantsInsuranceChange: (v: boolean) => void;
}

export function CharterConfigurator({
  packageId,
  pax,
  onPaxChange,
  nonMalaysianPax,
  onNonMalaysianPaxChange,
  wantsInsurance,
  onWantsInsuranceChange,
}: CharterConfiguratorProps) {
  const quote = quoteCharter({ packageId, pax, nonMalaysianPax, wantsInsurance });

  return (
    <div className="space-y-6">
      {/* Pax slider */}
      <div className="rounded-2xl border border-ink/8 bg-white p-5">
        <div className="flex items-center justify-between">
          <label htmlFor="charter-pax" className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Users className="size-4 text-teal-deep" /> Total guests
          </label>
          <span className="font-display text-2xl font-medium text-obsidian">{pax}</span>
        </div>
        <input
          id="charter-pax"
          type="range"
          min={CHARTER_MIN_PAX}
          max={CHARTER_MAX_PAX}
          value={pax}
          onChange={(e) => {
            const next = Number(e.target.value);
            onPaxChange(next);
            if (nonMalaysianPax > next) onNonMalaysianPaxChange(next);
          }}
          className="mt-3 w-full max-w-md accent-teal-deep"
        />
        <div className="mt-1 flex max-w-md justify-between text-[11px] text-text-muted">
          <span>{CHARTER_MIN_PAX} min</span>
          <span>{CHARTER_ROOMS_TOTAL} rooms, quad-sharing</span>
          <span>{CHARTER_MAX_PAX} max</span>
        </div>

        <div className="mt-5 border-t border-ink/8 pt-4">
          <label htmlFor="charter-nonmy" className="flex max-w-md items-center justify-between text-sm text-ink">
            <span>Non-Malaysian guests</span>
            <span className="font-semibold">{nonMalaysianPax}</span>
          </label>
          <input
            id="charter-nonmy"
            type="range"
            min={0}
            max={pax}
            value={nonMalaysianPax}
            onChange={(e) => onNonMalaysianPaxChange(Number(e.target.value))}
            className="mt-3 w-full max-w-md accent-teal-deep"
          />
          <p className="mt-1 text-[11px] text-text-muted">
            Attraction tickets and tourism tax differ by nationality — set the split for an accurate quote.
          </p>
        </div>
      </div>

      {/* Insurance opt-in */}
      <button
        type="button"
        onClick={() => onWantsInsuranceChange(!wantsInsurance)}
        className="flex w-full items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4 text-left transition hover:border-teal-deep/40"
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
            wantsInsurance ? "border-teal-deep bg-teal-deep text-white" : "border-ink/20"
          }`}
        >
          {wantsInsurance && <Shield className="size-3" />}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-ink">Personal Accident Insurance</span>
          <span className="block text-xs text-text-muted">Optional — covers every guest for the charter</span>
        </span>
        <span className="text-sm font-semibold text-obsidian">
          +{formatPrice(quoteCharter({ packageId, pax, nonMalaysianPax, wantsInsurance: true }).insurance)}
        </span>
      </button>

      {/* Live price breakdown */}
      <div className="rounded-2xl border border-gold-bright/30 bg-gold-bright/5 p-5">
        <h4 className="mb-3 text-sm font-semibold text-ink">Charter quote</h4>
        <dl className="space-y-1.5 text-sm">
          <Row label={`Package (${pax} pax, all-inclusive)`} value={quote.packageTotal} />
          <Row label="Gawi Jetty fees" value={quote.jettyFees} />
          <Row label="Attractions entrance tickets" value={quote.attractionsFees} />
          {quote.tourismTax > 0 && <Row label={`Tourism tax (${quote.roomsUsed} rooms)`} value={quote.tourismTax} />}
          <Row label="Fuel charge" value={quote.fuelCharge} />
          {wantsInsurance && <Row label="Personal accident insurance" value={quote.insurance} />}
        </dl>
        <div className="mt-3 flex items-center justify-between border-t border-gold-bright/30 pt-3">
          <span className="text-sm font-semibold text-ink">Grand total</span>
          <span className="font-display text-2xl font-medium text-obsidian">{formatPrice(quote.grandTotal)}</span>
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-text-muted">
          <Info className="mt-0.5 size-3 shrink-0" />
          Guest counts between 30 and 60 are priced on the operator&apos;s group-rate schedule; jetty, attractions and
          fuel charges are compulsory per the charter rate card.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-ink">{formatPrice(value)}</dd>
    </div>
  );
}
