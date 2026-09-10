import type { RoomCategory } from "@/types";

import { MOCK_ROOMS } from "./mock/rooms";

export async function getRoomsByVessel(vesselId: string): Promise<RoomCategory[]> {
  return MOCK_ROOMS.filter((r) => r.vesselId === vesselId);
}

export async function getRoomsByIds(ids: string[]): Promise<RoomCategory[]> {
  return MOCK_ROOMS.filter((r) => ids.includes(r.id));
}
