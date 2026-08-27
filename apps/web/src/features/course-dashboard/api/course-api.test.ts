import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api-client";
import { getCourse } from "@/features/course-dashboard/api/get-course";
import { getCourses } from "@/features/course-dashboard/api/get-courses";

vi.mock("@/lib/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

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

  it("returns a valid catalog response", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [catalogCourse] });

    await expect(getCourses()).resolves.toEqual([catalogCourse]);
  });

  it("rejects a catalog response containing private links", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ ...catalogCourse, videoLink: "https://example.com/video" }],
    });

    await expect(getCourses()).rejects.toThrow();
  });

  it("returns valid purchased course details", async () => {
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
});
