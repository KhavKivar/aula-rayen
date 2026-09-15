import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AvailabilitySlotResponse,
  CreateAvailabilitySlotRequest,
} from "@aula-rayen/contracts/availability";
import { ReservationsPanel } from "@/features/admin-reservations/components/reservations-panel";
import { createTestQueryClient, render } from "@/testing/test-utils";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() {
      super("Sesión expirada");
      this.name = "SessionExpiredError";
    }
  },
}));

vi.mock("@/lib/session-queries", () => ({
  sessionQueries: {
    session: {
      queryKey: ["session"],
      queryFn: () =>
        Promise.resolve({
          user: { id: "admin-1" },
          session: { id: "session-1" },
        }),
    },
  },
}));

import { apiClient } from "@/lib/api-client";

const storedSlots: AvailabilitySlotResponse[] = [];
let nextSlotId = 1;

function mockBackend() {
  vi.mocked(apiClient.get).mockImplementation(async (url: string) => {
    if (url === "/availability-slots") return { data: [...storedSlots] };
    throw new Error(`unexpected GET ${url}`);
  });
  vi.mocked(apiClient.post).mockImplementation(
    async (url: string, payload?: unknown) => {
      if (url !== "/availability-slots/batch" || !Array.isArray(payload)) {
        throw new Error(`unexpected POST ${url}`);
      }
      const created = (payload as CreateAvailabilitySlotRequest[]).map(
        (body) => {
          const slot: AvailabilitySlotResponse = {
            id: nextSlotId++,
            createdBy: "admin-1",
            createdAt: "2026-09-01T00:00:00.000Z",
            status: "available",
            ...body,
          };
          storedSlots.push(slot);
          return slot;
        },
      );
      return { data: created };
    },
  );
  vi.mocked(apiClient.delete).mockImplementation(async (url: string) => {
    const id = Number(String(url).split("/").pop());
    const index = storedSlots.findIndex((slot) => slot.id === id);
    if (index === -1) throw new Error(`slot ${id} not found`);
    const [removed] = storedSlots.splice(index, 1);
    return { data: removed };
  });
}

