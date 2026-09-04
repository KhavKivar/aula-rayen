import { describe, expect, it } from "vitest";

import { paymentsResponseSchema } from "./payment.js";

const basePayment = {
  orderId: "AR-1048",
  buyerName: "Camila Rojas",
  buyerEmail: "camila@ejemplo.cl",
  courseId: 1,
  courseTitle: "Arteterapia para infancias",
  amount: 42000,
  date: "2026-09-03T13:20:00.000Z",
  status: "approved",
  maskedCard: "•••• 8034",
  authorizationCode: "872193",
};

describe("paymentsResponseSchema", () => {
  it("accepts a list of admin payments", () => {
    expect(
      paymentsResponseSchema.parse([
        basePayment,
        { ...basePayment, orderId: "AR-1047", status: "pending" },
      ]),
    ).toHaveLength(2);
  });

  it("allows missing authorization code", () => {
    const { authorizationCode: _omitted, ...withoutCode } = basePayment;

    expect(paymentsResponseSchema.parse([withoutCode])[0]).not.toHaveProperty(
      "authorizationCode",
    );
  });

  it("rejects unknown statuses and full card numbers outside maskedCard", () => {
    expect(() =>
      paymentsResponseSchema.parse([{ ...basePayment, status: "refunded" }]),
    ).toThrow();
    expect(() =>
      paymentsResponseSchema.parse([{ ...basePayment, maskedCard: "" }]),
    ).toThrow();
  });
});
