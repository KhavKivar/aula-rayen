import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CourseCatalog } from "@/features/course-dashboard/components/course-catalog";
import type { DemoCourse } from "@/features/course-dashboard/types/demo-course";
import { render } from "@/testing/test-utils";

const course: DemoCourse = {
  id: "curso-demo",
  title: "Curso de demostración",
  description: "Una descripción breve para probar el catálogo.",
  category: "Arteterapia",
  duration: "3 módulos",
  priceClp: 49990,
  accent: "terracotta",
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
