import { Injectable } from '@nestjs/common';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
} from '@aula-rayen/contracts/booking';

import { notFoundError } from '@/common/errors/http-error';
import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
  constructor(private readonly repository: BookingRepository) {}

  getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return booking;
  }

  create(dto: CreateBookingRequest, clientId: string) {
    return this.repository.create({ ...dto, clientId });
  }

  async update(id: number, dto: UpdateBookingRequest) {
    const updatedBooking = await this.repository.update(id, dto);

    if (!updatedBooking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return updatedBooking;
  }

  async remove(id: number) {
    const deletedBooking = await this.repository.remove(id);

    if (!deletedBooking) {
      throw notFoundError(
        API_ERROR_CODES.BOOKING_NOT_FOUND,
        `Reserva con ID ${id} no encontrada`,
      );
    }
    return deletedBooking;
  }
}
