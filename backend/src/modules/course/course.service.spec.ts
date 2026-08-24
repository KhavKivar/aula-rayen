import { ForbiddenException, NotFoundException } from '@nestjs/common';

import type { Course } from '@/db/types';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

describe('CourseService', () => {
  const course: Course = {
    id: 1,
    title: 'Arteterapia para infancias',
    description: 'Descripción del curso',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    videoLink: 'https://example.com/video',
    fileLink: 'https://example.com/file',
    duration: '2 horas',
    price: 25000,
  };

  const repository = {
    findAll: jest.fn(),
    findCatalogByUser: jest.fn(),
    findById: jest.fn(),
    findPurchasedById: jest.fn(),
    create: jest.fn(),
  };
  const service = new CourseService(repository as unknown as CourseRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all courses', async () => {
    repository.findAll.mockResolvedValue([course]);

    await expect(service.getAll()).resolves.toEqual([course]);
  });

  it('returns the catalog with access state for a user', async () => {
    const catalog = [{ ...course, hasAccess: true }];
    repository.findCatalogByUser.mockResolvedValue(catalog);

    await expect(service.getCatalogForUser('user-id')).resolves.toEqual(
      catalog,
    );
    expect(repository.findCatalogByUser).toHaveBeenCalledWith('user-id');
  });

  it('returns a course by id', async () => {
    repository.findById.mockResolvedValue(course);

    await expect(service.getById(course.id)).resolves.toEqual(course);
  });

  it('throws when the course does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toThrow(NotFoundException);
  });

  it('returns a purchased course', async () => {
    repository.findPurchasedById.mockResolvedValue(course);

    await expect(
      service.getPurchasedById(course.id, 'user-id'),
    ).resolves.toEqual(course);
  });

  it('rejects access to a course that was not purchased', async () => {
    repository.findPurchasedById.mockResolvedValue(null);

    await expect(
      service.getPurchasedById(course.id, 'user-id'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('creates a course', async () => {
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
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});
