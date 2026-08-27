import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import type { Course } from '@/db/types';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let repository: jest.Mocked<CourseRepository>;

  const course: Course = {
    id: 41,
    title: 'Arteterapia para infancias',
    description: 'Descripción del curso',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    videoLink: 'https://example.com/video',
    fileLink: 'https://example.com/file',
    duration: '2 horas',
    price: 25000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: CourseRepository,
          useValue: {
            findAll: jest.fn(),
            findCatalogByUser: jest.fn(),
            findById: jest.fn(),
            findPurchasedById: jest.fn(),
            findPurchasersByCourseId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            hasPurchases: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<jest.Mocked<CourseRepository>>(CourseRepository);
  });

  describe('Queries', () => {
    it('should return all courses', async () => {
      repository.findAll.mockResolvedValue([course]);

      await expect(service.getAll()).resolves.toEqual([course]);
    });

    it('should return the catalog for a user', async () => {
      const userId = 'user-id';
      const catalog = [{ ...course, hasAccess: true }];
      repository.findCatalogByUser.mockResolvedValue(catalog);

      await expect(service.getCatalogForUser(userId)).resolves.toEqual(catalog);
      expect(repository.findCatalogByUser.mock.calls).toEqual([[userId]]);
    });

    it('should return a course by id', async () => {
      repository.findById.mockResolvedValue(course);

      await expect(service.getById(course.id)).resolves.toEqual(course);
    });

    it('should throw when a course does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(course.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Purchased course', () => {
    it('should return a course purchased by the user', async () => {
      const userId = 'user-id';
      repository.findPurchasedById.mockResolvedValue(course);

      await expect(
        service.getPurchasedById(course.id, userId),
      ).resolves.toEqual(course);
      expect(repository.findPurchasedById.mock.calls).toEqual([
        [course.id, userId],
      ]);
    });

    it('should reject access when the user has not purchased the course', async () => {
      repository.findPurchasedById.mockResolvedValue(null);

      await expect(
        service.getPurchasedById(course.id, 'user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Create', () => {
    it('should create and return a course', async () => {
      const dto = {
        title: course.title,
        description: course.description,
        videoLink: course.videoLink,
        fileLink: course.fileLink,
        duration: course.duration,
        price: course.price,
      };
      repository.create.mockResolvedValue(course);

      await expect(service.create(dto)).resolves.toEqual(course);
      expect(repository.create.mock.calls).toEqual([[dto]]);
    });
  });

  describe('Purchases', () => {
    it('should return true when the course has purchases', async () => {
      repository.hasPurchases.mockResolvedValue(true);

      await expect(service.hasPurchases(course.id)).resolves.toBe(true);
    });

    it('should return false when the course has no purchases', async () => {
      repository.hasPurchases.mockResolvedValue(false);

      await expect(service.hasPurchases(course.id)).resolves.toBe(false);
    });
  });

  describe('Delete', () => {
    it('should delete and return a course without purchases', async () => {
      repository.hasPurchases.mockResolvedValue(false);
      repository.remove.mockResolvedValue(course);

      await expect(service.remove(course.id)).resolves.toEqual(course);
      expect(repository.remove.mock.calls).toEqual([[course.id]]);
    });

    it('should throw an error when the course does not exist', async () => {
      repository.hasPurchases.mockResolvedValue(false);
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should reject deletion when the course has purchases', async () => {
      const fakeId = 414;
      repository.hasPurchases.mockResolvedValue(true);

      await expect(service.remove(fakeId)).rejects.toThrow(ConflictException);
      expect(repository.remove.mock.calls).toHaveLength(0);
    });
  });

  describe('Update', () => {
    const updatedCourse = {
      ...course,
      title: 'Nuevo título del curso',
    };

    it('should return the updated course', async () => {
      const dto = { title: updatedCourse.title };
      repository.update.mockResolvedValue(updatedCourse);

      await expect(service.update(updatedCourse.id, dto)).resolves.toEqual(
        updatedCourse,
      );
    });

    it('should send the id and changes to the repository', async () => {
      const dto = { title: updatedCourse.title };
      repository.update.mockResolvedValue(updatedCourse);

      await service.update(updatedCourse.id, dto);

      expect(repository.update.mock.calls).toEqual([[updatedCourse.id, dto]]);
    });

    it('should throw an error when the repository returns null', async () => {
      const dto = {
        title: 'Nuevo título del curso',
      };
      const id = 41;

      repository.update.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(repository.update.mock.calls).toEqual([[id, dto]]);
    });
  });
});
