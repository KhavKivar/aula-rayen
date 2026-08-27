import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

type TestLinkProps = ComponentProps<"a"> & { to: string };

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: TestLinkProps) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { Navbar } from "@/components/ui/navbar";
import { render } from "@/testing/test-utils";

describe("Navbar", () => {
  it("shows the dashboard link for an active session", () => {
    render(<Navbar isLoggedIn isPending={false} />);

    expect(
      screen.getByRole("link", { name: "Ir a mi panel" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(
      screen.queryByRole("link", { name: "Crear cuenta" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument();
  });

  it("shows only the login link when no session is active", () => {
    render(<Navbar isLoggedIn={false} isPending={false} />);

    expect(
      screen.getByRole("link", { name: "Ingresar" }),
    ).toHaveAttribute("href", "/login");
    expect(
      screen.queryByRole("link", { name: "Crear cuenta" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument();
  });

  it("does not show logout while the session is loading", () => {
    render(<Navbar isLoggedIn isPending />);

    expect(
      screen.queryByRole("button", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument();
  });

});
