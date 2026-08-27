import { describe, expect, it } from "vitest";

import {
  getOAuthErrorMessage,
  oauthSearchSchema,
} from "@/features/auth/errors/oauth-error";

describe("OAuth errors", () => {
  it("maps an unlinked account to password login guidance", () => {
    const result = oauthSearchSchema.parse({ error: "account_not_linked" });

    expect(result).toEqual({ error: "account_not_linked" });
    expect(getOAuthErrorMessage(result.error)).toBe(
      "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña.",
    );
  });

  it("sanitizes unknown callback errors", () => {
    const result = oauthSearchSchema.parse({ error: "provider_secret_error" });

    expect(result).toEqual({ error: "unknown" });
    expect(getOAuthErrorMessage(result.error)).toBe(
      "No fue posible iniciar sesión con Google. Inténtalo nuevamente.",
    );
    expect(getOAuthErrorMessage(result.error)).not.toContain(
      "provider_secret_error",
    );
  });

  it("returns no message when no callback error is present", () => {
    const result = oauthSearchSchema.parse({});

    expect(result).toEqual({ error: undefined });
    expect(getOAuthErrorMessage(result.error)).toBeUndefined();
  });
});
