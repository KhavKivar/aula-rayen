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

vi.mock("@/features/course-dashboard/api/get-courses", () => ({
  getCourses: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/course-dashboard/components/course-catalog", () => ({
  CourseCatalog: () => null,
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
});
