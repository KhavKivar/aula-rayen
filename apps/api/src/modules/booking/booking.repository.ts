import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
} from '@aula-rayen/contracts/booking';
import { eq } from 'drizzle-orm';

import { DRIZZLE } from '@/db';
import { booking_attempts } from '@/db/schema';
import type { BookingAttempt, Database, NewBookingAttempt } from '@/db/types';

@Injectable()
export class BookingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<BookingAttempt[]> {
    return this.db.select().from(booking_attempts);
  }

  findAllByClientId(clientId: string): Promise<BookingAttempt[]> {
    return this.db
      .select()
      .from(booking_attempts)
      .where(eq(booking_attempts.clientId, clientId));
  }

  async findById(id: number): Promise<BookingAttempt | null> {
    const [booking] = await this.db
      .select()
      .from(booking_attempts)
      .where(eq(booking_attempts.id, id));

    return booking ?? null;
  }

  async create(
    dto: CreateBookingRequest & { clientId: string },
  ): Promise<BookingAttempt> {
    const [createdBooking] = await this.db
      .insert(booking_attempts)
      .values({
        clientId: dto.clientId,
        slotId: dto.slotId,
        expiresAt: new Date(dto.expiresAt),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      })
      .returning();

    if (!createdBooking) {
      throw new Error('No se pudo crear la reserva');
    }
    return createdBooking;
  }

  async update(
    id: number,
    dto: UpdateBookingRequest,
  ): Promise<BookingAttempt | null> {
    const set: Partial<NewBookingAttempt> = {};

    if (dto.expiresAt !== undefined) {
      set.expiresAt = new Date(dto.expiresAt);
    }
    if (dto.status !== undefined) {
      set.status = dto.status;
    }

    const [updatedBooking] = await this.db
      .update(booking_attempts)
      .set(set)
      .where(eq(booking_attempts.id, id))
      .returning();

    return updatedBooking ?? null;
  }

  async remove(id: number): Promise<BookingAttempt | null> {
    const [deletedBooking] = await this.db
      .delete(booking_attempts)
      .where(eq(booking_attempts.id, id))
      .returning();

    return deletedBooking ?? null;
  }
}
