import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthError } from "@/features/auth/errors/auth-error";
import { render } from "@/testing/test-utils";

const { resetPasswordMock } = vi.hoisted(() => ({ resetPasswordMock: vi.fn() }));

vi.mock("@/features/auth/api/password-recovery", () => ({
  resetPassword: resetPasswordMock,
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

async function fillPasswords(
  user: ReturnType<typeof userEvent.setup>,
  password = "new-password",
  confirmation = password,
) {
  await user.type(screen.getByLabelText("Nueva contraseña"), password);
  await user.type(screen.getByLabelText("Confirmar nueva contraseña"), confirmation);
}

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects short or mismatched passwords before consuming the token", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    await fillPasswords(user, "short", "different");
    await user.click(screen.getByRole("button", { name: "Actualizar contraseña" }));

    expect(
      await screen.findByText("La contraseña debe tener al menos 8 caracteres."),
    ).toBeVisible();
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeVisible();
    expect(resetPasswordMock).not.toHaveBeenCalled();
  });

  it("disables duplicate submission while the reset is pending", async () => {
    const user = userEvent.setup();
    const request = Promise.withResolvers<void>();
    resetPasswordMock.mockReturnValueOnce(request.promise);
    render(<ResetPasswordForm token="reset-token" />);

    await fillPasswords(user);
    await user.dblClick(
      screen.getByRole("button", { name: "Actualizar contraseña" }),
    );

    expect(screen.getByRole("button", { name: "Actualizando..." })).toBeDisabled();
    expect(resetPasswordMock).toHaveBeenCalledTimes(1);
    request.resolve();
  });

  it("communicates session revocation after a successful reset", async () => {
    const user = userEvent.setup();
    resetPasswordMock.mockResolvedValueOnce(undefined);
    render(<ResetPasswordForm token="reset-token" />);

    await fillPasswords(user);
    await user.click(screen.getByRole("button", { name: "Actualizar contraseña" }));

    expect(await screen.findByText("Contraseña actualizada.")).toBeVisible();
    expect(screen.getByText(/Cerramos tus sesiones/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("replaces the form with request-new-link guidance for a consumed token", async () => {
    const user = userEvent.setup();
    resetPasswordMock.mockRejectedValueOnce(
      new AuthError("Este enlace ya no es válido.", "INVALID_TOKEN", 400),
    );
    render(<ResetPasswordForm token="used-token" />);

    await fillPasswords(user);
    await user.click(screen.getByRole("button", { name: "Actualizar contraseña" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Este enlace venció, ya fue utilizado o no es válido.",
    );
    expect(
      screen.getByRole("link", { name: "Solicitar un nuevo enlace" }),
    ).toHaveAttribute("href", "/forgot-password");
  });
});
