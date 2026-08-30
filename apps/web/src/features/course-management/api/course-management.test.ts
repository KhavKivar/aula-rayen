import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCourse } from "@/features/course-management/api/create-course";
import { deleteCourse } from "@/features/course-management/api/delete-course";
import { updateCourse } from "@/features/course-management/api/update-course";

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
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.patch).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it("creates a course via apiClient", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: courseDetail });

    await expect(createCourse(validCreatePayload)).resolves.toEqual(
      courseDetail,
    );
    expect(apiClient.post).toHaveBeenCalledWith("/courses", validCreatePayload);
  });

  it("rejects invalid create payload before calling backend", async () => {
    await expect(
      createCourse({ ...validCreatePayload, title: "" }),
    ).rejects.toThrow();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("propagates backend error on create", async () => {
    const axiosError = Object.assign(new Error("Error"), {
      isAxiosError: true,
      response: { status: 400, data: { message: "Error" } },
    });
    vi.mocked(apiClient.post).mockRejectedValue(axiosError);

    await expect(createCourse(validCreatePayload)).rejects.toEqual(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });

  it("updates a course via apiClient.patch", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: courseDetail });

    await expect(
      updateCourse({ id: 1, data: { title: "Nuevo título" } }),
    ).resolves.toEqual(courseDetail);
    expect(apiClient.patch).toHaveBeenCalledWith("/courses/1", {
      title: "Nuevo título",
    });
  });

  it("rejects empty update payload", async () => {
    await expect(updateCourse({ id: 1, data: {} })).rejects.toThrow();
    expect(apiClient.patch).not.toHaveBeenCalled();
  });

  it("rejects invalid id on update", async () => {
    await expect(
      updateCourse({ id: 0, data: { title: "x" } }),
    ).rejects.toThrow();
    expect(apiClient.patch).not.toHaveBeenCalled();
  });

  it("deletes a course via apiClient.delete", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: courseDetail });

    await expect(deleteCourse({ id: 1 })).resolves.toEqual(courseDetail);
    expect(apiClient.delete).toHaveBeenCalledWith("/courses/1");
  });

  it("rejects invalid id on delete", async () => {
    await expect(deleteCourse({ id: -1 })).rejects.toThrow();
    expect(apiClient.delete).not.toHaveBeenCalled();
  });
});
