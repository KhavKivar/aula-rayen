import {
  paymentsResponseSchema,
  type PaymentsResponse,
} from "@aula-rayen/contracts/payment";

import { apiClient } from "@/lib/api-client";
import type { AdminPayment } from "@/features/admin-dashboard/types";

export async function getPayments(): Promise<AdminPayment[]> {
  const { data } = await apiClient.get<unknown>("/webpay/payments");
  const parsed: PaymentsResponse = paymentsResponseSchema.parse(data);

  return parsed.map((payment) => ({ ...payment }));
}
