import { describe, expect, it } from "vitest";

import { apiErrorSchema } from "./api-error.js";
import {
  courseCatalogItemSchema,
  courseBuyerListResponseSchema,
  courseDetailResponseSchema,
  courseCreateRequestSchema,
  courseUpdateRequestSchema,
} from "./course.js";

const course = {
  id: 1,
  title: "Curso de prueba",
  description: "Descripción",
  createdAt: "2026-08-26T12:00:00.000Z",
  duration: "2 horas",
  price: 25000,
};

describe("Course contracts", () => {
  it("accepts catalog-safe fields and rejects private links", () => {
    expect(
      courseCatalogItemSchema.parse({ ...course, hasAccess: true }),
    ).toEqual({ ...course, hasAccess: true });
    expect(() =>
      courseCatalogItemSchema.parse({
        ...course,
        hasAccess: true,
        videoLink: "https://example.com/video",
      }),
    ).toThrow();
  });

  it("requires content links in purchased course details", () => {
    expect(() => courseDetailResponseSchema.parse(course)).toThrow();
    expect(
      courseDetailResponseSchema.parse({
        ...course,
        videoLink: "https://example.com/video",
        fileLink: "https://example.com/file",
      }),
    ).toBeDefined();
  });

  it("validates creation and non-empty partial updates", () => {
    const request = {
      title: course.title,
      description: course.description,
      videoLink: "https://example.com/video",
      fileLink: "https://example.com/file",
      duration: course.duration,
      price: course.price,
    };

    expect(courseCreateRequestSchema.parse(request)).toEqual(request);
    expect(() =>
      courseCreateRequestSchema.parse({ ...request, price: -1 }),
    ).toThrow();
    expect(courseUpdateRequestSchema.parse({ title: "Nuevo título" })).toEqual({
      title: "Nuevo título",
    });
    expect(() => courseUpdateRequestSchema.parse({})).toThrow();
    expect(() =>
      courseUpdateRequestSchema.parse({ title: "Título", unknown: true }),
    ).toThrow();
  });

  it("validates course buyers with their purchase date", () => {
    const buyers = [
      {
        id: "4qsKHnu0mNLyqPVn78v2LSKQrmx880eM",
        name: "Camila Rojas",
        email: "camila@example.com",
        purchasedAt: "2026-09-03T13:20:00.000Z",
      },
    ];

    expect(courseBuyerListResponseSchema.parse(buyers)).toEqual(buyers);
    expect(() =>
      courseBuyerListResponseSchema.parse([{ ...buyers[0], purchasedAt: "ayer" }]),
    ).toThrow();
  });

  it("accepts Nest-style API errors", () => {
    expect(
      apiErrorSchema.parse({
        statusCode: 409,
        message: "No se puede eliminar el curso",
        error: "Conflict",
      }),
    ).toBeDefined();
    expect(
      apiErrorSchema.parse({
        statusCode: 400,
        message: ["El título es obligatorio"],
        error: "Bad Request",
      }),
    ).toBeDefined();
  });
});
