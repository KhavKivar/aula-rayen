import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByRole("dialog", { name: "Confirmar eliminación" })).toBeVisible();
  });
});
