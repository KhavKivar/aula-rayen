import { Injectable } from '@nestjs/common';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import type {
  BookingCreateRequest,
  BookingUpdateRequest,
} from '@aula-rayen/contracts/booking';

import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from '@/common/errors/http-error';
import { AvailabilityService } from '../availability/availability.service';
import { BookingRepository } from './booking.repository';
import type { BookingAttempt } from '@/db/types';

export type BookingRequester = {
  id: string;
  role?: string | string[];
};

function isAdminRole(role: string | string[] | undefined): boolean {
  if (Array.isArray(role)) {
    return role.includes('admin');
  }
  return role?.split(',').some((value) => value.trim() === 'admin') ?? false;
}

function assertFutureExpiration(expiresAt: string) {
  if (new Date(expiresAt).getTime() <= Date.now()) {
    throw badRequestError(
      API_ERROR_CODES.VALIDATION_ERROR,
      'La fecha de expiración debe ser futura',
    );
  }
}

@Injectable()
export class BookingService {
  constructor(
    private readonly repository: BookingRepository,
    private readonly availabilityService: AvailabilityService,
  ) {}

  getAll(requester: BookingRequester) {
    if (isAdminRole(requester.role)) {
      return this.repository.findAll();
    }

    return this.repository.findAllByClientId(requester.id);
  }

  async getById(id: number, requester: BookingRequester) {
    const booking = await this.findByIdOrThrow(id);
    this.assertCanAccess(booking, requester);

    return booking;
  }

  async create(dto: BookingCreateRequest, clientId: string) {
    const slot = await this.availabilityService.getById(dto.slotId);

    if (slot.status !== 'available') {
      throw badRequestError(
        API_ERROR_CODES.BOOKING_SLOT_UNAVAILABLE,
        'El bloque de disponibilidad no está disponible para reservar',
      );
    }
    assertFutureExpiration(dto.expiresAt);

    return this.repository.create({ ...dto, clientId });
  }

  async update(
    id: number,
    dto: BookingUpdateRequest,
    requester: BookingRequester,
  ) {
    await this.getById(id, requester);

    if (dto.expiresAt !== undefined) {
      assertFutureExpiration(dto.expiresAt);
    }

    const updatedBooking = await this.repository.update(id, dto);

    if (!updatedBooking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return updatedBooking;
  }

  async remove(id: number, requester: BookingRequester) {
    await this.getById(id, requester);

    const deletedBooking = await this.repository.remove(id);

    if (!deletedBooking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return deletedBooking;
  }

  private async findByIdOrThrow(id: number) {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return booking;
  }

  private assertCanAccess(
    booking: BookingAttempt,
    requester: BookingRequester,
  ) {
    if (!isAdminRole(requester.role) && booking.clientId !== requester.id) {
      throw forbiddenError(
        API_ERROR_CODES.BOOKING_FORBIDDEN,
        'No puedes acceder a reservas de otros usuarios',
      );
    }
  }
}
