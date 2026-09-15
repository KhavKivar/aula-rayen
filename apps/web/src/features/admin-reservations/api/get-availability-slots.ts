import { availabilitySlotListResponseSchema } from "@aula-rayen/contracts/availability";
import type { AvailabilitySlotListResponse } from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

export async function getAvailabilitySlots(): Promise<AvailabilitySlotListResponse> {
  const { data } = await apiClient.get<unknown>("/availability-slots");

  return availabilitySlotListResponseSchema.parse(data);
}
