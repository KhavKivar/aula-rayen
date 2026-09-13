import { describe, expect, it } from "vitest";

import {
  bookingListSchema,
  bookingResponseSchema,
  createBookingRequestSchema,
  updateBookingRequestSchema,
} from "./booking.js";

const booking = {
  id: 1,
  clientId: "client-id",
  slotId: 2,
  status: "pending",
  expiresAt: "2026-10-01T09:00:00.000Z",
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
};

describe("Booking contracts", () => {
  it("accepts a booking response and a list of bookings", () => {
    expect(bookingResponseSchema.parse(booking)).toEqual(booking);
    expect(bookingListSchema.parse([booking])).toEqual([booking]);
    expect(() =>
      bookingResponseSchema.parse({ ...booking, status: "unknown" }),
    ).toThrow();
  });

  it("validates creation with optional status", () => {
    const request = {
      slotId: booking.slotId,
      expiresAt: booking.expiresAt,
    };

    expect(createBookingRequestSchema.parse(request)).toEqual(request);
    expect(
      createBookingRequestSchema.parse({ ...request, status: "confirmed" }),
    ).toEqual({ ...request, status: "confirmed" });
    expect(() =>
      createBookingRequestSchema.parse({ ...request, slotId: 0 }),
    ).toThrow();
  });

  it("validates non-empty partial updates", () => {
    expect(updateBookingRequestSchema.parse({ status: "cancelled" })).toEqual({
      status: "cancelled",
    });
    expect(() => updateBookingRequestSchema.parse({})).toThrow();
    expect(() =>
      updateBookingRequestSchema.parse({ status: "cancelled", unknown: true }),
    ).toThrow();
  });
});
