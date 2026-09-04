import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PaymentsPanel } from "@/features/admin-dashboard/components/payments-panel";
import { render } from "@/testing/test-utils";

describe("PaymentsPanel", () => {
  it("calculates metrics from combined filters and can clear an empty result", async () => {
    const user = userEvent.setup();
    render(<PaymentsPanel />);

    expect(screen.getByText("$119.000")).toBeVisible();
    await user.type(screen.getByRole("textbox", { name: "Buscar por comprador u orden" }), "camila");
    await user.selectOptions(screen.getByRole("combobox", { name: "Filtrar por estado" }), "approved");
    expect((await screen.findAllByText("$42.000"))[0]).toBeVisible();
    expect(screen.getAllByText("AR-1048")[0]).toBeVisible();

    await user.clear(screen.getByRole("textbox", { name: "Buscar por comprador u orden" }));
    await user.type(screen.getByRole("textbox", { name: "Buscar por comprador u orden" }), "sin-coincidencias");
    expect(await screen.findByText("Sin resultados de pago")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect((await screen.findAllByText("AR-1048"))[0]).toBeVisible();
  });

  it("opens complete payment detail with demo labeling", async () => {
    const user = userEvent.setup();
    render(<PaymentsPanel />);

    await user.click(screen.getAllByRole("button", { name: "Ver detalle" })[0]);
    const dialog = await screen.findByRole("dialog", { name: "Detalle de transacción" });
    expect(dialog).toHaveTextContent("•••• 8034");
    expect(dialog).toHaveTextContent("872193");
    expect(dialog).toHaveTextContent("Datos de demostración");
  });
});
