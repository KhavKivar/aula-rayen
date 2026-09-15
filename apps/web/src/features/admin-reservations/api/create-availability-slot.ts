import {
  availabilitySlotListResponseSchema,
  availabilitySlotResponseSchema,
  availabilitySlotCreateRequestSchema,
  availabilitySlotBulkCreateRequestSchema,
} from "@aula-rayen/contracts/availability";
import type {
  AvailabilitySlotResponse,
  AvailabilitySlotCreateRequest,
  AvailabilitySlotBulkCreateRequest,
} from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

export async function createAvailabilitySlot(
  data: AvailabilitySlotCreateRequest,
): Promise<AvailabilitySlotResponse> {
  const parsed = availabilitySlotCreateRequestSchema.parse(data);

  const { data: response } = await apiClient.post<unknown>(
    "/availability-slots",
    parsed,
  );

  return availabilitySlotResponseSchema.parse(response);
}

export async function createAvailabilitySlots(
  slots: AvailabilitySlotBulkCreateRequest,
): Promise<AvailabilitySlotResponse[]> {
  const parsed = availabilitySlotBulkCreateRequestSchema.parse(slots);

  const { data: response } = await apiClient.post<unknown>(
    "/availability-slots/batch",
    parsed,
  );

  return availabilitySlotListResponseSchema.parse(response);
}
