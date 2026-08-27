import { beforeEach, describe, expect, it, vi } from "vitest";

const { requestPasswordResetMock, resetPasswordMock } = vi.hoisted(() => ({
  requestPasswordResetMock: vi.fn(),
  resetPasswordMock: vi.fn(),
}));

vi.mock("@/config/env", () => ({
  env: { NEXT_PUBLIC_SITE_URL: "https://app.example" },
}));
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: requestPasswordResetMock,
    resetPassword: resetPasswordMock,
  },
}));

import {
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/api/password-recovery";

describe("password recovery API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests a reset with the configured frontend redirect", async () => {
    requestPasswordResetMock.mockResolvedValueOnce({ data: {}, error: null });

    await requestPasswordReset({ email: "person@example.com" });

    expect(requestPasswordResetMock).toHaveBeenCalledWith({
      email: "person@example.com",
      redirectTo: "https://app.example/reset-password",
    });
  });

  it("preserves the generic request outcome for provider errors", async () => {
    requestPasswordResetMock.mockResolvedValueOnce({
      data: null,
      error: { code: "TOO_MANY_REQUESTS", status: 429 },
    });

    await expect(
      requestPasswordReset({ email: "person@example.com" }),
    ).resolves.toBeUndefined();
  });

  it("submits the new password with the reset token", async () => {
    resetPasswordMock.mockResolvedValueOnce({ data: { status: true }, error: null });

    await resetPassword("reset-token", {
      password: "new-password",
      confirmPassword: "new-password",
    });

    expect(resetPasswordMock).toHaveBeenCalledWith({
      newPassword: "new-password",
      token: "reset-token",
    });
  });

  it("maps consumed or invalid tokens to request-new-link guidance", async () => {
    resetPasswordMock.mockResolvedValueOnce({
      data: null,
      error: { code: "INVALID_TOKEN", status: 400 },
    });

    await expect(
      resetPassword("used-token", {
        password: "new-password",
        confirmPassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "INVALID_TOKEN",
      message: "Este enlace ya no es válido. Solicita uno nuevo.",
    });
  });
});
