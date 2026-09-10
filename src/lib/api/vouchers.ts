import type { GiftVoucherOption } from "@/types";

import { MOCK_VOUCHERS } from "./mock/lake";

export async function getVoucherOptions(): Promise<GiftVoucherOption[]> {
  return MOCK_VOUCHERS;
}
