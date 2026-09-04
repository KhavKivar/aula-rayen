import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PurchasersDialog } from "@/features/admin-dashboard/components/purchasers-dialog";
import { render } from "@/testing/test-utils";

vi.mock("@/features/admin-dashboard/api/get-course-buyers", () => ({
  getCourseBuyers: vi.fn(async (courseId: number) =>
    courseId === 1
      ? [
          {
            id: "30bde5f7-7f69-44d9-94b8-bdb75923c91e",
            name: "Camila Rojas",
            email: "camila@example.com",
            purchasedAt: "2026-09-03T13:20:00.000Z",
          },
          {
            id: "72f2bff0-c5d5-4d09-8bf1-c6d2e6463d95",
            name: "Valentina Soto",
            email: "vale@example.com",
            purchasedAt: "2026-08-28T10:05:00.000Z",
          },
        ]
      : [],
  ),
}));

describe("PurchasersDialog", () => {
  it("shows and searches approved purchasers for a course", async () => {
    const user = userEvent.setup();
    render(
      <PurchasersDialog
        course={{ id: 1, title: "Curso demo" }}
        isOpen
        onOpenChange={vi.fn()}
      />,
    );

    expect((await screen.findAllByText("Camila Rojas"))[0]).toBeVisible();
    expect(screen.getAllByText("Valentina Soto")[0]).toBeVisible();
    await user.type(
      screen.getByRole("textbox", { name: "Buscar comprador" }),
      "camila",
    );
    expect(screen.getAllByText("Camila Rojas")[0]).toBeVisible();
    expect(screen.queryByText("Valentina Soto")).not.toBeInTheDocument();
  });

  it("shows the course-specific empty state", async () => {
    render(
      <PurchasersDialog
        course={{ id: 999, title: "Curso sin ventas" }}
        isOpen
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      await screen.findByText("Este curso aún no registra compras"),
    ).toBeVisible();
  });
});
