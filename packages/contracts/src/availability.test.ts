import { describe, expect, it } from "vitest";

import {
  availabilitySlotListSchema,
  availabilitySlotResponseSchema,
  createAvailabilitySlotRequestSchema,
  createAvailabilitySlotsRequestSchema,
  updateAvailabilitySlotRequestSchema,
} from "./availability.js";

const slot = {
  id: 1,
  startTime: "2026-10-01T10:00:00.000Z",
  endTime: "2026-10-01T11:00:00.000Z",
  assignedTo: "assignee-id",
  createdBy: "admin-id",
  createdAt: "2026-09-01T00:00:00.000Z",
  status: "available",
};

describe("Availability contracts", () => {
  it("accepts a slot response and a list of slots", () => {
    expect(availabilitySlotResponseSchema.parse(slot)).toEqual(slot);
    expect(availabilitySlotListSchema.parse([slot])).toEqual([slot]);
    expect(() =>
      availabilitySlotResponseSchema.parse({ ...slot, status: "taken" }),
    ).toThrow();
  });

  it("validates creation with optional status", () => {
    const request = {
      startTime: slot.startTime,
      endTime: slot.endTime,
      assignedTo: slot.assignedTo,
    };

    expect(createAvailabilitySlotRequestSchema.parse(request)).toEqual(request);
    expect(
      createAvailabilitySlotRequestSchema.parse({
        ...request,
        status: "disabled",
      }),
    ).toEqual({ ...request, status: "disabled" });
    expect(() =>
      createAvailabilitySlotRequestSchema.parse({
        ...request,
        startTime: "ayer",
      }),
    ).toThrow();
  });

  it("validates non-empty partial updates", () => {
    expect(
      updateAvailabilitySlotRequestSchema.parse({ status: "disabled" }),
    ).toEqual({ status: "disabled" });
    expect(() => updateAvailabilitySlotRequestSchema.parse({})).toThrow();
    expect(() =>
      updateAvailabilitySlotRequestSchema.parse({
        status: "disabled",
        unknown: true,
      }),
    ).toThrow();
  });

  it("validates batch creation with at least one slot", () => {
    const request = {
      startTime: slot.startTime,
      endTime: slot.endTime,
      assignedTo: slot.assignedTo,
    };

    expect(createAvailabilitySlotsRequestSchema.parse([request])).toEqual([
      request,
    ]);
    expect(() => createAvailabilitySlotsRequestSchema.parse([])).toThrow();
    expect(() =>
      createAvailabilitySlotsRequestSchema.parse([
        { ...request, startTime: "ayer" },
      ]),
    ).toThrow();
  });
});