describe("ReservationsPanel", () => {
  beforeEach(() => {
    storedSlots.length = 0;
    nextSlotId = 1;
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.delete).mockReset();
    mockBackend();
  });

  it("previews a daily range before saving all generated slots", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    await user.click(screen.getByRole("button", { name: "Mar" }));
    await user.click(
      screen.getByRole("button", { name: "Generar vista previa" }),
    );

    expect(screen.getByText(/Se crearán 33 bloques/)).toBeVisible();
    expect(screen.getAllByText("09:00 a 10:00")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Guardar todos" }));

    expect(
      screen.queryByText(/Se crearán 33 bloques/),
    ).not.toBeInTheDocument();
    const deleteButtons = await screen.findAllByRole("button", {
      name: /Eliminar .+ de 09:00 a 10:00/,
    });
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/availability-slots/batch",
      expect.arrayContaining([
        expect.objectContaining({ assignedTo: "admin-1" }),
      ]),
    );
    await user.click(deleteButtons[0]);
    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: /Eliminar .+ de 09:00 a 10:00/ }),
      ).toHaveLength(2);
    });
  });

  it("adds one schedule from the separate dialog", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    await user.click(
      screen.getByRole("button", { name: "Agregar un horario" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Agregar un horario" });
    await user.selectOptions(within(dialog).getByLabelText("Duración"), "2");
    await user.click(
      within(dialog).getByRole("button", { name: "Agregar horario" }),
    );

    expect(
      await screen.findByRole("button", {
        name: "Eliminar Lun de 09:00 a 11:00",
      }),
    ).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("blocks saving a schedule that overlaps an existing slot", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    await user.click(
      screen.getByRole("button", { name: "Agregar horario el Lun 7" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Agregar un horario" });
    await user.click(
      within(dialog).getByRole("button", { name: "Agregar horario" }),
    );
    await screen.findByRole("button", {
      name: "Eliminar Lun de 09:00 a 10:00",
    });

    await user.click(
      screen.getByRole("button", { name: "Agregar horario el Lun 7" }),
    );
    const overlapDialog = screen.getByRole("dialog", {
      name: "Agregar un horario",
    });
    await user.type(
      within(overlapDialog).getByLabelText("Hora de inicio"),
      "09:30",
    );
    await user.click(
      within(overlapDialog).getByRole("button", { name: "Agregar horario" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/se superpone/);
    expect(
      screen.getByRole("dialog", { name: "Agregar un horario" }),
    ).toBeVisible();
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("confirms before deleting the saved schedules of a visible date", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    await user.click(
      screen.getByRole("button", { name: "Agregar un horario" }),
    );
    await user.click(
      within(screen.getByRole("dialog", { name: "Agregar un horario" })).getByRole(
        "button",
        { name: "Agregar horario" },
      ),
    );
    const deleteDayButton = await screen.findByRole("button", {
      name: "Eliminar todos los horarios del 7 de septiembre",
    });
    await user.click(deleteDayButton);

    const confirmation = screen.getByRole("dialog", {
      name: "¿Eliminar horarios del 7 de septiembre?",
    });
    expect(confirmation).toBeVisible();
    await user.click(
      within(confirmation).getByRole("button", { name: "Sí, eliminar" }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("button", {
          name: "Eliminar todos los horarios del 7 de septiembre",
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("updates an active preview when the duration changes", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    await user.click(
      screen.getByRole("button", { name: "Generar vista previa" }),
    );
    expect(screen.getByText(/Se crearán 22 bloques/)).toBeVisible();

    await user.selectOptions(screen.getByLabelText("Duración"), "2");

    expect(screen.getByText(/Se crearán 10 bloques/)).toBeVisible();
    expect(screen.getByText("09:00 a 11:00")).toBeVisible();
    expect(screen.queryByText("09:00 a 10:00")).not.toBeInTheDocument();
  });

  it("renders the monthly calendar and adds a schedule from a clicked day", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    expect(
      screen.getByRole("heading", { name: "Septiembre 2026" }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Agregar horario el Mié 9" }));
    const dialog = screen.getByRole("dialog", { name: "Agregar un horario" });
    expect(
      within(dialog).getByLabelText("Fecha: 9 de septiembre"),
    ).toBeVisible();
    await user.click(
      within(dialog).getByRole("button", { name: "Agregar horario" }),
    );
    expect(
      await screen.findByRole("button", {
        name: "Eliminar Mié de 09:00 a 10:00",
      }),
    ).toBeVisible();
  });

  it("deletes every schedule of a date from the calendar", async () => {
    const user = userEvent.setup();
    render(<ReservationsPanel />, { queryClient: createTestQueryClient() });

    for (const time of ["09:00", "11:00"]) {
      await user.click(
        screen.getByRole("button", { name: "Agregar horario el Mié 9" }),
      );
      const dialog = screen.getByRole("dialog", { name: "Agregar un horario" });
      await user.clear(within(dialog).getByLabelText("Hora de inicio"));
      await user.type(within(dialog).getByLabelText("Hora de inicio"), time);
      await user.click(
        within(dialog).getByRole("button", { name: "Agregar horario" }),
      );
    }

    await user.click(
      await screen.findByRole("button", {
        name: "Eliminar todos los horarios del 9 de septiembre",
      }),
    );
    const confirmation = await screen.findByRole("dialog", {
      name: "¿Eliminar horarios del 9 de septiembre?",
    });
    await user.click(
      within(confirmation).getByRole("button", { name: "Sí, eliminar" }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("button", {
          name: "Eliminar todos los horarios del 9 de septiembre",
        }),
      ).not.toBeInTheDocument();
    });
  });
});
