import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCourse } from "@/features/course-dashboard/api/get-course";
import { getCourses } from "@/features/course-dashboard/api/get-courses";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() {
      super("Sesión expirada");
      this.name = "SessionExpiredError";
    }
  },
}));

import { apiClient } from "@/lib/api-client";

const catalogCourse = {
  id: 1,
  title: "Arteterapia",
  description: "Descripción",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "2 horas",
  price: 25000,
  hasAccess: true,
};

describe("Course API", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it("returns a valid catalog response via apiClient", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [catalogCourse] });

    await expect(getCourses()).resolves.toEqual([catalogCourse]);
    expect(apiClient.get).toHaveBeenCalledWith("/courses");
  });

  it("rejects a catalog response containing private links", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ ...catalogCourse, videoLink: "https://example.com/video" }],
    });

    await expect(getCourses()).rejects.toThrow();
  });

  it("returns valid purchased course details via apiClient", async () => {
    const response = {
      id: catalogCourse.id,
      title: catalogCourse.title,
      description: catalogCourse.description,
      createdAt: catalogCourse.createdAt,
      duration: catalogCourse.duration,
      price: catalogCourse.price,
      videoLink: "https://example.com/video",
      fileLink: "https://example.com/file",
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: response });

    await expect(getCourse(response.id)).resolves.toEqual(response);
    expect(apiClient.get).toHaveBeenCalledWith(`/courses/${response.id}`);
  });

  it("rejects purchased course details without content links", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        id: catalogCourse.id,
        title: catalogCourse.title,
        description: catalogCourse.description,
        createdAt: catalogCourse.createdAt,
        duration: catalogCourse.duration,
        price: catalogCourse.price,
      },
    });

    await expect(getCourse(catalogCourse.id)).rejects.toThrow();
  });

  it("rejects an invalid course id before calling the backend", async () => {
    await expect(getCourse(0)).rejects.toThrow();
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
