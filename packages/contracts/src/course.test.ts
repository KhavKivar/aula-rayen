import { describe, expect, it } from 'vitest';

import { apiErrorSchema } from './api-error.js';
import {
  courseCatalogItemSchema,
  courseDetailSchema,
  createCourseRequestSchema,
  updateCourseRequestSchema,
} from './course.js';

const course = {
  id: 1,
  title: 'Curso de prueba',
  description: 'Descripción',
  createdAt: '2026-08-26T12:00:00.000Z',
  duration: '2 horas',
  price: 25000,
};

describe('Course contracts', () => {
  it('accepts catalog-safe fields and rejects private links', () => {
    expect(
      courseCatalogItemSchema.parse({ ...course, hasAccess: true }),
    ).toEqual({ ...course, hasAccess: true });
    expect(() =>
      courseCatalogItemSchema.parse({
        ...course,
        hasAccess: true,
        videoLink: 'https://example.com/video',
      }),
    ).toThrow();
  });

  it('requires content links in purchased course details', () => {
    expect(() => courseDetailSchema.parse(course)).toThrow();
    expect(
      courseDetailSchema.parse({
        ...course,
        videoLink: 'https://example.com/video',
        fileLink: 'https://example.com/file',
      }),
    ).toBeDefined();
  });

  it('validates creation and non-empty partial updates', () => {
    const request = {
      title: course.title,
      description: course.description,
      videoLink: 'https://example.com/video',
      fileLink: 'https://example.com/file',
      duration: course.duration,
      price: course.price,
    };

    expect(createCourseRequestSchema.parse(request)).toEqual(request);
    expect(() => createCourseRequestSchema.parse({ ...request, price: -1 })).toThrow();
    expect(updateCourseRequestSchema.parse({ title: 'Nuevo título' })).toEqual({
      title: 'Nuevo título',
    });
    expect(() => updateCourseRequestSchema.parse({})).toThrow();
    expect(() =>
      updateCourseRequestSchema.parse({ title: 'Título', unknown: true }),
    ).toThrow();
  });

  it('accepts Nest-style API errors', () => {
    expect(
      apiErrorSchema.parse({
        statusCode: 409,
        message: 'No se puede eliminar el curso',
        error: 'Conflict',
      }),
    ).toBeDefined();
    expect(
      apiErrorSchema.parse({
        statusCode: 400,
        message: ['El título es obligatorio'],
        error: 'Bad Request',
      }),
    ).toBeDefined();
  });
});
