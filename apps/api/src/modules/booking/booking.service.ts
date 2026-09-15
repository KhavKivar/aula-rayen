import { Injectable } from '@nestjs/common';
import type {
  BookingCreateRequest,
  BookingGetRequest,
  BookingUpdateRequest,
} from '@aula-rayen/contracts/booking';

import { AvailabilityService } from '../availability/availability.service';
import { BookingRepository } from './booking.repository';
import type { BookingAttempt } from '@/db/types';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import { conflictError } from '@/common/errors/http-error';

export type BookingRequester = {
  id: string;
  role?: string | string[];
};

function isActiveBookingConflictError(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (typeof current === 'object' && current !== null && !seen.has(current)) {
    seen.add(current);
    const { code, constraint } = current as { code?: unknown; constraint?: unknown };
    if (code === '23505' || constraint === 'one_active_booking_per_slot') {
      return true;
    }
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

@Injectable()
export class BookingService {
  constructor(
    private readonly repository: BookingRepository,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async getAll(query: BookingGetRequest): Promise<BookingAttempt[]> {
    return this.repository.findAll(query);
  }

  async getById(
    id: number,
    requester: BookingRequester,
  ): Promise<BookingAttempt> {
    throw new Error('Not implemented');
  }

  async create(
    dto: BookingCreateRequest,
    clientId: string,
  ): Promise<BookingAttempt> {
    const slot = await this.availabilityService.getById(dto.slotId);

    if (slot.status !== 'available') {
      throw conflictError(
        API_ERROR_CODES.BOOKING_SLOT_UNAVAILABLE,
        `El slot ${dto.slotId} no está disponible para reservar`,
      );
    }

    try {
      return await this.repository.create({ ...dto, clientId });
    } catch (error: unknown) {
      if (isActiveBookingConflictError(error)) {
        throw conflictError(
          API_ERROR_CODES.BOOKING_SLOT_UNAVAILABLE,
          `Ya existe una reserva activa para el slot ${dto.slotId}`,
        );
      }
      throw error;
    }
  }

  async update(
    id: number,
    dto: BookingUpdateRequest,
    requester: BookingRequester,
  ): Promise<BookingAttempt> {
    throw new Error('Not implemented');
  }

  async remove(
    id: number,
    requester: BookingRequester,
  ): Promise<BookingAttempt> {
    throw new Error('Not implemented');
  }
}
