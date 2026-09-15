import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  minutesToTime,
  mondayBasedWeekday,
  previewDateFormatter,
  scheduleRange,
  timeToMinutes,
  toLocalIsoDate,
  toIsoDate,
  weekDays,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";
import { cn } from "@/lib/utils";

interface ReservationsCalendarProps {
  schedules?: FixedSchedule[];
  onAddForDate?: (date: string, day: WeekDay) => void;
  onDelete?: (id: number) => void;
  onDeleteDate?: (date: string) => void;
}

const monthFormatter = new Intl.DateTimeFormat("es-CL", {
  month: "long",
  timeZone: "UTC",
});

const today = new Date();

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Vista mensual de la disponibilidad guardada. Cada día muestra sus
 * bloques y permite agregar un horario nuevo en esa fecha.
 */
export function ReservationsCalendar({
  schedules = [],
  onAddForDate,
  onDelete,
  onDeleteDate,
}: ReservationsCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [deleteDate, setDeleteDate] = useState<string | null>(null);
  const reference = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1,
    ),
  );
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = mondayBasedWeekday(toIsoDate(reference));
  const cells = daysInMonth + firstWeekday;
  const monthLabel = `${capitalize(monthFormatter.format(reference))} ${year}`;
  const todayIso = toLocalIsoDate(today);

  return (
    <section
      className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-7"
      aria-labelledby="calendar-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker">Vista mensual</p>
          <h2 id="calendar-title" className="mt-2 font-heading text-3xl">
            {monthLabel}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Mes anterior"
            onClick={() => setMonthOffset((current) => current - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthOffset(0)}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Mes siguiente"
            onClick={() => setMonthOffset((current) => current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="mt-7 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day) => (
              <div
                key={day}
                className="px-2 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: Math.ceil(cells / 7) * 7 }, (_, index) => {
              const dayNumber = index - firstWeekday + 1;
              const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
              const isoDate = toIsoDate(
                new Date(Date.UTC(year, month, dayNumber)),
              );
              const weekday = weekDays[mondayBasedWeekday(isoDate)] ?? "Lun";
              const daySchedules = inMonth
                ? schedules.filter(
                    (schedule) =>
                      schedule.days.includes(weekday) &&
                      isoDate >= schedule.validFrom &&
                      isoDate <= schedule.validUntil,
                  )
                : [];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex min-h-28 flex-col border-b border-r border-border p-2",
                    index % 7 === 0 && "border-l",
                    !inMonth && "bg-muted/40",
                  )}
                >
                  {inMonth ? (
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        aria-label={`Agregar horario el ${weekday} ${dayNumber}`}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-xs outline-none transition hover:bg-sage focus-visible:ring-2 focus-visible:ring-ring",
                          isoDate === todayIso &&
                            "bg-sage/40 font-semibold ring-1 ring-ring",
                        )}
                        onClick={() => onAddForDate?.(isoDate, weekday)}
                      >
                        {dayNumber}
                      </button>
                      {daySchedules.length > 0 && onDeleteDate ? (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Eliminar todos los horarios del ${previewDateFormatter.format(new Date(`${isoDate}T00:00:00Z`))}`}
                          onClick={() => setDeleteDate(isoDate)}
                        >
                          <Trash2 />
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <span className="invisible block size-7 text-xs">
                      {dayNumber}
                    </span>
                  )}
                  <div className="mt-1 flex-1 space-y-1">
                    {daySchedules.map((schedule, slotIndex) => (
                      <div
                        key={`${schedule.id}-${slotIndex}`}
                        className="flex items-center gap-1 rounded-lg bg-sage px-2 py-1.5 text-[.68rem] leading-tight"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">
                            {schedule.startTime} -{" "}
                            {minutesToTime(
                              timeToMinutes(schedule.startTime) +
                                schedule.duration * 60,
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-muted-foreground">
                            {schedule.duration}{" "}
                            {schedule.duration === 1 ? "hora" : "horas"}
                          </p>
                        </div>
                        {onDelete ? (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Eliminar ${weekday} de ${scheduleRange(schedule)}`}
                            onClick={() => onDelete(schedule.id)}
                          >
                            <Trash2 />
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-sage ring-1 ring-primary/20" />{" "}
          Horario disponible
        </span>
        {onAddForDate ? (
          <span className="flex items-center gap-2">Haz clic en un día para agregar un horario.</span>
        ) : null}
      </div>
      <ConfirmDialog
        open={deleteDate !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteDate(null);
        }}
        title={`¿Eliminar horarios del ${deleteDate ? previewDateFormatter.format(new Date(`${deleteDate}T00:00:00Z`)) : ""}?`}
        description="Se quitarán todos los bloques de esta fecha. Los bloques de otras fechas no se verán afectados."
        confirmLabel="Sí, eliminar"
        destructive
        onConfirm={() => {
          if (deleteDate) onDeleteDate?.(deleteDate);
          setDeleteDate(null);
        }}
      />
    </section>
  );
}
