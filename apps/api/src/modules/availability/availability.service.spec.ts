import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import type { AvailabilitySlot } from '@/db/types';
import { AvailabilityRepository } from './availability.repository';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let repository: jest.Mocked<AvailabilityRepository>;

  const slot: AvailabilitySlot = {
    id: 1,
    startTime: new Date('2026-10-01T10:00:00.000Z'),
    endTime: new Date('2026-10-01T11:00:00.000Z'),
    assignedTo: 'assignee-id',
    createdBy: 'admin-id',
    createdAt: new Date('2026-09-01T00:00:00.000Z'),
    status: 'available',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: AvailabilityRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            createMany: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    repository = module.get<jest.Mocked<AvailabilityRepository>>(
      AvailabilityRepository,
    );
  });

  describe('Queries', () => {
    it('should return all availability slots', async () => {
      repository.findAll.mockResolvedValue([slot]);

      await expect(service.getAll()).resolves.toEqual([slot]);
    });

    it('should return a slot by id', async () => {
      repository.findById.mockResolvedValue(slot);

      await expect(service.getById(slot.id)).resolves.toEqual(slot);
    });

    it('should throw when a slot does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(slot.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Create', () => {
    it('should create and return a slot', async () => {
      const dto = {
        startTime: '2026-10-01T10:00:00.000Z',
        endTime: '2026-10-01T11:00:00.000Z',
        assignedTo: 'assignee-id',
      };
      repository.create.mockResolvedValue(slot);

      await expect(service.create(dto, 'admin-id')).resolves.toEqual(slot);
      expect(repository.create.mock.calls).toEqual([
        [{ ...dto, createdBy: 'admin-id' }],
      ]);
    });

    it('should reject a range where end is before start', async () => {
      const dto = {
        startTime: '2026-10-01T11:00:00.000Z',
        endTime: '2026-10-01T10:00:00.000Z',
        assignedTo: 'assignee-id',
      };

      await expect(service.create(dto, 'admin-id')).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.create.mock.calls).toHaveLength(0);
    });
  });

  describe('CreateMany', () => {
    const dtos = [
      {
        startTime: '2026-10-01T10:00:00.000Z',
        endTime: '2026-10-01T11:00:00.000Z',
        assignedTo: 'assignee-id',
      },
      {
        startTime: '2026-10-02T10:00:00.000Z',
        endTime: '2026-10-02T11:00:00.000Z',
        assignedTo: 'assignee-id',
      },
    ];

    it('should create all slots in a single repository call', async () => {
      repository.createMany.mockResolvedValue([slot, { ...slot, id: 2 }]);

      await expect(service.createMany(dtos, 'admin-id')).resolves.toEqual([
        slot,
        { ...slot, id: 2 },
      ]);
      expect(repository.createMany.mock.calls).toEqual([
        [dtos.map((dto) => ({ ...dto, createdBy: 'admin-id' }))],
      ]);
    });

    it('should reject the whole batch when any range is invalid', async () => {
      const invalid = [
        ...dtos,
        {
          startTime: '2026-10-03T11:00:00.000Z',
          endTime: '2026-10-03T10:00:00.000Z',
          assignedTo: 'assignee-id',
        },
      ];

      await expect(service.createMany(invalid, 'admin-id')).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.createMany.mock.calls).toHaveLength(0);
    });

    it('should throw conflict when slots overlap existing ones', async () => {
      repository.createMany.mockRejectedValue(
        Object.assign(new Error('conflicting key value'), {
          code: '23P01',
          constraint: 'no_overlapping_slots_per_professional',
        }),
      );

      await expect(service.createMany(dtos, 'admin-id')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw conflict when drizzle wraps the overlap error', async () => {
      const cause = Object.assign(new Error('conflicting key value'), {
        code: '23P01',
        constraint: 'no_overlapping_slots_per_professional',
      });
      repository.createMany.mockRejectedValue(
        Object.assign(new Error('DrizzleQueryError'), { cause }),
      );

      await expect(service.createMany(dtos, 'admin-id')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow unexpected repository errors', async () => {
      repository.createMany.mockRejectedValue(new Error('connection lost'));

      await expect(service.createMany(dtos, 'admin-id')).rejects.toThrow(
        'connection lost',
      );
    });
  });

  describe('Update', () => {
    it('should return the updated slot', async () => {
      const dto = { status: 'disabled' as const };
      const updatedSlot = { ...slot, status: 'disabled' as const };
      repository.update.mockResolvedValue(updatedSlot);

      await expect(service.update(slot.id, dto)).resolves.toEqual(updatedSlot);
      expect(repository.update.mock.calls).toEqual([[slot.id, dto]]);
    });

    it('should reject a partial update that inverts the range', async () => {
      repository.findById.mockResolvedValue(slot);

      await expect(
        service.update(slot.id, { endTime: '2026-10-01T09:00:00.000Z' }),
      ).rejects.toThrow(BadRequestException);
      expect(repository.update.mock.calls).toHaveLength(0);
    });

    it('should throw an error when the repository returns null', async () => {
      const dto = { status: 'disabled' as const };
      repository.update.mockResolvedValue(null);

      await expect(service.update(slot.id, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Delete', () => {
    it('should delete and return a slot', async () => {
      repository.remove.mockResolvedValue(slot);

      await expect(service.remove(slot.id)).resolves.toEqual(slot);
      expect(repository.remove.mock.calls).toEqual([[slot.id]]);
    });

    it('should throw an error when the slot does not exist', async () => {
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(slot.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw conflict when the slot has booking attempts', async () => {
      const fkError = Object.assign(new Error('violates foreign key'), {
        code: '23503',
        constraint: 'booking_attempts_slot_id_availability_slots_id_fk',
      });
      repository.remove.mockRejectedValue(
        Object.assign(new Error('DrizzleQueryError'), { cause: fkError }),
      );

      await expect(service.remove(slot.id)).rejects.toThrow(ConflictException);
    });
  });

  describe('DeleteMany', () => {
    it('should throw conflict when any slot has booking attempts', async () => {
      repository.removeMany.mockRejectedValue(
        Object.assign(new Error('violates foreign key'), {
          code: '23503',
          constraint: 'booking_attempts_slot_id_availability_slots_id_fk',
        }),
      );

      await expect(service.removeMany([slot.id])).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow unexpected repository errors', async () => {
      repository.removeMany.mockRejectedValue(new Error('connection lost'));

      await expect(service.removeMany([slot.id])).rejects.toThrow(
        'connection lost',
      );
    });
  });
});
