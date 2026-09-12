import type { CabinDeckSlot, MapWaypoint } from "@/types";
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
