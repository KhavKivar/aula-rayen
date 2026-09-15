import axios from "axios";
import {
  webpayCreateRequestSchema,
  webpayCreateResponseSchema,
  type WebpayCreateRequest,
  type WebpayCreateResponse,
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
  createWebPayDto: WebpayCreateRequest,
): Promise<WebpayCreateResponse> {
  const parsedDto = webpayCreateRequestSchema.parse(createWebPayDto);

  try {
    const { data } = await apiClient.post<WebpayCreateResponse>(
      "/webpay",
      parsedDto,
    );

    return webpayCreateResponseSchema.parse(data);
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
