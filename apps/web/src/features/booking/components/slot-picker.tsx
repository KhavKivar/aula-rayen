import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";
import { CalendarIcon } from "lucide-react";

import { AvailabilityCalendar } from "@/features/booking/components/availability-calendar";
import {
  slotsForLocalDay,
  toLocalIsoDate,
} from "@/features/booking/api/mock-slots";

export function SlotPicker({
  slots,
  selectedDate,
  selectedSlotId,
  onDateChange,
  onSlotSelect,
}: {
  slots: AvailabilitySlotResponse[];
  selectedDate: string;
  selectedSlotId: number | null;
  onDateChange: (isoDate: string) => void;
  onSlotSelect: (slot: AvailabilitySlotResponse) => void;
}) {
  const availableDays = new Set(
    slots
      .filter((slot) => slot.status === "available")
      .map((slot) => toLocalIsoDate(new Date(slot.startTime))),
  );

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-heading text-2xl tracking-tight">
        <CalendarIcon size={20} aria-hidden="true" className="text-sage" />
        Elige fecha y horario
      </h2>
      {availableDays.size === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No hay horarios disponibles. Vuelve a intentarlo más tarde.
        </p>
      ) : (
        <div className="mt-6">
          <AvailabilityCalendar
            slots={slots}
            selectedDate={selectedDate}
            selectedSlotId={selectedSlotId}
            onDateChange={onDateChange}
            onSlotSelect={onSlotSelect}
          />
        </div>
      )}
    </div>
  );
}

export function firstAvailableIsoDate(
  slots: AvailabilitySlotResponse[],
  reference: Date = new Date(),
): string {
  if (
    slotsForLocalDay(slots, toLocalIsoDate(reference)).some(
      (s) => s.status === "available",
    )
  ) {
    return toLocalIsoDate(reference);
  }
  const next = slots
    .filter((s) => s.status === "available")
    .map((s) => toLocalIsoDate(new Date(s.startTime)))
    .sort()[0];
  return next ?? toLocalIsoDate(reference);
}
