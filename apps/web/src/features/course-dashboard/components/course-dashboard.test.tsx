import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("switches between its real catalog and management panels", async () => {
    const user = userEvent.setup();
    render(<CourseDashboard />);

    expect(
      await screen.findByRole("tabpanel", { name: "Ver cursos" }),
    ).toBeVisible();

    await user.click(
      screen.getByRole("tab", { name: "Gestionar cursos" }),
    );

    expect(
      screen.getByRole("tabpanel", { name: "Gestionar cursos" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Gestionar cursos" }),
    ).toBeVisible();
  });
});
