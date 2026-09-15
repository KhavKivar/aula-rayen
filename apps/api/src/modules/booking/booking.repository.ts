import { Inject, Injectable } from '@nestjs/common';
import type {
  BookingCreateRequest,
  BookingGetRequest,
  BookingUpdateRequest,
} from '@aula-rayen/contracts/booking';

import { DRIZZLE } from '@/db';
import type { BookingAttempt, Database } from '@/db/types';
import { asc, desc, eq, and } from 'drizzle-orm';
import { booking_attempts } from '@/db/schema';

const DEFAULT_LIMIT = 50;
@Injectable()
export class BookingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(query: BookingGetRequest): Promise<BookingAttempt[]> {
    const orderByDir =
      query.sortOrder === 'asc'
        ? asc(booking_attempts.createdAt)
        : desc(booking_attempts.createdAt);

    const conditions = [
      query.search ? eq(booking_attempts.clientId, query.search) : undefined,
      query.status ? eq(booking_attempts.status, query.status) : undefined,
    ].filter(Boolean);

    const result = this.db
      .select()
      .from(booking_attempts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByDir)
      .offset(
        query.page ? (query.page - 1) * (query.limit ?? DEFAULT_LIMIT) : 0,
      )
      .limit(query.limit ?? 50);

    return result;
  }

  findAllByClientId(clientId: string): Promise<BookingAttempt[]> {
    return this.db
      .select()
      .from(booking_attempts)
      .where(eq(booking_attempts.clientId, clientId))
      .orderBy(desc(booking_attempts.createdAt));
  }

  findById(id: number): Promise<BookingAttempt | null> {
    return this.db
      .select()
      .from(booking_attempts)
      .where(eq(booking_attempts.id, id))
      .then((rows) => rows[0] ?? null);
  }

  async create(
    dto: BookingCreateRequest & { clientId: string },
  ): Promise<BookingAttempt> {
    const [created] = await this.db
      .insert(booking_attempts)
      .values({
        clientId: dto.clientId,
        slotId: dto.slotId,
        status: dto.status ?? 'pending',
        expiresAt: new Date(dto.expiresAt),
      })
      .returning();

    if (!created) {
      throw new Error('No se pudo crear la reserva');
    }
    return created;
  }

  async update(
    id: number,
    dto: BookingUpdateRequest,
  ): Promise<BookingAttempt | null> {
    const values: Partial<typeof booking_attempts.$inferInsert> = {};
    if (dto.status !== undefined) {
      values.status = dto.status;
    }
    if (dto.expiresAt !== undefined) {
      values.expiresAt = new Date(dto.expiresAt);
    }

    const [updated] = await this.db
      .update(booking_attempts)
      .set(values)
      .where(eq(booking_attempts.id, id))
      .returning();

    return updated ?? null;
  }

  async remove(id: number): Promise<BookingAttempt | null> {
    const [removed] = await this.db
      .delete(booking_attempts)
      .where(eq(booking_attempts.id, id))
      .returning();

    return removed ?? null;
  }
}
