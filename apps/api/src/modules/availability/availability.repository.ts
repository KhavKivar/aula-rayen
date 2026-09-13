import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateAvailabilitySlotRequest,
  UpdateAvailabilitySlotRequest,
} from '@aula-rayen/contracts/availability';
import { eq } from 'drizzle-orm';

import { DRIZZLE } from '@/db';
import { availability_slots } from '@/db/schema';
import type {
  AvailabilitySlot,
  Database,
  NewAvailabilitySlot,
} from '@/db/types';

@Injectable()
export class AvailabilityRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<AvailabilitySlot[]> {
    return this.db.select().from(availability_slots);
  }

  async findById(id: number): Promise<AvailabilitySlot | null> {
    const [slot] = await this.db
      .select()
      .from(availability_slots)
      .where(eq(availability_slots.id, id));

    return slot ?? null;
  }

  async create(
    dto: CreateAvailabilitySlotRequest & { createdBy: string },
  ): Promise<AvailabilitySlot> {
    const [createdSlot] = await this.db
      .insert(availability_slots)
      .values({
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        assignedTo: dto.assignedTo,
        createdBy: dto.createdBy,
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      })
      .returning();

    if (!createdSlot) {
      throw new Error('No se pudo crear el slot de disponibilidad');
    }
    return createdSlot;
  }

  async createMany(
    dtos: (CreateAvailabilitySlotRequest & { createdBy: string })[],
  ): Promise<AvailabilitySlot[]> {
    if (dtos.length === 0) {
      return [];
    }

    return this.db
      .insert(availability_slots)
      .values(
        dtos.map((dto) => ({
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          assignedTo: dto.assignedTo,
          createdBy: dto.createdBy,
          ...(dto.status !== undefined ? { status: dto.status } : {}),
        })),
      )
      .returning();
  }

  async update(
    id: number,
    dto: UpdateAvailabilitySlotRequest,
  ): Promise<AvailabilitySlot | null> {
    const set: Partial<NewAvailabilitySlot> = {};

    if (dto.startTime !== undefined) {
      set.startTime = new Date(dto.startTime);
    }
    if (dto.endTime !== undefined) {
      set.endTime = new Date(dto.endTime);
    }
    if (dto.assignedTo !== undefined) {
      set.assignedTo = dto.assignedTo;
    }
    if (dto.status !== undefined) {
      set.status = dto.status;
    }

    const [updatedSlot] = await this.db
      .update(availability_slots)
      .set(set)
      .where(eq(availability_slots.id, id))
      .returning();

    return updatedSlot ?? null;
  }

  async remove(id: number): Promise<AvailabilitySlot | null> {
    const [deletedSlot] = await this.db
      .delete(availability_slots)
      .where(eq(availability_slots.id, id))
      .returning();

    return deletedSlot ?? null;
  }
}
