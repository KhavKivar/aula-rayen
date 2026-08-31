import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthError } from "@/features/auth/errors/auth-error";
import { render } from "@/testing/test-utils";

const { loginMock, loginWithGoogleMock, navigateMock, routerMock } =
  vi.hoisted(() => ({
    loginMock: vi.fn(),
    loginWithGoogleMock: vi.fn(),
    navigateMock: vi.fn(),
    routerMock: {
      invalidate: vi.fn(),
    },
  }));

vi.mock("@/features/auth/api/login", () => ({
  login: loginMock,
  loginWithGoogle: loginWithGoogleMock,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
  useRouter: () => routerMock,
}));

import { LoginForm } from "@/features/auth/components/login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors without calling the API", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText("Ingresa un correo electrónico válido."),
    ).toBeVisible();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeVisible();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("links to password recovery", () => {
    render(<LoginForm />);

    expect(screen.getByRole("link", { name: "¿La olvidaste?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });

  it("starts Google sign-in with the requested return route", async () => {
    const user = userEvent.setup();
    loginWithGoogleMock.mockResolvedValueOnce(undefined);
    render(<LoginForm redirectTo="/courses/7" />);

    await user.click(
      screen.getByRole("button", { name: "Continuar con Google" }),
    );

    expect(loginWithGoogleMock).toHaveBeenCalledWith("/courses/7");
  });

  it("shows pending state and navigates after a successful login", async () => {
    const user = userEvent.setup();
    const loginResult = Promise.withResolvers<void>();
    loginMock.mockReturnValueOnce(loginResult.promise);
    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "persona@example.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("button", { name: "Ingresando..." })).toBeDisabled();
    expect(loginMock).toHaveBeenCalledWith(
      {
        email: "persona@example.com",
        password: "secreto",
      },
      expect.anything(),
    );

    loginResult.resolve();

    await waitFor(() => {
      expect(routerMock.invalidate).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/dashboard",
        replace: true,
      });
    });
  });

  it("returns to the requested protected route after login", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValueOnce(undefined);
    render(<LoginForm redirectTo="/courses/7" />);

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "persona@example.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/courses/7",
        replace: true,
      }),
    );
  });

  it("shows an authentication error returned by the API", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValueOnce(
      new AuthError("Correo o contraseña incorrectos."),
    );
    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "persona@example.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "incorrecta");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText("Correo o contraseña incorrectos."),
    ).toHaveAttribute("role", "alert");
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
