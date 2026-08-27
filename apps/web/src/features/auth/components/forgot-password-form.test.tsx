import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render } from "@/testing/test-utils";

const { requestPasswordResetMock } = vi.hoisted(() => ({
  requestPasswordResetMock: vi.fn(),
}));

vi.mock("@/features/auth/api/password-recovery", () => ({
  requestPasswordReset: requestPasswordResetMock,
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an accessible validation error without requesting a reset", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "invalid",
    );
    await user.click(screen.getByRole("button", { name: "Enviar instrucciones" }));

    expect(
      await screen.findByText("Ingresa un correo electrónico válido."),
    ).toBeVisible();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(requestPasswordResetMock).not.toHaveBeenCalled();
  });

  it("deduplicates pending submissions and shows generic confirmation", async () => {
    const user = userEvent.setup();
    const request = Promise.withResolvers<void>();
    requestPasswordResetMock.mockReturnValueOnce(request.promise);
    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "person@example.com",
    );
    const submit = screen.getByRole("button", { name: "Enviar instrucciones" });
    await user.dblClick(submit);

    expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled();
    expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);

    request.resolve();

    expect(
      await screen.findByText(
        "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
      ),
    ).toHaveAttribute("role", "status");
  });
});
