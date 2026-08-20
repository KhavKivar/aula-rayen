import axios from "axios";

import { apiClient } from "@/lib/api-client";

export type CreateWebPayDto = {
  course_id: number;
};

export type CreateWebPayResponse = {
  token: string;
  url: string;
};

type ApiErrorResponse = {
  message?: string | string[];
};

export class CreateWebPayError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CreateWebPayError";
  }
}

export async function createWebPay(
  createWebPayDto: CreateWebPayDto,
): Promise<CreateWebPayResponse> {
  try {
    const { data } = await apiClient.post<CreateWebPayResponse>(
      "/webpay",
      createWebPayDto,
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiMessage = error.response?.data.message;
      const message = Array.isArray(apiMessage)
        ? apiMessage.join(" ")
        : apiMessage;

      throw new CreateWebPayError(
        message ?? "No fue posible iniciar el pago con Webpay.",
        error.response?.status,
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new CreateWebPayError(
      "Ocurrió un error inesperado al iniciar el pago.",
    );
  }
}
