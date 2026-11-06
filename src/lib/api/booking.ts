import type { CabinDeckSlot, MapWaypoint } from "@/types";
import { navoraFetch } from "@/lib/navora/client";
import { MOCK_CABIN_SLOTS, MOCK_WAYPOINTS, WATER_NAVIGATION_CHANNELS } from "./mock/booking";

export async function getWaypointsForPackage(packageSlug: string): Promise<MapWaypoint[]> {
  return MOCK_WAYPOINTS[packageSlug] || MOCK_WAYPOINTS["3d2n-kenyir-explorer"] || [];
}

export async function getWaterNavigationChannel(packageSlug: string): Promise<[number, number][]> {
  return WATER_NAVIGATION_CHANNELS[packageSlug] || WATER_NAVIGATION_CHANNELS["3d2n-kenyir-explorer"] || [];
}

export async function getAllWaypoints(): Promise<MapWaypoint[]> {
  // Return unique waypoints combined
  const map = new Map<string, MapWaypoint>();
  Object.values(MOCK_WAYPOINTS).flat().forEach((wp) => {
    if (!map.has(wp.id)) {
      map.set(wp.id, wp);
    }
  });
  return Array.from(map.values());
}

export async function getCabinDeckSlots(): Promise<CabinDeckSlot[]> {
  return MOCK_CABIN_SLOTS;
}

export interface StorefrontBookingPayload {
  source?: string;
  bookingType?: "standard" | "charter";
  vesselId: string;
  packageSlug: string;
  departureDate: string;
  leadGuest: {
    fullName: string;
    email: string;
    phone: string;
    nationality?: string;
  };
  passengers: Array<{
    isPrimary?: boolean;
    fullName: string;
    email?: string;
    phone?: string;
    ageCategory?: string;
  }>;
  staterooms: Array<{
    roomCategoryId: string;
    roomNumber?: string;
    occupancyPax: number;
  }>;
  pricing: {
    currency: string;
    subtotal: number;
    sstRatePercent?: number;
    sstAmount?: number;
    totalAmount: number;
    depositRequired?: number;
  };
  specialRequests?: string;
}

export interface StorefrontBookingResponse {
  bookingId: string;
  bookingReference: string;
  status: string;
  paymentStatus: string;
  checkoutUrl?: string;
}

export async function submitStorefrontBooking(
  payload: StorefrontBookingPayload,
): Promise<StorefrontBookingResponse | null> {
  const result = await navoraFetch<StorefrontBookingResponse>("/api/public/storefront/bookings", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      source: "website",
    }),
  });

  if (result) {
    return result;
  }

  // Graceful local fallback simulation when unconfigured or offline
  const prefix = payload.bookingType === "charter" ? "CH" : "SC";
  const ref = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    bookingId: `bk-local-${Date.now()}`,
    bookingReference: ref,
    status: "pending_payment",
    paymentStatus: "unpaid",
    checkoutUrl: `/booking/confirmation?ref=${ref}`,
  };
}

