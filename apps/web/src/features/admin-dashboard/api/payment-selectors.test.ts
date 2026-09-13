import { describe, expect, it } from "vitest";

import { demoTransactions } from "@/features/admin-dashboard/api/demo-transactions";
import {
  filterPayments,
  getPaymentMetrics,
} from "@/features/admin-dashboard/api/payment-selectors";

const demoToday = new Date("2026-09-03T23:59:59.999Z");

describe("admin dashboard payments", () => {
  it("combines payment filters and computes metrics from visible rows", () => {
    const filtered = filterPayments(
      demoTransactions,
      {
        query: "camila",
        status: "approved",
        period: "7d",
      },
      demoToday,
    );

    expect(filtered.map(({ orderId }) => orderId)).toEqual(["AR-1048"]);
    expect(getPaymentMetrics(filtered)).toEqual({
      approvedAmount: 42000,
      total: 1,
      approved: 1,
      pending: 0,
      rejected: 0,
    });
  });
});
