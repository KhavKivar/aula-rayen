import { describe, expect, it } from "vitest";

import {
  AuthError,
  toAuthError,
} from "@/features/auth/errors/auth-error";

describe("toAuthError", () => {
  it("maps a known provider code to a user-facing message", () => {
    const error = toAuthError(
      { code: "INVALID_EMAIL_OR_PASSWORD", status: 401 },
      "Error inesperado.",
    );

    expect(error).toBeInstanceOf(AuthError);
    expect(error).toMatchObject({
      message: "Correo o contraseña incorrectos.",
      code: "INVALID_EMAIL_OR_PASSWORD",
      status: 401,
    });
  });

  it("maps rate limiting by status and preserves the fallback otherwise", () => {
    expect(toAuthError({ status: 429 }, "Error inesperado.").message).toBe(
      "Demasiados intentos. Inténtalo nuevamente más tarde.",
    );
    expect(toAuthError({}, "Error inesperado.").message).toBe(
      "Error inesperado.",
    );
  });
});
