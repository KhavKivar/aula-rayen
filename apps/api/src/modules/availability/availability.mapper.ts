import type { AvailabilitySlotResponse } from '@aula-rayen/contracts/availability';

import type { AvailabilitySlot } from '@/db/types';

export function toAvailabilitySlotResponse(
  slot: AvailabilitySlot,
): AvailabilitySlotResponse {
  return {
    id: slot.id,
    startTime: slot.startTime.toISOString(),
    endTime: slot.endTime.toISOString(),
    assignedTo: slot.assignedTo,
    createdBy: slot.createdBy,
    createdAt: slot.createdAt.toISOString(),
    status: slot.status,
  };
}
