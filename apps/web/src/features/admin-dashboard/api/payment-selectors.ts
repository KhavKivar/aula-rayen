import type {
  Payment,
  PaymentStatus,
} from "@aula-rayen/contracts/payment";

import { demoTransactions } from "@/features/admin-dashboard/api/demo-transactions";

export interface CoursePurchaser {
  userId: string;
  name: string;
  email: string;
  purchasedAt: string;
  paymentStatus: PaymentStatus;
  orderId: string;
}

export interface PaymentFilters {
  query: string;
  status: PaymentStatus | "all";
  period: "all" | "7d" | "30d";
}

export interface PaymentMetrics {
  approvedAmount: number;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export function getCoursePurchasers(
  courseId: number,
  transactions: readonly Payment[] = demoTransactions,
): CoursePurchaser[] {
  return transactions
    .filter(
      (transaction) =>
        transaction.courseId === courseId && transaction.status === "approved",
    )
    .map((transaction) => ({
      userId: transaction.userId,
      name: transaction.buyerName,
      email: transaction.buyerEmail,
      purchasedAt: transaction.date,
      paymentStatus: transaction.status,
      orderId: transaction.orderId,
    }));
}

export function filterPayments(
  transactions: readonly Payment[],
  filters: PaymentFilters,
  today: Date = new Date(),
): Payment[] {
  const query = filters.query.trim().toLocaleLowerCase("es-CL");
  const endOfToday = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    23,
    59,
    59,
    999,
  );
  const periodDays = filters.period === "7d" ? 7 : 30;
  const threshold = endOfToday - periodDays * 24 * 60 * 60 * 1000;

  return transactions.filter((transaction) => {
    const matchesQuery =
      query.length === 0 ||
      transaction.buyerName.toLocaleLowerCase("es-CL").includes(query) ||
      transaction.buyerEmail.toLocaleLowerCase("es-CL").includes(query) ||
      transaction.orderId.toLocaleLowerCase("es-CL").includes(query);
    const matchesStatus =
      filters.status === "all" || transaction.status === filters.status;
    const matchesPeriod =
      filters.period === "all" ||
      new Date(transaction.date).getTime() >= threshold;

    return matchesQuery && matchesStatus && matchesPeriod;
  });
}

export function getPaymentMetrics(
  transactions: readonly Payment[],
): PaymentMetrics {
  return transactions.reduce<PaymentMetrics>(
    (metrics, transaction) => {
      metrics.total += 1;
      metrics[transaction.status] += 1;
      if (transaction.status === "approved") {
        metrics.approvedAmount += transaction.amount;
      }
      return metrics;
    },
    { approvedAmount: 0, total: 0, approved: 0, pending: 0, rejected: 0 },
  );
}
