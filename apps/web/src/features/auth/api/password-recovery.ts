import { env } from "@/config/env";
import { AuthError, toAuthError } from "@/features/auth/errors/auth-error";
import type {
  NewPassword,
  PasswordResetRequest,
} from "@/features/auth/schemas/password-recovery-schema";
import { authClient } from "@/lib/auth-client";

export async function requestPasswordReset({
  email,
}: PasswordResetRequest): Promise<void> {
  try {
    await authClient.requestPasswordReset({
      email,
      redirectTo: new URL(
        "/reset-password",
        env.NEXT_PUBLIC_SITE_URL,
      ).toString(),
    });
  } catch {
    throw new AuthError("No fue posible conectar con el servidor.");
  }
}

export async function resetPassword(
  token: string,
  values: NewPassword,
): Promise<void> {
  try {
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      if (error.code === "INVALID_TOKEN") {
        throw new AuthError(
          "Este enlace ya no es válido. Solicita uno nuevo.",
          error.code,
          error.status,
        );
      }

      throw toAuthError(error, "No fue posible restablecer la contraseña.");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("No fue posible conectar con el servidor.");
  }
}
