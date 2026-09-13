import { Injectable } from '@nestjs/common';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import type {
  CreateAvailabilitySlotRequest,
  CreateAvailabilitySlotsRequest,
  UpdateAvailabilitySlotRequest,
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

function isSlotOverlapError(error: unknown): boolean {
  // drizzle-orm envuelve el error del driver en DrizzleQueryError;
  // el código pg (23P01) y la constraint viven en `cause`.
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
    if (
      code === '23P01' ||
      constraint === 'no_overlapping_slots_per_professional'
    ) {
      return true;
    }
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

function toOverlapError(): Error {
  return conflictError(
    API_ERROR_CODES.AVAILABILITY_SLOT_OVERLAP,
    'Algunos bloques se solapan con horarios ya guardados para ese profesional',
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

  async create(dto: CreateAvailabilitySlotRequest, createdBy: string) {
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

  async createMany(dtos: CreateAvailabilitySlotsRequest, createdBy: string) {
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

  async update(id: number, dto: UpdateAvailabilitySlotRequest) {
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
    const deletedSlot = await this.repository.remove(id);

    if (!deletedSlot) {
      throw notFoundError(
        API_ERROR_CODES.AVAILABILITY_SLOT_NOT_FOUND,
        `Slot de disponibilidad con ID ${id} no encontrado`,
      );
    }
    return deletedSlot;
  }
}
