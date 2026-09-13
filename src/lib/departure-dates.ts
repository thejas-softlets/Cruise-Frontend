/**
 * Both vessels sail every Monday and Friday at 12:00pm from Pengkalan Gawi
 * Jetty (confirmed on the Green Horizon Charter Package brochure and matched
 * site-wide for Summer Cruise). Bookings open from today up to a year out;
 * past dates are never offered.
 */
const SAILING_DAYS = [1, 5]; // Mon, Fri (0=Sun ... 6=Sat)
const BOOKING_WINDOW_DAYS = 365;

export type AvailabilityStatus = "green" | "yellow" | "orange" | "red";

export interface VesselAvailability {
  availableCabins: number; // 0 to 12
  totalCabins: number; // 12
  status: AvailabilityStatus;
  statusLabel: string;
  canCharter: boolean; // strictly true ONLY when 0 cabins are booked (12/12 available)
}

export interface DepartureDate {
  date: Date;
  iso: string;
  /** e.g. "Fri, 14 Nov 2026" */
  label: string;
  dayName: "Monday" | "Friday";
  /** Backward-compatible demand indicator */
  demand: "open" | "selling-fast" | "full";
  /** Aqua Expeditions-style availability matrix per vessel */
  vessels: {
    "summer-cruise": VesselAvailability;
    "green-horizon": VesselAvailability;
  };
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/**
 * Deterministic pseudo-random availability so it stays consistent between renders.
 * 12 total cabins per vessel (single accommodation deck).
 */
function getVesselInventory(seed: number, isGreenHorizon: boolean): VesselAvailability {
  const mod = (seed + (isGreenHorizon ? 3 : 0)) % 10;
  let availableCabins = 12;

  if (mod === 0) {
    availableCabins = 12; // 100% free - Eligible for full private charter!
  } else if (mod === 1 || mod === 5) {
    availableCabins = 9; // High availability
  } else if (mod === 2 || mod === 7) {
    availableCabins = 5; // Moderate / Filling fast
  } else if (mod === 4 || mod === 8) {
    availableCabins = 2; // Limited / Last cabins
  } else if (mod === 9) {
    availableCabins = 0; // Sold out
  } else {
    availableCabins = 12; // Also full availability
  }

  let status: AvailabilityStatus = "green";
  let statusLabel = "Available (8+ Cabins)";

  if (availableCabins === 0) {
    status = "red";
    statusLabel = "Sold Out";
  } else if (availableCabins <= 3) {
    status = "orange";
    statusLabel = `Only ${availableCabins} Cabins Left`;
  } else if (availableCabins <= 7) {
    status = "yellow";
    statusLabel = `${availableCabins} Cabins Open`;
  } else {
    status = "green";
    statusLabel = `${availableCabins} Cabins Available`;
  }

  return {
    availableCabins,
    totalCabins: 12,
    status,
    statusLabel,
    canCharter: availableCabins === 12,
  };
}

/**
 * Returns upcoming sailing dates within the booking window.
 */
export function getDepartureDates(options?: { includeFull?: boolean; limit?: number }): DepartureDate[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowEnd = addDays(today, BOOKING_WINDOW_DAYS);

  const dates: DepartureDate[] = [];
  let cursor = new Date(today);
  let index = 0;

  // Advance to the first sailing day at or after today.
  while (!SAILING_DAYS.includes(cursor.getDay())) {
    cursor = addDays(cursor, 1);
  }

  while (cursor <= windowEnd) {
    const scInv = getVesselInventory(index, false);
    const ghInv = getVesselInventory(index, true);

    const isFull = scInv.status === "red" && ghInv.status === "red";
    const demand: DepartureDate["demand"] =
      isFull ? "full" : (scInv.status === "orange" || ghInv.status === "orange") ? "selling-fast" : "open";

    if (options?.includeFull || !isFull) {
      dates.push({
        date: new Date(cursor),
        iso: cursor.toISOString().slice(0, 10),
        label: cursor.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        dayName: cursor.getDay() === 1 ? "Monday" : "Friday",
        demand,
        vessels: {
          "summer-cruise": scInv,
          "green-horizon": ghInv,
        },
      });
    }
    index += 1;
    cursor = addDays(cursor, cursor.getDay() === 5 ? 3 : 4); // Fri->Mon (3d), Mon->Fri (4d)
    if (options?.limit && dates.length >= options.limit) break;
  }

  return dates;
}
