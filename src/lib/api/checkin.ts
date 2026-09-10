import type { CheckInPayload, CheckInResponse } from "@/types";

/**
 * §9.8: /check-in ships as an honest page. Until the backend repo supports
 * booking lookups, every lookup returns the same truthful response — there is
 * never a fake success state.
 */
export async function lookupBooking(_payload: CheckInPayload): Promise<CheckInResponse> {
  return {
    status: "not-available-yet",
    message: "Online check-in opens 30 days before departure.",
  };
}
