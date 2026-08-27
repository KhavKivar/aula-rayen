import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigateMock, routerMock, signOutMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  routerMock: { invalidate: vi.fn() },
  signOutMock: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useRouter: () => routerMock,
}));

vi.mock("@/lib/auth-client", () => ({
  signOut: signOutMock,
}));

import { AccountMenu } from "@/features/auth/components/account-menu";
import { render } from "@/testing/test-utils";

describe("AccountMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps logout inside the account menu", async () => {
    const user = userEvent.setup();
    render(<AccountMenu />);

    expect(
      screen.queryByRole("menuitem", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument();

    screen.getByRole("button", { name: "Abrir menú de cuenta" }).focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("menuitem", { name: "Cerrar sesión" }),
    ).toBeVisible();
  });

  it("closes the session and navigates home", async () => {
    const user = userEvent.setup();
    signOutMock.mockResolvedValueOnce({ error: null });
    render(<AccountMenu />);

    screen.getByRole("button", { name: "Abrir menú de cuenta" }).focus();
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith({ to: "/", replace: true });
      expect(routerMock.invalidate).toHaveBeenCalledOnce();
    });
  });
});
