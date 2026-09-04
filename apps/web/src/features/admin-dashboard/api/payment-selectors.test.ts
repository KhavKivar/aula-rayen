import { describe, expect, it } from "vitest";

import { DEMO_TODAY, demoTransactions } from "@/features/admin-dashboard/api/demo-transactions";
import {
  filterPayments,
  getCoursePurchasers,
  getPaymentMetrics,
} from "@/features/admin-dashboard/api/payment-selectors";

const demoToday = new Date(`${DEMO_TODAY}T23:59:59.999Z`);

describe("admin dashboard payments", () => {
  it("derives approved purchasers by course", () => {
    const purchasers = getCoursePurchasers(1);

    expect(purchasers).toHaveLength(2);
    expect(purchasers.every(({ paymentStatus }) => paymentStatus === "approved")).toBe(true);
    expect(getCoursePurchasers(999)).toEqual([]);
  });

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
