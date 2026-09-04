import { screen } from "@testing-library/react";
import { queryOptions } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CourseManagementPanel } from "@/features/course-management/components/course-management-panel";
import { render } from "@/testing/test-utils";

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
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

const fetchCourseDetail = vi.fn().mockResolvedValue({
  id: 1,
  title: "Curso demo",
  description: "Descripción breve",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "2 horas",
  price: 25000,
  videoLink: "https://example.com/video",
  fileLink: "https://example.com/file",
});

function panelProps() {
  return {
    coursesQueryOptions: queryOptions({
      queryKey: ["courses"] as const,
      queryFn: () => mockGetCourses(),
    }),
    fetchCourseDetail,
  };
}

describe("CourseManagementPanel", () => {
  it("shows gestion header and crear button", async () => {
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel {...panelProps()} />);

    expect(await screen.findByRole("heading", { name: "Gestionar cursos" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Crear curso" })).toBeVisible();
  });

  it("shows empty state when no courses", async () => {
    mockGetCourses.mockResolvedValue([]);
    render(<CourseManagementPanel {...panelProps()} />);

    expect(await screen.findByText("No hay cursos aún")).toBeVisible();
    expect(screen.getByRole("button", { name: "Crear tu primer curso" })).toBeVisible();
  });

  it("renders cursos and opens delete dialog", async () => {
    const user = userEvent.setup();
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel {...panelProps()} />);

    expect(await screen.findByText(course.title)).toBeVisible();

    await user.click(screen.getByRole("button", { name: `Eliminar ${course.title}` }));
    const dialog = await screen.findByRole("dialog", { name: "¿Eliminar curso?" });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(course.title);
  });

  it("opens create dialog", async () => {
    const user = userEvent.setup();
    mockGetCourses.mockResolvedValue([course]);
    render(<CourseManagementPanel {...panelProps()} />);

    await screen.findByText(course.title);
    await user.click(screen.getByRole("button", { name: "Crear curso" }));
    expect(await screen.findByRole("dialog", { name: "Crear curso" })).toBeVisible();
  });

  it("exposes an optional purchaser action without coupling its behavior", async () => {
    const user = userEvent.setup();
    const onViewPurchasers = vi.fn();
    mockGetCourses.mockResolvedValue([course]);
    render(
      <CourseManagementPanel
        {...panelProps()}
        onViewPurchasers={onViewPurchasers}
      />,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `Ver compradores de ${course.title}`,
      }),
    );

    expect(onViewPurchasers).toHaveBeenCalledWith(course);
  });
});
