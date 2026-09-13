import { describe, expect, it } from "vitest";

import {
  commitRedirectSchema,
  commitResultSchema,
  createWebpayRequestSchema,
  createWebpayResponseSchema,
  paymentResultStatusSchema,
} from "./webpay.js";

describe("createWebpayRequestSchema", () => {
  it("accepts a valid course id", () => {
    expect(createWebpayRequestSchema.parse({ course_id: 4 })).toEqual({
      course_id: 4,
    });
  });

  it("rejects non-positive course ids and unknown fields", () => {
    expect(() =>
      createWebpayRequestSchema.parse({ course_id: 0 }),
    ).toThrow();
    expect(() =>
      createWebpayRequestSchema.parse({ course_id: 4, amount: 100 }),
    ).toThrow();
  });
});

describe("createWebpayResponseSchema", () => {
  it("accepts the Transbank token and url", () => {
    expect(
      createWebpayResponseSchema.parse({
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
      createWebpayResponseSchema.parse({
        token: "",
        url: "https://webpay.example.com/tbk",
      }),
    ).toThrow();
    expect(() =>
      createWebpayResponseSchema.parse({
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
