/* eslint-disable @typescript-eslint/unbound-method -- Service and repository methods are replaced with Jest mocks. */
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import type { BookingAttempt } from '@/db/types';
import { AvailabilityService } from '../availability/availability.service';
import { BookingRepository } from './booking.repository';
import { BookingService, type BookingRequester } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  let repository: jest.Mocked<BookingRepository>;
  let availabilityService: jest.Mocked<AvailabilityService>;

  const booking: BookingAttempt = {
    id: 1,
    clientId: 'client-id',
    slotId: 2,
    status: 'pending',
    expiresAt: new Date('2026-10-01T09:00:00.000Z'),
    createdAt: new Date('2026-09-01T00:00:00.000Z'),
    updatedAt: new Date('2026-09-01T00:00:00.000Z'),
  };
  const owner: BookingRequester = { id: 'client-id', role: 'user' };
  const otherUser: BookingRequester = { id: 'other-id', role: 'user' };
  const admin: BookingRequester = { id: 'admin-id', role: 'admin' };
  const futureExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingRepository,
          useValue: {
            findAll: jest.fn(),
            findAllByClientId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AvailabilityService,
          useValue: {
            getById: jest.fn().mockResolvedValue({ status: 'available' }),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    repository = module.get<jest.Mocked<BookingRepository>>(BookingRepository);
    availabilityService =
      module.get<jest.Mocked<AvailabilityService>>(AvailabilityService);
  });

  describe('Queries', () => {
    it('should return all bookings for admins', async () => {
      repository.findAll.mockResolvedValue([booking]);

      await expect(service.getAll(admin)).resolves.toEqual([booking]);
      expect(repository.findAllByClientId).not.toHaveBeenCalled();
    });

    it('should return only the requester bookings for regular users', async () => {
      repository.findAllByClientId.mockResolvedValue([booking]);

      await expect(service.getAll(owner)).resolves.toEqual([booking]);
      expect(repository.findAll).not.toHaveBeenCalled();
      expect(repository.findAllByClientId).toHaveBeenCalledWith(owner.id);
    });

    it('should return a booking by id to its owner', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(service.getById(booking.id, owner)).resolves.toEqual(
        booking,
      );
    });

    it('should let admins read any booking', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(service.getById(booking.id, admin)).resolves.toEqual(
        booking,
      );
    });

    it('should forbid reading a booking from another user', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(service.getById(booking.id, otherUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw when a booking does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(booking.id, owner)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create', () => {
    it('should validate the slot and create the booking', async () => {
      const dto = {
        slotId: booking.slotId,
        expiresAt: futureExpiresAt,
      };
      repository.create.mockResolvedValue(booking);

      await expect(service.create(dto, 'client-id')).resolves.toEqual(booking);
      expect(availabilityService.getById).toHaveBeenCalledWith(booking.slotId);
      expect(repository.create.mock.calls).toEqual([
        [{ ...dto, clientId: 'client-id' }],
      ]);
    });

    it('should reject unavailable slots', async () => {
      availabilityService.getById.mockResolvedValue({
        status: 'disabled',
      } as never);

      await expect(
        service.create(
          { slotId: booking.slotId, expiresAt: futureExpiresAt },
          'client-id',
        ),
      ).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject expirations in the past', async () => {
      await expect(
        service.create(
          { slotId: booking.slotId, expiresAt: '2020-01-01T00:00:00.000Z' },
          'client-id',
        ),
      ).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    it('should return the updated booking for its owner', async () => {
      const dto = { status: 'confirmed' as const };
      const updatedBooking = { ...booking, status: 'confirmed' as const };
      repository.findById.mockResolvedValue(booking);
      repository.update.mockResolvedValue(updatedBooking);

      await expect(service.update(booking.id, dto, owner)).resolves.toEqual(
        updatedBooking,
      );
      expect(repository.update.mock.calls).toEqual([[booking.id, dto]]);
    });

    it('should forbid updating a booking from another user', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(
        service.update(booking.id, { status: 'cancelled' }, otherUser),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject non-future expirations', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(
        service.update(
          booking.id,
          { expiresAt: '2020-01-01T00:00:00.000Z' },
          owner,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when the booking does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(booking.id, { status: 'cancelled' }, owner),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Delete', () => {
    it('should delete and return a booking for its owner', async () => {
      repository.findById.mockResolvedValue(booking);
      repository.remove.mockResolvedValue(booking);

      await expect(service.remove(booking.id, owner)).resolves.toEqual(booking);
      expect(repository.remove.mock.calls).toEqual([[booking.id]]);
    });

    it('should forbid deleting a booking from another user', async () => {
      repository.findById.mockResolvedValue(booking);

      await expect(service.remove(booking.id, otherUser)).rejects.toThrow(
        ForbiddenException,
      );
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should throw an error when the booking does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(booking.id, owner)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
