import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestBackendJson } from "@/lib/backend-api.server";
import { createCourse } from "@/features/course-management/api/create-course";
import { updateCourse } from "@/features/course-management/api/update-course";
import { deleteCourse } from "@/features/course-management/api/delete-course";

const { BackendApiError } = vi.hoisted(() => {
  class BackendApiError extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
      this.name = "BackendApiError";
    }
  }
  return { BackendApiError };
});

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
  BackendApiError,
}));

const courseDetail = {
  id: 1,
  title: "Arteterapia",
  description: "Descripción",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "2 horas",
  price: 25000,
  videoLink: "https://example.com/video",
  fileLink: "https://example.com/file",
};

const validCreatePayload = {
  title: "Nuevo curso",
  description: "Descripción",
  videoLink: "https://example.com/video",
  fileLink: "https://example.com/file",
  duration: "3 horas",
  price: 30000,
};

describe("Course Management API", () => {
  beforeEach(() => {
    vi.mocked(requestBackendJson).mockReset();
  });

  it("creates a course", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue(courseDetail);

    await expect(createCourse(validCreatePayload)).resolves.toEqual(
      courseDetail,
    );
    expect(requestBackendJson).toHaveBeenCalledWith("/courses", {
      method: "POST",
      body: validCreatePayload,
    });
  });

  it("rejects invalid create payload before calling backend", async () => {
    await expect(
      createCourse({ ...validCreatePayload, title: "" }),
    ).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });

  it("propagates backend error on create", async () => {
    vi.mocked(requestBackendJson).mockRejectedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (BackendApiError as any)("Error", 400),
    );

    await expect(createCourse(validCreatePayload)).rejects.toBeInstanceOf(
      BackendApiError,
    );
  });

  it("updates a course", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue(courseDetail);

    await expect(
      updateCourse({ id: 1, data: { title: "Nuevo título" } }),
    ).resolves.toEqual(courseDetail);
    expect(requestBackendJson).toHaveBeenCalledWith("/courses/1", {
      method: "PATCH",
      body: { title: "Nuevo título" },
    });
  });

  it("rejects empty update payload", async () => {
    await expect(updateCourse({ id: 1, data: {} })).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });

  it("rejects invalid id on update", async () => {
    await expect(
      updateCourse({ id: 0, data: { title: "x" } }),
    ).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });

  it("deletes a course", async () => {
    vi.mocked(requestBackendJson).mockResolvedValue(courseDetail);

    await expect(deleteCourse({ id: 1 })).resolves.toEqual(courseDetail);
    expect(requestBackendJson).toHaveBeenCalledWith("/courses/1", {
      method: "DELETE",
    });
  });

  it("rejects invalid id on delete", async () => {
    await expect(deleteCourse({ id: -1 })).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });
});
