import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaymentsPanel } from "@/features/admin-dashboard/components/payments-panel";
import { demoTransactions } from "@/features/admin-dashboard/api/demo-transactions";
import { createTestQueryClient, render } from "@/testing/test-utils";

const mockGetPayments = vi.fn();
vi.mock("@/features/admin-dashboard/api/get-payments", () => ({
  getPayments: () => mockGetPayments(),
}));

describe("PaymentsPanel", () => {
  beforeEach(() => {
    mockGetPayments.mockReset();
  });

  it("calculates metrics from combined filters and can clear an empty result", async () => {
    const user = userEvent.setup();
    mockGetPayments.mockResolvedValue(demoTransactions);
    render(<PaymentsPanel />);

    expect(await screen.findByText("$119.000")).toBeVisible();
    expect(
      screen.queryByText("Datos de demostración"),
    ).not.toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Buscar por comprador o correo" }), "camila");
    await user.selectOptions(screen.getByRole("combobox", { name: "Filtrar por estado" }), "approved");
    expect((await screen.findAllByText("$42.000"))[0]).toBeVisible();
    expect(screen.getAllByText("Camila Rojas")[0]).toBeVisible();

    await user.clear(screen.getByRole("textbox", { name: "Buscar por comprador o correo" }));
    await user.type(screen.getByRole("textbox", { name: "Buscar por comprador o correo" }), "sin-coincidencias");
    expect(await screen.findByText("Sin resultados de pago")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect((await screen.findAllByText("Camila Rojas"))[0]).toBeVisible();
  });

  it("opens complete payment detail without demo labeling on live data", async () => {
    const user = userEvent.setup();
    mockGetPayments.mockResolvedValue(demoTransactions);
    render(<PaymentsPanel />);

    await user.click((await screen.findAllByRole("button", { name: "Ver detalle" }))[0]);
    const dialog = await screen.findByRole("dialog", { name: "Detalle de transacción" });
    expect(dialog).toHaveTextContent("•••• 8034");
    expect(dialog).toHaveTextContent("872193");
    expect(dialog).toHaveTextContent("Información registrada del pago.");
    expect(dialog).not.toHaveTextContent("Datos de demostración");
  });

  it("falls back to demo fixtures with labeling when the query fails", async () => {
    mockGetPayments.mockRejectedValue(new Error("Sin conexión"));
    render(<PaymentsPanel />);

    expect(await screen.findByText("$119.000")).toBeVisible();
    expect(screen.getAllByText("Datos de demostración").length).toBeGreaterThan(0);
  });

  it("keeps live labeling when a background refetch fails with cached data", async () => {
    const live = [{ ...demoTransactions[0], orderId: "AR-REAL" }];
    mockGetPayments.mockResolvedValueOnce(live).mockRejectedValue(new Error("caída"));
    const queryClient = createTestQueryClient();
    render(<PaymentsPanel />, { queryClient });

    expect((await screen.findAllByText("Camila Rojas"))[0]).toBeVisible();
    expect(screen.queryByText("Datos de demostración")).not.toBeInTheDocument();

    await act(async () => {
      await queryClient.invalidateQueries({ queryKey: ["payments"] });
    });

    expect(screen.getAllByText("Camila Rojas")[0]).toBeVisible();
    expect(screen.queryByText("Datos de demostración")).not.toBeInTheDocument();
  });
});
