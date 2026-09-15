import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  countGeneratedSlots,
  formatGeneratedDates,
  previewDateFormatter,
  scheduleRange,
  totalGeneratedSlots,
  weekDays,
  type FixedSchedule,
} from "@/features/admin-reservations/components/schedule-model";

/**
 * Grilla de bloques generados por el formulario de horarios, agrupados
 * por día, con la acción de guardarlos todos.
 */
export function SchedulePreviewGrid({
  preview,
  onSave,
}: {
  preview: Omit<FixedSchedule, "id">[];
  onSave: (schedules: Omit<FixedSchedule, "id">[]) => void;
}) {
  const perDay = countGeneratedSlots(preview);
  const total = totalGeneratedSlots(preview);
  const validFrom = preview[0]?.validFrom;
  const validUntil = preview[0]?.validUntil;
  const rangeLabel =
    validFrom && validUntil
      ? ` entre el ${previewDateFormatter.format(new Date(`${validFrom}T00:00:00Z`))} y el ${previewDateFormatter.format(new Date(`${validUntil}T00:00:00Z`))}`
      : "";

  return (
    <div className="mt-7 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Vista previa</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Se crearán {total} bloques{rangeLabel}.
          </p>
        </div>
        <Button type="button" onClick={() => onSave(preview)}>
          <Save /> Guardar todos
        </Button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weekDays
          .filter((day) => preview.some((slot) => slot.days[0] === day))
          .map((day) => {
            const daySlots = preview.filter((slot) => slot.days[0] === day);
            return (
              <div
                key={day}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-terracotta">
                    {day}
                  </p>
                  <span className="text-[.65rem] text-muted-foreground">
                    {perDay[day]} bloques
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {daySlots.map((slot) => (
                    <span
                      key={`${day}-${slot.startTime}`}
                      className="rounded-lg bg-sage px-2.5 py-1.5 text-xs font-medium"
                    >
                      {scheduleRange(slot)}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[.65rem] leading-4 text-muted-foreground">
                  {formatGeneratedDates(daySlots[0])}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
