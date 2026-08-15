import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login-schema";
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
});
