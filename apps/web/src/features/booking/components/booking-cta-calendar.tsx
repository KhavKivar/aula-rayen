import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { buildMockAvailabilitySlots, toLocalIsoDate } from "@/features/booking/api/mock-slots";
import { AvailabilityCalendar } from "@/features/booking/components/availability-calendar";

/**
 * Vista compacta del calendario de disponibilidad para la CTA de landing.
 * Al elegir un horario navega a /reservar preseleccionando el slot.
 */
export function BookingCtaCalendar({
  slots: slotsProp,
}: {
  slots?: AvailabilitySlotResponse[];
}) {
  const navigate = useNavigate();
  const slots = slotsProp ?? buildMockAvailabilitySlots();
  const [selectedDate, setSelectedDate] = useState(() =>
    toLocalIsoDate(new Date()),
  );
  const [selectedSlot, setSelectedSlot] =
    useState<AvailabilitySlotResponse | null>(null);

  return (
    <div className="rounded-3xl bg-card p-5 text-foreground sm:p-6">
      <p className="font-heading text-xl">Agenda tu primera hora</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Elige día y horario y continúa con tu reserva.
      </p>
      <div className="mt-4">
        <AvailabilityCalendar
          compact
          slots={slots}
          selectedDate={selectedDate}
          selectedSlotId={selectedSlot?.id ?? null}
          onDateChange={setSelectedDate}
          onSlotSelect={setSelectedSlot}
        />
      </div>
      <button
        type="button"
        disabled={!selectedSlot}
        onClick={() => {
          if (!selectedSlot) return;
          navigate({
            to: "/reservar",
            search: {
              date: toLocalIsoDate(new Date(selectedSlot.startTime)),
              slot: selectedSlot.id,
            },
          });
        }}
        className={
          "mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition " +
          (selectedSlot
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "cursor-not-allowed bg-muted text-muted-foreground")
        }
      >
        {selectedSlot ? "Reservar" : "Selecciona un horario"}
      </button>
    </div>
  );
}
