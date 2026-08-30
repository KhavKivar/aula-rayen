import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { CourseFormDialog } from "@/features/course-management/components/course-form-dialog";
import { render } from "@/testing/test-utils";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validate = (data: unknown) => data;
    const builder = {
      validator: (schema: { parse: (data: unknown) => unknown }) => {
        validate = (data) => schema.parse(data);
        return builder;
      },
      handler:
        (handler: (context: { data: unknown }) => unknown) =>
        ({ data }: { data?: unknown } = {}) =>
          handler({ data: validate(data) }),
    };
    return builder;
  },
}));

const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/features/course-management/api/create-course", () => ({
  createCourse: (...args: unknown[]) => mockCreate(...args),
}));
vi.mock("@/features/course-management/api/update-course", () => ({
  updateCourse: (...args: unknown[]) => mockUpdate(...args),
}));

describe("CourseFormDialog", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockUpdate.mockReset();
  });

  it("validates required fields on create", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue({});

    render(
      <CourseFormDialog open={true} mode="create" onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(screen.getAllByText(/1 character|URL|Expected/i).length).toBeGreaterThan(0);
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("calls create with valid data", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue({});

    render(
      <CourseFormDialog open={true} mode="create" onOpenChange={vi.fn()} />,
    );

    await user.type(screen.getByLabelText("Título"), "Nuevo curso");
    await user.type(screen.getByLabelText("Descripción"), "Descripción");
    await user.type(screen.getByLabelText("Link del video"), "https://example.com/video");
    await user.type(screen.getByLabelText("Link del material"), "https://example.com/file");
    await user.type(screen.getByLabelText("Duración"), "2 horas");
    await user.clear(screen.getByLabelText("Precio (CLP)"));
    await user.type(screen.getByLabelText("Precio (CLP)"), "25000");

    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
  });

  it("shows error when edit has no changes", async () => {
    const user = userEvent.setup();
    const course = {
      id: 1,
      title: "Curso demo",
      description: "Desc",
      duration: "2 horas",
      price: 25000,
      createdAt: "2026-08-17T00:00:00.000Z",
      hasAccess: true,
      videoLink: "https://example.com/video",
      fileLink: "https://example.com/file",
    };

    render(
      <CourseFormDialog
        open={true}
        mode="edit"
        course={course as never}
        onOpenChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Debes enviar al menos un campo",
      ),
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
