import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  BackendApiError,
  requestBackendJson,
} from "@/lib/backend-api.server";

const createWebPayDtoSchema = z.object({
  course_id: z.number().int().positive(),
});

const createWebPayResponseSchema = z.object({
  token: z.string().min(1),
  url: z.url(),
});

export type CreateWebPayDto = z.infer<typeof createWebPayDtoSchema>;
export type CreateWebPayResponse = z.infer<typeof createWebPayResponseSchema>;

const createWebPayServerFn = createServerFn({ method: "POST" })
  .validator(createWebPayDtoSchema)
  .handler(async ({ data }) => {
    try {
      const response = await requestBackendJson("/webpay", {
        method: "POST",
        body: data,
      });

      return {
        success: true as const,
        data: createWebPayResponseSchema.parse(response),
      };
    } catch (error: unknown) {
      if (error instanceof BackendApiError) {
        return {
          success: false as const,
          message: error.message,
          status: error.status,
        };
      }

      throw error;
    }
  });

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
  const result = await createWebPayServerFn({ data: createWebPayDto });

  if (!result.success) {
    throw new CreateWebPayError(result.message, result.status);
  }

  return result.data;
}
