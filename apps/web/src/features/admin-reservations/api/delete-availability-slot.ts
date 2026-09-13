import { z } from "zod";
import { availabilitySlotResponseSchema } from "@aula-rayen/contracts/availability";
import type { AvailabilitySlotResponse } from "@aula-rayen/contracts/availability";

import { apiClient } from "@/lib/api-client";

const deleteAvailabilitySlotInputSchema = z.object({
  id: z.number().int().positive(),
});

export async function deleteAvailabilitySlot(
  input: z.infer<typeof deleteAvailabilitySlotInputSchema>,
): Promise<AvailabilitySlotResponse> {
  const parsed = deleteAvailabilitySlotInputSchema.parse(input);

  const { data: response } = await apiClient.delete<unknown>(
    `/availability-slots/${parsed.id}`,
  );

  return availabilitySlotResponseSchema.parse(response);
}
