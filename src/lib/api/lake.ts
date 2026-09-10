import type { LakeInfo } from "@/types";

import { MOCK_LAKE } from "./mock/lake";

export async function getLakeInfo(): Promise<LakeInfo> {
  return MOCK_LAKE;
}
