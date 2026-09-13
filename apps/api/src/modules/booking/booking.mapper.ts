import type { BookingResponse } from '@aula-rayen/contracts/booking';

import type { BookingAttempt } from '@/db/types';

export function toBookingResponse(booking: BookingAttempt): BookingResponse {
  return {
    id: booking.id,
    clientId: booking.clientId,
    slotId: booking.slotId,
    status: booking.status,
    expiresAt: booking.expiresAt.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}
