import { describe, expect, it } from "vitest";

import {
  commitRedirectSchema,
  commitResultSchema,
  webpayCreateRequestSchema,
  webpayCreateResponseSchema,
  paymentResultStatusSchema,
  webpayAdminSessionsResponseSchema,
} from "./webpay.js";

describe("webpayCreateRequestSchema", () => {
  it("accepts a valid course id", () => {
    expect(webpayCreateRequestSchema.parse({ course_id: 4 })).toEqual({
      course_id: 4,
    });
  });

  it("rejects non-positive course ids and unknown fields", () => {
    expect(() =>
      webpayCreateRequestSchema.parse({ course_id: 0 }),
    ).toThrow();
    expect(() =>
      webpayCreateRequestSchema.parse({ course_id: 4, amount: 100 }),
    ).toThrow();
  });
});

describe("webpayCreateResponseSchema", () => {
  it("accepts the Transbank token and url", () => {
    expect(
      webpayCreateResponseSchema.parse({
        token: "token-ws",
        url: "https://webpay.example.com/tbk",
      }),
    ).toEqual({
      token: "token-ws",
      url: "https://webpay.example.com/tbk",
    });
  });

  it("rejects empty tokens and non-urls", () => {
    expect(() =>
      webpayCreateResponseSchema.parse({
        token: "",
        url: "https://webpay.example.com/tbk",
      }),
    ).toThrow();
    expect(() =>
      webpayCreateResponseSchema.parse({
        token: "token-ws",
        url: "not-a-url",
      }),
    ).toThrow();
  });
});

describe("commitResultSchema", () => {
  it("accepts the internal commit outcomes", () => {
    expect(commitResultSchema.parse({ paymentStatus: "ok" })).toEqual({
      paymentStatus: "ok",
    });
    expect(commitResultSchema.parse({ paymentStatus: "pending" })).toEqual({
      paymentStatus: "pending",
    });
    expect(commitResultSchema.parse({ paymentStatus: "canceled" })).toEqual({
      paymentStatus: "canceled",
    });
  });

  it("rejects the legacy payment contract", () => {
    expect(() => commitResultSchema.parse({ payment: true })).toThrow();
  });
});

describe("commitRedirectSchema", () => {
  it("accepts the redirect target", () => {
    expect(
      commitRedirectSchema.parse({
        url: "https://app.example/payment-result?status=success",
      }),
    ).toEqual({
      url: "https://app.example/payment-result?status=success",
    });
  });
});

describe("paymentResultStatusSchema", () => {
  it("accepts the frontend result statuses", () => {
    expect(paymentResultStatusSchema.parse("success")).toBe("success");
    expect(paymentResultStatusSchema.parse("rejected")).toBe("rejected");
    expect(paymentResultStatusSchema.parse("timeout")).toBe("timeout");
  });

  it("rejects the internal commit outcomes", () => {
    expect(() => paymentResultStatusSchema.parse("ok")).toThrow();
    expect(() => paymentResultStatusSchema.parse("canceled")).toThrow();
  });
});

describe("webpayAdminSessionSchema", () => {
  const session = {
    buyOrderId: "W8uYkq2mN5pLx1vBz9cD4aF6h",
    userId: "user-camila",
    courseId: 1,
    amount: 42000,
    vci: "TSY",
    tbAmount: 42000,
    tbStatus: "AUTHORIZED",
    accountingDate: "08192026",
    transactionDate: new Date("2026-08-19T12:00:00.000Z"),
    authorizationCode: "872193",
    paymentTypeCode: "VN",
    responseCode: 0,
    installmentsAmount: 0,
    installmentsNumber: 0,
    createdAt: new Date("2026-09-01T00:00:00.000Z"),
    committedAt: new Date("2026-09-01T00:05:00.000Z"),
    takenAt: new Date("2026-09-01T00:04:00.000Z"),
  };

  it("accepts sanitized session rows", () => {
    expect(webpayAdminSessionsResponseSchema.parse([session])).toEqual([
      session,
    ]);
  });

  it("rejects rows exposing tokenWs or cardNumber", () => {
    expect(() =>
      webpayAdminSessionsResponseSchema.parse([
        { ...session, tokenWs: "token-ws" },
      ]),
    ).toThrow();
    expect(() =>
      webpayAdminSessionsResponseSchema.parse([
        { ...session, cardNumber: "6623123456788034" },
      ]),
    ).toThrow();
  });
});
