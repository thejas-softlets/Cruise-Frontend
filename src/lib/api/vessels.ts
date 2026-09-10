import type { Vessel } from "@/types";

import { MOCK_VESSELS } from "./mock/vessels";

export async function getAllVessels(): Promise<Vessel[]> {
  // Phase 5: swap to fetch(`${process.env.API_BASE}/vessels`).
  return MOCK_VESSELS;
}

export async function getVesselById(id: string): Promise<Vessel | undefined> {
  return MOCK_VESSELS.find((v) => v.id === id);
}
