import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CourseManagementPanel } from "@/features/course-management/components/course-management-panel";
import { render } from "@/testing/test-utils";

vi.mock("@/config/env", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "https://api.example.com",
    NEXT_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

const course = {
  id: 1,
  title: "Curso demo",
  description: "Descripción breve",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "2 horas",
  price: 25000,
  hasAccess: true,
};

const mockGetCourses = vi.fn();
vi.mock("@/features/course-dashboard/api/get-courses", () => ({
  getCourses: () => mockGetCourses(),
}));
vi.mock("@/features/course-dashboard/api/get-course", () => ({
  getCourse: vi.fn().mockResolvedValue({
    id: 1,
    title: "Curso demo",
    description: "Descripción breve",
    createdAt: "2026-08-17T00:00:00.000Z",
    duration: "2 horas",
    price: 25000,
    videoLink: "https://example.com/video",
    fileLink: "https://example.com/file",
  }),
}));

describe("CourseManagementPanel", () => {
  it("shows gestion header and crear button", async () => {
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel />);

    expect(await screen.findByRole("heading", { name: "Gestionar cursos" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Crear curso" })).toBeVisible();
  });

  it("shows empty state when no courses", async () => {
    mockGetCourses.mockResolvedValue([]);
    render(<CourseManagementPanel />);

    expect(await screen.findByText("No hay cursos aún")).toBeVisible();
    expect(screen.getByRole("button", { name: "Crear tu primer curso" })).toBeVisible();
  });

  it("renders cursos and opens delete dialog", async () => {
    const user = userEvent.setup();
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel />);

    expect(await screen.findByText(course.title)).toBeVisible();

    await user.click(screen.getByRole("button", { name: `Eliminar ${course.title}` }));
    const dialog = await screen.findByRole("dialog", { name: "Confirmar eliminación" });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(course.title);
  });

  it("opens create dialog", async () => {
    const user = userEvent.setup();
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel />);

    await screen.findByText(course.title);
    await user.click(screen.getByRole("button", { name: "Crear curso" }));
    expect(await screen.findByRole("dialog", { name: "Crear curso" })).toBeVisible();
  });
});
