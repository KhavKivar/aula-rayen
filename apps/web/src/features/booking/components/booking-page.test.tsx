import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { toLocalIsoDate } from "@/features/booking/api/mock-slots";
import { BookingPage } from "@/features/booking/components/booking-page";
import { SlotPicker } from "@/features/booking/components/slot-picker";
import { render, renderWithRouter } from "@/testing/test-utils";

let nextId = 1;

function daySlot(day: Date, hour: number, status?: "available" | "disabled") {
  const start = new Date(day);
  start.setHours(hour, 0, 0, 0);
  const end = new Date(start);
  end.setHours(hour + 1, 0, 0, 0);
  return {
    id: nextId++,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    assignedTo: "pamela-rayen",
    createdBy: "pamela-rayen",
    createdAt: day.toISOString(),
    status: status ?? "available",
  } satisfies AvailabilitySlotResponse;
}

import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";

describe("booking page (UI mock)", () => {
  it("sin selección muestra el calendario y la cita por confirmar", async () => {
    await renderWithRouter(<BookingPage />);

    expect(screen.getByText(/elige fecha y horario/i)).toBeInTheDocument();
    expect(screen.getByText(/por confirmar/i)).toBeInTheDocument();
    expect(screen.queryByText(/datos relativos a la cita/i)).not.toBeInTheDocument();
  });

  it("con selección muestra los datos de la cita y Continuar deshabilitado", async () => {
    const user = userEvent.setup();
    const { container } = await renderWithRouter(<BookingPage />);

    const timeButton = within(container)
      .getAllByRole("button")
      .find((button) => /10:\d{2}$/u.test(button.textContent ?? ""));
    expect(timeButton).toBeDefined();
    await user.click(timeButton!);

    expect(screen.getByText(/datos relativos a la cita/i)).toBeInTheDocument();
    expect(screen.getByText(/motivo de la visita/i)).toBeInTheDocument();
    const payButton = screen.getByRole("button", { name: /pagar con webpay/i });
    expect(payButton).toBeDisabled();
    expect(screen.getByText(/cambiar la fecha/i)).toBeInTheDocument();
  });

  it("cambiar la fecha vuelve al calendario", async () => {
    const user = userEvent.setup();
    const { container } = await renderWithRouter(<BookingPage />);
    const timeButton = within(container)
      .getAllByRole("button")
      .find((button) => /10:\d{2}$/u.test(button.textContent ?? ""));
    await user.click(timeButton!);
    await user.click(screen.getByText(/cambiar la fecha/i));

    expect(screen.queryByText(/datos relativos a la cita/i)).not.toBeInTheDocument();
    expect(screen.getByText(/elige fecha y horario/i)).toBeInTheDocument();
  });

  it("muestra estado vacío en una fecha sin disponibilidad", () => {
    const emptyDay = new Date();
    emptyDay.setDate(emptyDay.getDate() + 2);

    render(
      <SlotPicker
        slots={[daySlot(emptyDay, 10, "disabled")]}
        selectedDate={toLocalIsoDate(emptyDay)}
        selectedSlotId={null}
        onDateChange={vi.fn()}
        onSlotSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/no hay horarios disponibles/i),
    ).toBeInTheDocument();
  });

  it("arranca en la primera fecha con disponibilidad", async () => {
    const { container } = await renderWithRouter(<BookingPage />);

    expect(container).toHaveTextContent(/10:/);
  });
});
