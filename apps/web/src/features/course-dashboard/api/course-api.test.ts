import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestBackendJson } from "@/lib/backend-api.server";
import { getCourse } from "@/features/course-dashboard/api/get-course";
import { getCourses } from "@/features/course-dashboard/api/get-courses";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validate = (data: unknown) => data;
    const builder = {
      validator: (schema: { parse: (data: unknown) => unknown }) => {
        validate = (data) => schema.parse(data);
        return builder;
      },
      handler:
        (handler: (context: { data: unknown }) => unknown) =>
        ({ data }: { data?: unknown } = {}) =>
          handler({ data: validate(data) }),
    };

    return builder;
  },
}));

vi.mock("@/lib/backend-api.server", () => ({
  requestBackendJson: vi.fn(),
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
    vi.mocked(requestBackendJson).mockReset();
  });

  it("returns a valid catalog response", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue([catalogCourse]);

    await expect(getCourses()).resolves.toEqual([catalogCourse]);
    expect(requestBackendJson).toHaveBeenCalledWith("/courses");
  });

  it("rejects a catalog response containing private links", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue([
      { ...catalogCourse, videoLink: "https://example.com/video" },
    ]);

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
    vi.mocked(requestBackendJson).mockResolvedValue(response);

    await expect(getCourse(response.id)).resolves.toEqual(response);
    expect(requestBackendJson).toHaveBeenCalledWith(`/courses/${response.id}`);
  });

  it("rejects purchased course details without content links", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue({
      id: catalogCourse.id,
      title: catalogCourse.title,
      description: catalogCourse.description,
      createdAt: catalogCourse.createdAt,
      duration: catalogCourse.duration,
      price: catalogCourse.price,
    });

    await expect(getCourse(catalogCourse.id)).rejects.toThrow();
  });

  it("rejects an invalid course id before calling the backend", async () => {
    await expect(getCourse(0)).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });
});
