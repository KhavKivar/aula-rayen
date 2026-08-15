import { signUp } from "@/lib/auth-client";

import { AuthError, toAuthError } from "@/features/auth/errors/auth-error";
import type { RegisterCredentials } from "@/features/auth/schemas/register-schema";

export async function registerAccount(
  credentials: RegisterCredentials,
): Promise<void> {
  try {
    const { error } = await signUp.email({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw toAuthError(error, "No fue posible crear la cuenta.");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw toAuthError({}, "No fue posible conectar con el servidor.");
  }
}
