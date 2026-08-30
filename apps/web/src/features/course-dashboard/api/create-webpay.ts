import axios from "axios";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const createWebPayDtoSchema = z.object({
  course_id: z.number().int().positive(),
});

const createWebPayResponseSchema = z.object({
  token: z.string().min(1),
  url: z.url(),
});

export type CreateWebPayDto = z.infer<typeof createWebPayDtoSchema>;
export type CreateWebPayResponse = z.infer<typeof createWebPayResponseSchema>;

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
  const parsedDto = createWebPayDtoSchema.parse(createWebPayDto);

  try {
    const { data } = await apiClient.post<CreateWebPayResponse>(
      "/webpay",
      parsedDto,
    );

    return createWebPayResponseSchema.parse(data);
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
