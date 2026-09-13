import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import type { BookingAttempt } from '@/db/types';
import { BookingRepository } from './booking.repository';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  let repository: jest.Mocked<BookingRepository>;

  const booking: BookingAttempt = {
    id: 1,
    clientId: 'client-id',
    slotId: 2,
    status: 'pending',
    expiresAt: new Date('2026-10-01T09:00:00.000Z'),
    createdAt: new Date('2026-09-01T00:00:00.000Z'),
    updatedAt: new Date('2026-09-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    repository = module.get<jest.Mocked<BookingRepository>>(BookingRepository);
  });

  describe('Queries', () => {
    it('should return all bookings', async () => {
      repository.findAll.mockResolvedValue([booking]);

      await expect(service.getAll()).resolves.toEqual([booking]);
    });

    it('should return a booking by id', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(service.getById(booking.id)).resolves.toEqual(booking);
    });

    it('should throw when a booking does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(booking.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create', () => {
    it('should create and return a booking', async () => {
      const dto = {
        slotId: booking.slotId,
        expiresAt: '2026-10-01T09:00:00.000Z',
      };
      repository.create.mockResolvedValue(booking);

      await expect(service.create(dto, 'client-id')).resolves.toEqual(booking);
      expect(repository.create.mock.calls).toEqual([
        [{ ...dto, clientId: 'client-id' }],
      ]);
    });
  });

  describe('Update', () => {
    it('should return the updated booking', async () => {
      const dto = { status: 'confirmed' as const };
      const updatedBooking = { ...booking, status: 'confirmed' as const };
      repository.update.mockResolvedValue(updatedBooking);

      await expect(service.update(booking.id, dto)).resolves.toEqual(
        updatedBooking,
      );
      expect(repository.update.mock.calls).toEqual([[booking.id, dto]]);
    });

    it('should throw an error when the repository returns null', async () => {
      const dto = { status: 'cancelled' as const };
      repository.update.mockResolvedValue(null);

      await expect(service.update(booking.id, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Delete', () => {
    it('should delete and return a booking', async () => {
      repository.remove.mockResolvedValue(booking);

      await expect(service.remove(booking.id)).resolves.toEqual(booking);
      expect(repository.remove.mock.calls).toEqual([[booking.id]]);
    });

    it('should throw an error when the booking does not exist', async () => {
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(booking.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
