import { CalendarDays, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  previewDateFormatter,
  previewWeekDates,
  scheduleRange,
  toIsoDate,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";

type DeleteTarget = { day: WeekDay; isoDate: string };

type WeekAvailabilityGridProps = {
  schedules: FixedSchedule[];
  onDelete: (id: number) => void;
  onDeleteDate: (date: string) => void;
};

function DayScheduleCard({
  schedule,
  day,
  onDelete,
}: {
  schedule: FixedSchedule;
  day: WeekDay;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap text-xs font-semibold">
          {scheduleRange(schedule)}
        </p>
        <p className="text-[.65rem] text-muted-foreground">
          {schedule.duration} {schedule.duration === 1 ? "hora" : "horas"}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Eliminar ${day} de ${scheduleRange(schedule)}`}
        onClick={() => onDelete(schedule.id)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

/**
 * Calendario semanal que muestra los bloques guardados para cada día
 * de la semana navegable, con acciones de borrado individual y por día.
 */
export function WeekAvailabilityGrid({
  schedules,
  onDelete,
  onDeleteDate,
}: WeekAvailabilityGridProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const datedWeek = previewWeekDates(weekOffset);
  const weekLabel = `${previewDateFormatter.format(datedWeek[0].date)} – ${previewDateFormatter.format(datedWeek[6].date)}`;

  return (
    <>
      <div className="mt-7 border-t border-border pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-terracotta" size={20} />
            <div>
              <h3 className="font-heading text-xl">Previsualizar reservas</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Así se verá tu disponibilidad semanal para reservar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Semana anterior"
              onClick={() => setWeekOffset((current) => current - 1)}
            >
              <ChevronLeft />
            </Button>
            <p
              className="min-w-48 text-center text-xs font-semibold capitalize"
              aria-live="polite"
            >
              {weekLabel}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Semana siguiente"
              onClick={() => setWeekOffset((current) => current + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {datedWeek.map(({ day, date }) => {
            const isoDate = toIsoDate(date);
            const daySchedules = schedules.filter(
              (schedule) =>
                schedule.days.includes(day) &&
                isoDate >= schedule.validFrom &&
                isoDate <= schedule.validUntil,
            );
            return (
              <section
                key={isoDate}
                className="flex min-h-32 flex-col rounded-2xl border border-border bg-background p-4"
                aria-label={`Disponibilidad del ${day} ${date.getUTCDate()}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-[.12em] text-terracotta">
                    {day} {date.getUTCDate()}
                  </h4>
                  <span className="text-[.65rem] text-muted-foreground">
                    {daySchedules.length} bloques
                  </span>
                </div>
                <div className="mt-3 flex-1 space-y-2">
                  {daySchedules.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      Sin horarios
                    </p>
                  ) : (
                    daySchedules.map((schedule) => (
                      <DayScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        day={day}
                        onDelete={onDelete}
                      />
                    ))
                  )}
                </div>
                {daySchedules.length > 0 ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setDeleteTarget({ day, isoDate })}
                  >
                    <Trash2 /> Eliminar todos
                  </Button>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`¿Eliminar horarios del ${deleteTarget ? previewDateFormatter.format(new Date(`${deleteTarget.isoDate}T00:00:00Z`)) : ""}?`}
        description="Se quitarán los bloques de esta fecha. Los bloques de otras semanas no se verán afectados."
        confirmLabel="Sí, eliminar"
        destructive
        onConfirm={() => {
          if (deleteTarget) onDeleteDate(deleteTarget.isoDate);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
