import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAvailabilitySlot,
  createAvailabilitySlots,
} from "@/features/admin-reservations/api/create-availability-slot";
import { deleteAvailabilitySlot } from "@/features/admin-reservations/api/delete-availability-slot";
import { getAvailabilitySlots } from "@/features/admin-reservations/api/get-availability-slots";

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

const slot = {
  id: 1,
  startTime: "2026-10-01T10:00:00.000Z",
  endTime: "2026-10-01T11:00:00.000Z",
  assignedTo: "assignee-id",
  createdBy: "admin-id",
  createdAt: "2026-09-01T00:00:00.000Z",
  status: "available",
};

const validCreatePayload = {
  startTime: "2026-10-01T10:00:00.000Z",
  endTime: "2026-10-01T11:00:00.000Z",
  assignedTo: "assignee-id",
};

describe("Availability API", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it("fetches slots via apiClient.get", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [slot] });

    await expect(getAvailabilitySlots()).resolves.toEqual([slot]);
    expect(apiClient.get).toHaveBeenCalledWith("/availability-slots");
  });

  it("creates a slot via apiClient.post", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: slot });

    await expect(createAvailabilitySlot(validCreatePayload)).resolves.toEqual(
      slot,
    );
    expect(apiClient.post).toHaveBeenCalledWith(
      "/availability-slots",
      validCreatePayload,
    );
  });

  it("rejects invalid create payload before calling backend", async () => {
    await expect(
      createAvailabilitySlot({ ...validCreatePayload, startTime: "ayer" }),
    ).rejects.toThrow();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("creates many slots with a single batch request", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: [slot] });

    await expect(
      createAvailabilitySlots([validCreatePayload, validCreatePayload]),
    ).resolves.toEqual([slot]);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith("/availability-slots/batch", [
      validCreatePayload,
      validCreatePayload,
    ]);
  });

  it("rejects an empty batch before calling backend", async () => {
    await expect(createAvailabilitySlots([])).rejects.toThrow();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("deletes a slot via apiClient.delete", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: slot });

    await expect(deleteAvailabilitySlot({ id: 1 })).resolves.toEqual(slot);
    expect(apiClient.delete).toHaveBeenCalledWith("/availability-slots/1");
  });

  it("rejects invalid id on delete", async () => {
    await expect(deleteAvailabilitySlot({ id: -1 })).rejects.toThrow();
    expect(apiClient.delete).not.toHaveBeenCalled();
  });
});
