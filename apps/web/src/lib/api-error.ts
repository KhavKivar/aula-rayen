import {
  apiErrorSchema,
  getDefaultApiErrorMessage,
} from "@aula-rayen/contracts/api-error";
import axios from "axios";

import { SessionExpiredError } from "@/lib/api-client";
import { AuthError } from "@/features/auth/errors/auth-error";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function joinBackendMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join(". ") : message;
}

/**
 * Convierte cualquier error de una mutación/query en un mensaje ES apto
 * para la UI. Prioridad: mensaje real del backend (validado con
 * `apiErrorSchema`) > mapa por status de contracts > fallback.
 * Nunca expone el texto crudo de axios ("Request failed...").
 */
export function toApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof SessionExpiredError) return error.message;
  if (error instanceof AuthError) return error.message;
  if (error instanceof ApiError) return error.message;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const parsed = apiErrorSchema.safeParse(error.response?.data);

    if (parsed.success) {
      const text = joinBackendMessage(parsed.data.message).trim();
      if (text.length > 0) return text;
    }

    return getDefaultApiErrorMessage(status, fallback);
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

/** Envuelve un error desconocido en ApiError con mensaje ya normalizado. */
export function toApiError(error: unknown, fallback: string): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    return new ApiError(
      toApiErrorMessage(error, fallback),
      error.response?.status,
    );
  }
  return new ApiError(toApiErrorMessage(error, fallback));
}
