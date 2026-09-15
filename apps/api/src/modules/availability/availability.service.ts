import { Injectable } from '@nestjs/common';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import type {
  AvailabilitySlotCreateRequest,
  AvailabilitySlotBulkCreateRequest,
  AvailabilitySlotBulkDeleteRequest,
  AvailabilitySlotUpdateRequest,
} from '@aula-rayen/contracts/availability';

import {
  badRequestError,
  conflictError,
  notFoundError,
} from '@/common/errors/http-error';
import { AvailabilityRepository } from './availability.repository';

function assertValidRange(startTime: string, endTime: string) {
  if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
    throw badRequestError(
      API_ERROR_CODES.AVAILABILITY_SLOT_INVALID_RANGE,
      'La hora de término debe ser posterior a la de inicio',
    );
  }
}

function findPgError(error: unknown): {
  code?: unknown;
  constraint?: unknown;
} {
  // drizzle-orm envuelve el error del driver en DrizzleQueryError;
  // el código y la constraint de pg viven en `cause`.
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (
    typeof current === 'object' &&
    current !== null &&
    !seen.has(current)
  ) {
    seen.add(current);
    const { code, constraint } = current as {
      code?: unknown;
      constraint?: unknown;
    };
    if (typeof code === 'string' || typeof constraint === 'string') {
      return { code, constraint };
    }
    current = (current as { cause?: unknown }).cause;
  }
  return {};
}

function isSlotOverlapError(error: unknown): boolean {
  const { code, constraint } = findPgError(error);
  return (
    code === '23P01' || constraint === 'no_overlapping_slots_per_professional'
  );
}

function isSlotHasBookingsError(error: unknown): boolean {
  const { code, constraint } = findPgError(error);
  return (
    code === '23503' ||
    (typeof constraint === 'string' && constraint.includes('slot_id'))
  );
}

function toOverlapError(): Error {
  return conflictError(
    API_ERROR_CODES.AVAILABILITY_SLOT_OVERLAP,
    'Algunos bloques se solapan con horarios ya guardados para ese profesional',
  );
}

function toHasBookingsError(): Error {
  return conflictError(
    API_ERROR_CODES.AVAILABILITY_SLOT_HAS_BOOKINGS,
    'No se puede eliminar el slot porque tiene reservas asociadas',
  );
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly repository: AvailabilityRepository) {}

  getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const slot = await this.repository.findById(id);

    if (!slot) {
      throw notFoundError(
        API_ERROR_CODES.AVAILABILITY_SLOT_NOT_FOUND,
        `Slot de disponibilidad con ID ${id} no encontrado`,
      );
    }
    return slot;
  }

  async create(dto: AvailabilitySlotCreateRequest, createdBy: string) {
    assertValidRange(dto.startTime, dto.endTime);
    try {
      return await this.repository.create({ ...dto, createdBy });
    } catch (error: unknown) {
      if (isSlotOverlapError(error)) {
        throw toOverlapError();
      }
      throw error;
    }
  }

  async createMany(dtos: AvailabilitySlotBulkCreateRequest, createdBy: string) {
    for (const dto of dtos) {
      assertValidRange(dto.startTime, dto.endTime);
    }
    try {
      return await this.repository.createMany(
        dtos.map((dto) => ({ ...dto, createdBy })),
      );
    } catch (error: unknown) {
      if (isSlotOverlapError(error)) {
        throw toOverlapError();
      }
      throw error;
    }
  }

  async update(id: number, dto: AvailabilitySlotUpdateRequest) {
    if (dto.startTime !== undefined || dto.endTime !== undefined) {
      const current = await this.getById(id);
      assertValidRange(
        dto.startTime ?? current.startTime.toISOString(),
        dto.endTime ?? current.endTime.toISOString(),
      );
    }

    let updatedSlot;
    try {
      updatedSlot = await this.repository.update(id, dto);
    } catch (error: unknown) {
      if (isSlotOverlapError(error)) {
        throw toOverlapError();
      }
      throw error;
    }

    if (!updatedSlot) {
      throw notFoundError(
        API_ERROR_CODES.AVAILABILITY_SLOT_NOT_FOUND,
        `Slot de disponibilidad con ID ${id} no encontrado`,
      );
    }
    return updatedSlot;
  }

  async remove(id: number) {
    let deletedSlot;
    try {
      deletedSlot = await this.repository.remove(id);
    } catch (error: unknown) {
      if (isSlotHasBookingsError(error)) {
        throw toHasBookingsError();
      }
      throw error;
    }

    if (!deletedSlot) {
      throw notFoundError(
        API_ERROR_CODES.AVAILABILITY_SLOT_NOT_FOUND,
        `Slot de disponibilidad con ID ${id} no encontrado`,
      );
    }
    return deletedSlot;
  }

  async removeMany(ids: AvailabilitySlotBulkDeleteRequest) {
    try {
      return await this.repository.removeMany(ids);
    } catch (error: unknown) {
      if (isSlotHasBookingsError(error)) {
        throw toHasBookingsError();
      }
      throw error;
    }
  }
}
