import { signIn } from "@/lib/auth-client";

import { AuthError, toAuthError } from "@/features/auth/errors/auth-error";
import type { LoginCredentials } from "@/features/auth/schemas/login-schema";

export async function login(credentials: LoginCredentials): Promise<void> {
  try {
    const { error } = await signIn.email({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw toAuthError(error, "No fue posible iniciar sesión.");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw toAuthError({}, "No fue posible conectar con el servidor.");
  }
}

export async function loginWithGoogle(redirectTo: string): Promise<void> {
  try {
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: new URL(redirectTo, window.location.origin).toString(),
      errorCallbackURL: new URL(
        `/login?redirect=${encodeURIComponent(redirectTo)}`,
        window.location.origin,
      ).toString(),
    });

    if (error) {
      throw toAuthError(error, "No fue posible iniciar sesión con Google.");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw toAuthError({}, "No fue posible conectar con Google.");
  }
}
