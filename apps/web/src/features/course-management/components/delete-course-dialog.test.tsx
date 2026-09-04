import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteCourseDialog } from "@/features/course-management/components/delete-course-dialog";
import { render } from "@/testing/test-utils";

const course = {
  id: 1,
  title: "Curso demo",
  description: "Desc",
  duration: "2 horas",
  price: 25000,
  createdAt: "2026-08-17T00:00:00.000Z",
  hasAccess: true,
};

const mockDelete = vi.fn().mockResolvedValue({});

vi.mock("@/features/course-management/api/delete-course", () => ({
  deleteCourse: (...args: unknown[]) => mockDelete(...args),
}));

vi.spyOn(axios, "isAxiosError").mockImplementation((payload: unknown) =>
  Boolean((payload as { isAxiosError?: boolean } | null)?.isAxiosError),
);

describe("DeleteCourseDialog", () => {
  beforeEach(() => {
    mockDelete.mockReset();
    mockDelete.mockResolvedValue({});
  });

  it("does not call delete when cancelled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DeleteCourseDialog open={true} course={course as never} onOpenChange={onOpenChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("calls delete when confirmed", async () => {
    const user = userEvent.setup();
    mockDelete.mockResolvedValue({});
    render(
      <DeleteCourseDialog open={true} course={course as never} onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    await waitFor(() => expect(mockDelete).toHaveBeenCalled());
    expect(mockDelete.mock.calls[0][0]).toEqual({ id: 1 });
  });

  it("stays open on error and shows message", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValue(new Error("No se pudo eliminar el curso"));
    render(
      <DeleteCourseDialog open={true} course={course as never} onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByRole("alert")).toBeVisible();
    expect(screen.getByRole("dialog", { name: "¿Eliminar curso?" })).toBeVisible();
  });

  it("shows the backend message on conflict instead of the axios text", async () => {
    const user = userEvent.setup();
    const conflict = Object.assign(
      new Error("Request failed with status code 409"),
      {
        isAxiosError: true,
        response: {
          status: 409,
          data: {
            statusCode: 409,
            message: "No se puede eliminar un curso que ya tiene compras",
            error: "Conflict",
          },
        },
      },
    );
    mockDelete.mockRejectedValue(conflict);
    render(
      <DeleteCourseDialog open={true} course={course as never} onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "No se puede eliminar un curso que ya tiene compras",
    );
    expect(alert).not.toHaveTextContent("Request failed");
  });
});
