import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/course-dashboard/api/create-webpay", () => ({
  createWebPay: vi.fn().mockResolvedValue({
    token: "webpay-token",
    url: "https://webpay.example.com",
  }),
}));

import { CourseCatalog } from "@/features/course-dashboard/components/course-catalog";
import type { Course } from "@/features/course-dashboard/types/course";
import { render } from "@/testing/test-utils";

const course: Course = {
  id: 1,
  title: "Curso de demostración",
  description: "Una descripción breve para probar el catálogo.",
  createdAt: "2026-08-17T00:00:00.000Z",
  videoLink: "https://example.com/video",
  fileLink: "https://example.com/material",
  duration: "3 módulos",
  price: 49990,
};

describe("CourseCatalog", () => {
  it("shows the available courses with their price in CLP", () => {
    render(<CourseCatalog courses={[course]} />);

    expect(
      screen.getByRole("heading", { name: course.title }),
    ).toBeVisible();
    expect(screen.getByText("$49.990")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: `Pagar ${course.title} con Webpay`,
      }),
    ).toBeVisible();
  });

  it("shows an empty state when no courses are available", () => {
    render(<CourseCatalog courses={[]} />);

    expect(
      screen.getByRole("heading", {
        name: "No hay cursos disponibles por ahora",
      }),
    ).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("activates the Webpay mock with the keyboard without navigating", async () => {
    const user = userEvent.setup();
    render(<CourseCatalog courses={[course]} />);

    await user.tab();
    expect(
      screen.getByRole("button", {
        name: `Pagar ${course.title} con Webpay`,
      }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Demostración de Webpay",
    );
    expect(screen.getByRole("status")).toHaveTextContent(course.title);
    expect(screen.getByRole("status")).toHaveTextContent(
      "no inicia una compra ni te redirige",
    );
  });
});
