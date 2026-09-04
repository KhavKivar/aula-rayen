import {
  paymentsResponseSchema,
  type Payment,
  type PaymentsResponse,
} from "@aula-rayen/contracts/payment";

import { apiClient } from "@/lib/api-client";

export async function getPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<unknown>("/webpay/payments");
  const parsed: PaymentsResponse = paymentsResponseSchema.parse(data);

  return parsed.map((payment) => ({ ...payment }));
}
