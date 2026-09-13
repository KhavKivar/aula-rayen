import { availabilitySlotListSchema } from "@aula-rayen/contracts/availability";
import type { AvailabilitySlotList } from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

export async function getAvailabilitySlots(): Promise<AvailabilitySlotList> {
  const { data } = await apiClient.get<unknown>("/availability-slots");

  return availabilitySlotListSchema.parse(data);
}
