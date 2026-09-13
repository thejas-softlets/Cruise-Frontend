/**
 * Both vessels sail every Monday and Friday at 12:00pm from Pengkalan Gawi
 * Jetty (confirmed on the Green Horizon Charter Package brochure and matched
 * site-wide for Summer Cruise). Bookings open from today up to a year out;
 * past dates are never offered.
 */
const SAILING_DAYS = [1, 5]; // Mon, Fri (0=Sun ... 6=Sat)
const BOOKING_WINDOW_DAYS = 365;

export interface DepartureDate {
  date: Date;
  iso: string;
  /** e.g. "Fri, 14 Nov 2026" */
  label: string;
  dayName: "Monday" | "Friday";
  /** A few upcoming sailings are flagged for demo flavour — not real inventory. */
  demand: "open" | "selling-fast" | "full";
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** Deterministic pseudo-random demand flavour so it doesn't reshuffle on every render. */
function demandFor(index: number): DepartureDate["demand"] {
  const cycle = index % 7;
  if (cycle === 2) return "full";
  if (cycle === 4 || cycle === 6) return "selling-fast";
  return "open";
}

/**
 * Returns upcoming sailing dates within the booking window. Excludes fully
 * booked demo dates by default (pass includeFull to show them, disabled, in a
 * calendar-style picker).
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
    const demand = demandFor(index);
    if (options?.includeFull || demand !== "full") {
      dates.push({
        date: new Date(cursor),
        iso: cursor.toISOString().slice(0, 10),
        label: cursor.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        dayName: cursor.getDay() === 1 ? "Monday" : "Friday",
        demand,
      });
    }
    index += 1;
    cursor = addDays(cursor, cursor.getDay() === 5 ? 3 : 4); // Fri->Mon (3d), Mon->Fri (4d)
    if (options?.limit && dates.length >= options.limit) break;
  }

  return dates;
}
