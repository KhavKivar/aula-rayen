import {
  getOAuthErrorMessage,
  type OAuthErrorCode,
} from "@/features/auth/errors/oauth-error";

export function OAuthErrorAlert({ error }: { error?: OAuthErrorCode }) {
  const message = getOAuthErrorMessage(error);

  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mb-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
    >
      {message}
    </p>
  );
}
