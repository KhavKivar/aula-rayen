import { availabilitySlotBulkDeleteRequestSchema } from "@aula-rayen/contracts/availability";
import {
  availabilitySlotListResponseSchema,
  type AvailabilitySlotListResponse,
} from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

export async function deleteAvailabilitySlots(
  ids: number[],
): Promise<AvailabilitySlotListResponse> {
  const parsedIds = availabilitySlotBulkDeleteRequestSchema.parse(ids);

  const { data: response } = await apiClient.delete<unknown>(
    "/availability-slots/batch",
    { data: parsedIds },
  );

  return availabilitySlotListResponseSchema.parse(response);
}
