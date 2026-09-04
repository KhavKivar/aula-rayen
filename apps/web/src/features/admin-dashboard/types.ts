export type PaymentStatus = "approved" | "pending" | "rejected";

export interface DemoTransaction {
  orderId: string;
  userId: string;
  buyerName: string;
  buyerEmail: string;
  courseId: number;
  courseTitle: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  maskedCard: string;
  authorizationCode?: string;
}

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
