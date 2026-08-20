import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render } from "@/testing/test-utils";

const { navigateMock, registerAccountMock, routerMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  registerAccountMock: vi.fn(),
  routerMock: {
    invalidate: vi.fn(),
  },
}));

vi.mock("@/features/auth/api/register", () => ({
  registerAccount: registerAccountMock,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
  useRouter: () => routerMock,
}));

import { RegisterForm } from "@/features/auth/components/register-form";

async function fillRegistrationForm(
  user: ReturnType<typeof userEvent.setup>,
  confirmPassword = "password-seguro",
) {
  await user.type(screen.getByRole("textbox", { name: "Nombre" }), "Rayén");
  await user.type(
    screen.getByRole("textbox", { name: "Correo electrónico" }),
    "rayen@example.com",
  );
  await user.type(screen.getByLabelText("Contraseña"), "password-seguro");
  await user.type(screen.getByLabelText("Confirmar contraseña"), confirmPassword);
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects mismatched passwords without calling the API", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillRegistrationForm(user, "password-distinto");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeVisible();
    expect(registerAccountMock).not.toHaveBeenCalled();
  });

  it("registers valid data and navigates to the home page", async () => {
    const user = userEvent.setup();
    registerAccountMock.mockResolvedValueOnce(undefined);
    render(<RegisterForm />);

    await fillRegistrationForm(user);
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(registerAccountMock).toHaveBeenCalledWith(
      {
        name: "Rayén",
        email: "rayen@example.com",
        password: "password-seguro",
        confirmPassword: "password-seguro",
      },
      expect.anything(),
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: "/", replace: true });
      expect(routerMock.invalidate).toHaveBeenCalledOnce();
    });
  });
});
