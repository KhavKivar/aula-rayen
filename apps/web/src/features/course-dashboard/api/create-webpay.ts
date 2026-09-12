import axios from "axios";
import {
  createWebpayRequestSchema,
  createWebpayResponseSchema,
  type CreateWebpayRequest,
  type CreateWebpayResponse,
} from "@aula-rayen/contracts/webpay";

import { apiClient } from "@/lib/api-client";
import { UserFacingError } from "@/lib/user-facing-error";

type ApiErrorResponse = {
  message?: string | string[];
};

export class CreateWebPayError extends UserFacingError {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CreateWebPayError";
  }
}

export async function createWebPay(
  createWebPayDto: CreateWebpayRequest,
): Promise<CreateWebpayResponse> {
  const parsedDto = createWebpayRequestSchema.parse(createWebPayDto);

  try {
    const { data } = await apiClient.post<CreateWebpayResponse>(
      "/webpay",
      parsedDto,
    );

    return createWebpayResponseSchema.parse(data);
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiMessage = error.response?.data?.message;
      const message = Array.isArray(apiMessage)
        ? apiMessage.join(" ")
        : apiMessage;

      throw new CreateWebPayError(
        message ?? "No fue posible iniciar el pago con Webpay.",
        error.response?.status,
      );
    }

    throw error;
  }
}
