import {
  paymentListResponseSchema,
  type PaymentResponse,
  type PaymentListResponse,
} from "@aula-rayen/contracts/payment";

import { apiClient } from "@/lib/api-client";

export async function getPayments(): Promise<PaymentResponse[]> {
  const { data } = await apiClient.get<unknown>("/webpay/payments");
  const parsed: PaymentListResponse = paymentListResponseSchema.parse(data);

  return parsed.map((payment) => ({ ...payment }));
}
