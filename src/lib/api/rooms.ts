import type { RoomCategory } from "@/types";
import { getNavoraRooms } from "@/lib/navora/client";

import { MOCK_ROOMS } from "./mock/rooms";

export async function getRoomsByVessel(vesselId: string): Promise<RoomCategory[]> {
  try {
    const remote = await getNavoraRooms(vesselId);
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return remote.map((r) => {
        const local = MOCK_ROOMS.find((m) => m.id === r.id);
        const price =
          typeof r.indicativePriceMYR === 'number'
            ? r.indicativePriceMYR
            : typeof r.baseCostPricePerRoomNight === 'number'
            ? r.baseCostPricePerRoomNight
            : Number(r.baseCostPricePerRoomNight) || local?.indicativePriceMYR || 1000;
        return {
          id: r.id || local?.id || 'room',
          vesselId: r.vesselId || vesselId,
          name: r.name || r.categoryName || local?.name || 'Stateroom',
          description: r.description || r.shortDescription || local?.description || '',
          amenities: r.amenities || local?.amenities || [],
          occupancy: r.occupancy || r.maxOccupancy || local?.occupancy || 2,
          indicativePriceMYR: price,
          image: r.image || local?.image || { src: null, alt: r.name || 'Room', width: 1448, height: 1086 },
        };
      });
    }
  } catch (err) {
    console.warn("[Rooms] Failed to fetch dynamic rooms from Navora, using fallback:", err);
  }
  return MOCK_ROOMS.filter((r) => r.vesselId === vesselId);
}

export async function getRoomsByIds(ids: string[]): Promise<RoomCategory[]> {
  const all = MOCK_ROOMS;
  return all.filter((r) => ids.includes(r.id));
}
