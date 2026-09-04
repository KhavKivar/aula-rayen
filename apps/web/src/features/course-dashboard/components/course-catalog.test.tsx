import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

type TestLinkProps = ComponentProps<"a"> & {
  to: string;
  params?: { courseId?: string };
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params, ...props }: TestLinkProps) => (
    <a href={to.replace("$courseId", params?.courseId ?? "")} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/course-dashboard/api/create-webpay", () => ({
  createWebPay: vi.fn().mockResolvedValue({
    token: "webpay-token",
    url: "https://webpay.example.com",
  }),
}));

import { CourseCatalog } from "@/features/course-dashboard/components/course-catalog";
import { createWebPay } from "@/features/course-dashboard/api/create-webpay";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import { render } from "@/testing/test-utils";

const course: CourseCatalogItem = {
  id: 1,
  title: "Curso de demostración",
  description: "Una descripción breve para probar el catálogo.",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "3 módulos",
  price: 49990,
  hasAccess: false,
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

  it("submits the Webpay form for a course without access", async () => {
    const user = userEvent.setup();
    const submit = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => undefined);
    render(<CourseCatalog courses={[course]} />);

    await user.tab();
    expect(
      screen.getByRole("button", {
        name: `Pagar ${course.title} con Webpay`,
      }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(submit).toHaveBeenCalled());
    submit.mockRestore();
  });

  it("shows the backend message when Webpay checkout fails", async () => {
    const user = userEvent.setup();
    vi.mocked(createWebPay).mockRejectedValueOnce(
      Object.assign(new Error("Request failed with status code 409"), {
        isAxiosError: true,
        response: {
          status: 409,
          data: {
            statusCode: 409,
            message: "El curso ya fue comprado.",
            error: "Conflict",
          },
        },
      }),
    );
    render(<CourseCatalog courses={[course]} />);

    await user.click(
      screen.getByRole("button", {
        name: `Pagar ${course.title} con Webpay`,
      }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("El curso ya fue comprado.");
    expect(alert).not.toHaveTextContent("Request failed");
  });

  it("shows the course link instead of Webpay when the user has access", () => {
    render(<CourseCatalog courses={[{ ...course, hasAccess: true }]} />);

    expect(
      screen.getByRole("link", { name: `Ver ${course.title}` }),
    ).toHaveAttribute("href", `/courses/${course.id}`);
    expect(
      screen.queryByRole("button", {
        name: `Pagar ${course.title} con Webpay`,
      }),
    ).not.toBeInTheDocument();
  });
});
