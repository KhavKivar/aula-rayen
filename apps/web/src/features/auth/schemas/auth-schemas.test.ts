import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import {
  newPasswordSchema,
  passwordResetRequestSchema,
  resetPasswordSearchSchema,
} from "@/features/auth/schemas/password-recovery-schema";
import { registerSchema } from "@/features/auth/schemas/register-schema";

describe("auth schemas", () => {
  it("normalizes valid login credentials", () => {
    const result = loginSchema.parse({
      email: "  persona@example.com ",
      password: "secreto",
    });

    expect(result).toEqual({
      email: "persona@example.com",
      password: "secreto",
    });
  });

  it("rejects invalid login credentials", () => {
    const result = loginSchema.safeParse({ email: "correo-invalido", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Ingresa un correo electrónico válido.",
      "Ingresa tu contraseña.",
    ]);
  });

  it("rejects registration when passwords do not match", () => {
    const result = registerSchema.safeParse({
      name: "Rayén",
      email: "rayen@example.com",
      password: "password-seguro",
      confirmPassword: "otro-password",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["confirmPassword"],
          message: "Las contraseñas no coinciden.",
        }),
      ]),
    );
  });

  it("normalizes valid password-reset email requests", () => {
    expect(
      passwordResetRequestSchema.parse({ email: " person@example.com " }),
    ).toEqual({ email: "person@example.com" });
    expect(
      passwordResetRequestSchema.safeParse({ email: "invalid" }).success,
    ).toBe(false);
  });

  it("requires matching passwords with at least eight characters", () => {
    expect(
      newPasswordSchema.safeParse({
        password: "short",
        confirmPassword: "different",
      }).error?.issues.map((issue) => issue.message),
    ).toEqual([
      "La contraseña debe tener al menos 8 caracteres.",
      "Las contraseñas no coinciden.",
    ]);
  });

  it("accepts only a reset token or Better Auth's invalid-token outcome", () => {
    expect(resetPasswordSearchSchema.parse({ token: " reset-token " })).toEqual({
      token: "reset-token",
    });
    expect(resetPasswordSearchSchema.parse({ error: "INVALID_TOKEN" })).toEqual({
      error: "INVALID_TOKEN",
    });
    expect(resetPasswordSearchSchema.safeParse({}).success).toBe(false);
    expect(
      resetPasswordSearchSchema.safeParse({ error: "UNKNOWN_ERROR" }).success,
    ).toBe(false);
  });
});
