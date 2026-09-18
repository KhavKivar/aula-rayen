import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Brand } from "@/components/brand";
import { BookingAppointmentForm } from "@/features/booking/components/booking-appointment-form";
import { BookingCitationCard } from "@/features/booking/components/booking-summary";
import {
  SlotPicker,
  firstAvailableIsoDate,
} from "@/features/booking/components/slot-picker";
import {
  buildMockAvailabilitySlots,
  toLocalIsoDate,
} from "@/features/booking/api/mock-slots";

/**
 * Selección de la agenda. En modo URL (la ruta pasa `selectedDate`/
 * `selectedSlotId`) los cambios se reportan vía `onSelectionChange` y
 * viven en los search params; sin callback, la selección es estado local.
 */
export function BookingPage({
  slots,
  selectedDate,
  selectedSlotId,
  onSelectionChange,
}: {
  slots?: AvailabilitySlotResponse[];
  selectedDate?: string;
  selectedSlotId?: number;
  onSelectionChange?: (selection: {
    date: string;
    slot: number | null;
  }) => void;
}) {
  const mockSlots = slots ?? buildMockAvailabilitySlots();

  const [localSelection, setLocalSelection] = useState<{
    date: string;
    slot: number | null;
  }>(() => ({ date: firstAvailableIsoDate(mockSlots), slot: null }));

  const selectedDateIso = selectedDate ?? localSelection.date;
  const activeSlotId = selectedSlotId ?? localSelection.slot;

  const selectedSlot = (() => {
    if (!activeSlotId) return null;
    return mockSlots.find(
      (candidate) =>
        candidate.id === activeSlotId && candidate.status === "available",
    ) ?? null;
  })();

  const commit = (date: string, slotId: number | null) => {
    if (onSelectionChange) {
      onSelectionChange({ date, slot: slotId });
    } else {
      setLocalSelection({ date, slot: slotId });
    }
  };

  const openCalendar = () => commit(selectedDateIso, null);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <header className="relative border-b border-border/70 bg-white">
        <div className="page-container relative flex min-h-24 items-center justify-center">
          <Link to="/" aria-label="Psicóloga Rayen, inicio" className="w-fit">
            <Brand />
          </Link>
          <Link
            to="/"
            aria-label="Volver al inicio"
            className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white transition hover:bg-secondary sm:left-10 lg:left-16"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
      </header>
      <div className="page-container py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_384px] lg:items-start">
        <div>
          {selectedSlot ? (
            <BookingAppointmentForm onClearSlot={openCalendar} />
          ) : (
            <SlotPicker
              slots={mockSlots}
              selectedDate={selectedDateIso}
              selectedSlotId={null}
              onDateChange={(iso) => commit(iso, null)}
              onSlotSelect={(slot) =>
                commit(toLocalIsoDate(new Date(slot.startTime)), slot.id)
              }
            />
          )}
        </div>
        <BookingCitationCard
          selectedSlot={selectedSlot}
          onOpenCalendar={openCalendar}
        />
      </div>
      </div>
    </main>
  );
}
