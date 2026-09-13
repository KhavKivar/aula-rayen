import {
  availabilitySlotListSchema,
  availabilitySlotResponseSchema,
  createAvailabilitySlotRequestSchema,
  createAvailabilitySlotsRequestSchema,
} from "@aula-rayen/contracts/availability";
import type {
  AvailabilitySlotResponse,
  CreateAvailabilitySlotRequest,
  CreateAvailabilitySlotsRequest,
} from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

export async function createAvailabilitySlot(
  data: CreateAvailabilitySlotRequest,
): Promise<AvailabilitySlotResponse> {
  const parsed = createAvailabilitySlotRequestSchema.parse(data);

  const { data: response } = await apiClient.post<unknown>(
    "/availability-slots",
    parsed,
  );

  return availabilitySlotResponseSchema.parse(response);
}

export async function createAvailabilitySlots(
  slots: CreateAvailabilitySlotsRequest,
): Promise<AvailabilitySlotResponse[]> {
  const parsed = createAvailabilitySlotsRequestSchema.parse(slots);

  const { data: response } = await apiClient.post<unknown>(
    "/availability-slots/batch",
    parsed,
  );

  return availabilitySlotListSchema.parse(response);
}
