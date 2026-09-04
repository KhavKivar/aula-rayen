import type {
  CoursePurchaser,
  AdminPayment,
  PaymentFilters,
  PaymentMetrics,
} from "@/features/admin-dashboard/types";

export const DEMO_TODAY = "2026-09-03";

export const demoTransactions: readonly AdminPayment[] = [
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
  {
    orderId: "AR-1047",
    userId: "user-matias",
    buyerName: "Matías Silva",
    buyerEmail: "matias@ejemplo.cl",
    courseId: 2,
    courseTitle: "Herramientas para talleres grupales",
    amount: 35000,
    date: "2026-09-01T16:45:00.000Z",
    status: "pending",
    maskedCard: "•••• 1129",
  },
  {
    orderId: "AR-1046",
    userId: "user-valentina",
    buyerName: "Valentina Soto",
    buyerEmail: "vale@ejemplo.cl",
    courseId: 1,
    courseTitle: "Arteterapia para infancias",
    amount: 42000,
    date: "2026-08-28T10:05:00.000Z",
    status: "approved",
    maskedCard: "•••• 4490",
    authorizationCode: "531882",
  },
  {
    orderId: "AR-1045",
    userId: "user-diego",
    buyerName: "Diego Fuentes",
    buyerEmail: "diego@ejemplo.cl",
    courseId: 3,
    courseTitle: "Primeros auxilios psicológicos",
    amount: 29000,
    date: "2026-08-16T19:30:00.000Z",
    status: "rejected",
    maskedCard: "•••• 7701",
  },
  {
    orderId: "AR-1044",
    userId: "user-fernanda",
    buyerName: "Fernanda López",
    buyerEmail: "fernanda@ejemplo.cl",
    courseId: 2,
    courseTitle: "Herramientas para talleres grupales",
    amount: 35000,
    date: "2026-08-08T09:15:00.000Z",
    status: "approved",
    maskedCard: "•••• 2048",
    authorizationCode: "118429",
  },
];

export function getCoursePurchasers(
  courseId: number,
  transactions: readonly AdminPayment[] = demoTransactions,
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
  transactions: readonly AdminPayment[],
  filters: PaymentFilters,
): AdminPayment[] {
  const query = filters.query.trim().toLocaleLowerCase("es-CL");
  const today = new Date(`${DEMO_TODAY}T23:59:59.999Z`).getTime();
  const periodDays = filters.period === "7d" ? 7 : 30;
  const threshold = today - periodDays * 24 * 60 * 60 * 1000;

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
  transactions: readonly AdminPayment[],
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
