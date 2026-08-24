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
  });

  it("shows authentication links when no session is active", () => {
    render(<Navbar isLoggedIn={false} isPending={false} />);

    expect(
      screen.getByRole("link", { name: "Ingresar" }),
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", { name: "Crear cuenta" }),
    ).toHaveAttribute("href", "/register");
  });
});
