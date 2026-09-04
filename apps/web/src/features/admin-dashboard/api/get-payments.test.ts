import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPayments } from "@/features/admin-dashboard/api/get-payments";

vi.mock("@/lib/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

import { apiClient } from "@/lib/api-client";

const payments = [
  {
    orderId: "AR-1048",
    userId: "user-camila",
    buyerName: "Camila Rojas",
    buyerEmail: "camila@ejemplo.cl",
    courseId: 1,
    courseTitle: "Arteterapia para infancias",
    amount: 42000,
    date: "2026-09-03T13:20:00.000Z",
    status: "approved",
    maskedCard: "•••• 8034",
    authorizationCode: "872193",
  },
];

describe("getPayments", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it("fetches and validates admin payments", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: payments });

    await expect(getPayments()).resolves.toEqual(payments);
    expect(apiClient.get).toHaveBeenCalledWith("/webpay/payments");
  });

  it("rejects payloads that do not match the contract", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ ...payments[0], status: "refunded" }],
    });

    await expect(getPayments()).rejects.toThrow();
  });
});
