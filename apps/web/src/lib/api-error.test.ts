import axios from "axios";
import { describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "@/lib/api-client";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  ApiError,
  toApiError,
  toApiErrorMessage,
} from "@/lib/api-error";

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://auth.example.com",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

function axiosError(data: unknown, status?: number) {
  const error = new Error("Request failed with status code 409");
  return Object.assign(error, {
    isAxiosError: true,
    response: status === undefined ? undefined : { status, data },
    config: {},
  });
}

vi.spyOn(axios, "isAxiosError").mockImplementation((payload: unknown) =>
  Boolean((payload as { isAxiosError?: boolean } | null)?.isAxiosError),
);

describe("toApiErrorMessage", () => {
  it("prefers the backend message for Nest-style errors", () => {
    const error = axiosError(
      {
        statusCode: 409,
        message: "No se puede eliminar un curso que ya tiene compras",
        error: "Conflict",
      },
      409,
    );

    expect(toApiErrorMessage(error, "No se pudo eliminar el curso")).toBe(
      "No se puede eliminar un curso que ya tiene compras",
    );
  });

  it("prefers code-specific messages when a map is provided", () => {
    const error = axiosError(
      {
        statusCode: 409,
        message: "No se puede eliminar un curso que ya tiene compras",
        error: "Conflict",
        code: "COURSE_HAS_PURCHASES",
      },
      409,
    );

    expect(
      toApiErrorMessage(error, "fallback", {
        COURSE_HAS_PURCHASES: "Tiene compras asociadas.",
      }),
    ).toBe("Tiene compras asociadas.");
  });

  it("joins array messages from validation errors", () => {
    const error = axiosError(
      { statusCode: 400, message: ["Título inválido", "Precio inválido"] },
      400,
    );

    expect(toApiErrorMessage(error, "fallback")).toBe(
      "Título inválido. Precio inválido",
    );
  });

  it("uses contracts defaults when the body is unusable", () => {
    expect(
      toApiErrorMessage(axiosError({ unexpected: true }, 404), "fallback"),
    ).toBe("El recurso solicitado no existe.");
  });

  it("never leaks the raw axios message", () => {
    const error = axiosError({ unexpected: true }, 409);

    expect(toApiErrorMessage(error, "fallback")).toBe(
      "Esta acción entró en conflicto con el estado actual.",
    );
    expect(toApiErrorMessage(error, "fallback")).not.toContain(
      "Request failed",
    );
  });

  it("uses the fallback without response (network errors)", () => {
    expect(toApiErrorMessage(axiosError(undefined), "Sin conexión")).toBe(
      "Sin conexión",
    );
  });

  it("respects domain errors as-is", () => {
    expect(
      toApiErrorMessage(new SessionExpiredError(), "fallback"),
    ).toBe("Sesión expirada");
    expect(
      toApiErrorMessage(
        new AuthError("Correo o contraseña incorrectos."),
        "fallback",
      ),
    ).toBe("Correo o contraseña incorrectos.");
  });

  it("falls back for plain errors and unknown values", () => {
    expect(toApiErrorMessage(new Error("boom"), "fallback")).toBe("boom");
    expect(toApiErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});

describe("toApiError", () => {
  it("wraps axios errors with normalized message and status", () => {
    const wrapped = toApiError(
      axiosError({ statusCode: 409, message: "Conflicto real" }, 409),
      "fallback",
    );

    expect(wrapped).toBeInstanceOf(ApiError);
    expect(wrapped.message).toBe("Conflicto real");
    expect(wrapped.status).toBe(409);
  });

  it("extracts the backend code", () => {
    const wrapped = toApiError(
      axiosError(
        {
          statusCode: 409,
          message: "Conflicto real",
          error: "Conflict",
          code: "COURSE_HAS_PURCHASES",
        },
        409,
      ),
      "fallback",
    );

    expect(wrapped.code).toBe("COURSE_HAS_PURCHASES");
  });
});
