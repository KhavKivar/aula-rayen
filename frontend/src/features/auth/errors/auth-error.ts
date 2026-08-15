type AuthProviderError = {
  code?: string;
  status?: number;
};

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_NOT_VERIFIED: "Debes verificar tu correo antes de ingresar.",
  INVALID_EMAIL_OR_PASSWORD: "Correo o contraseña incorrectos.",
  TOO_MANY_REQUESTS: "Demasiados intentos. Inténtalo nuevamente más tarde.",
  USER_ALREADY_EXISTS: "Ya existe una cuenta con este correo.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Ya existe una cuenta con este correo.",
};

export function toAuthError(
  error: AuthProviderError,
  fallbackMessage: string,
): AuthError {
  const message =
    (error.code && AUTH_ERROR_MESSAGES[error.code]) ||
    (error.status === 429 ? AUTH_ERROR_MESSAGES.TOO_MANY_REQUESTS : undefined) ||
    fallbackMessage;

  return new AuthError(message, error.code, error.status);
}
