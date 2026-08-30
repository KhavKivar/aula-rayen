import { describe, expect, it } from "vitest";

import {
  getOAuthErrorMessage,
  loginSearchSchema,
} from "@/features/auth/errors/oauth-error";

describe("OAuth errors", () => {
  it("maps an unlinked account to password login guidance", () => {
    const result = loginSearchSchema.parse({ error: "account_not_linked" });

    expect(result).toEqual({ error: "account_not_linked", redirect: undefined });
    expect(getOAuthErrorMessage(result.error)).toBe(
      "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña.",
    );
  });

  it("sanitizes unknown callback errors", () => {
    const result = loginSearchSchema.parse({ error: "provider_secret_error" });

    expect(result).toEqual({ error: "unknown", redirect: undefined });
    expect(getOAuthErrorMessage(result.error)).toBe(
      "No fue posible iniciar sesión con Google. Inténtalo nuevamente.",
    );
    expect(getOAuthErrorMessage(result.error)).not.toContain(
      "provider_secret_error",
    );
  });

  it("returns no message when no callback error is present", () => {
    const result = loginSearchSchema.parse({});

    expect(result).toEqual({ error: undefined, redirect: undefined });
    expect(getOAuthErrorMessage(result.error)).toBeUndefined();
  });

  it("accepts only internal redirect destinations", () => {
    expect(loginSearchSchema.parse({ redirect: "/courses/1?tab=video" })).toEqual({
      error: undefined,
      redirect: "/courses/1?tab=video",
    });
    expect(loginSearchSchema.parse({ redirect: "//evil.example" }).redirect).toBeUndefined();
    expect(
      loginSearchSchema.parse({ redirect: "https://evil.example" }).redirect,
    ).toBeUndefined();
  });
});
