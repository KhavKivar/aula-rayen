import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useRouter: () => ({ invalidate: vi.fn() }),
}));

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

vi.mock("@/features/course-dashboard/api/get-courses", () => ({
  getCourses: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/auth-client", () => ({
  signOut: vi.fn(),
}));

import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";
import { render } from "@/testing/test-utils";

describe("CourseDashboard", () => {
  it("shows the circular account menu trigger in its header", () => {
    render(<CourseDashboard />);

    expect(
      screen.getByRole("button", { name: "Abrir menú de cuenta" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("menuitem", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument();
  });

  it("keeps course management out of the learner dashboard", async () => {
    render(<CourseDashboard />);

    expect(
      await screen.findByText("No hay cursos disponibles por ahora"),
    ).toBeVisible();
    expect(screen.queryByText("Gestionar cursos")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Administrar" })).not.toBeInTheDocument();
  });

  it("shows the admin entry point only when requested by the route", () => {
    render(<CourseDashboard isAdmin />);

    expect(screen.getByRole("link", { name: "Administrar" })).toHaveAttribute(
      "href",
      "/dashboard/admin",
    );
  });
});
