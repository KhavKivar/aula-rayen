import { useForm } from "@tanstack/react-form";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/features/admin-reservations/components/date-picker";
import {
  generateSchedules,
  previewDateFormatter,
  previewWeekDates,
  scheduleRange,
  toIsoDate,
  weekDays,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";
import { cn } from "@/lib/utils";

export function ScheduleBuilder({
  schedules,
  onSave,
  onDelete,
  onDeleteDay,
}: {
  schedules: FixedSchedule[];
  onSave: (schedules: Omit<FixedSchedule, "id">[]) => void;
  onDelete: (id: number) => void;
  onDeleteDay: (day: WeekDay) => void;
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [deleteDay, setDeleteDay] = useState<WeekDay | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const datedWeek = previewWeekDates(weekOffset);
  const weekLabel = `${previewDateFormatter.format(datedWeek[0].date)} – ${previewDateFormatter.format(datedWeek[6].date)}`;
  const form = useForm({
    defaultValues: {
      days: ["Lun"] as WeekDay[],
      startTime: "09:00",
      endTime: "20:00",
      duration: "1" as "1" | "2",
      validFrom: "2026-09-07",
      validUntil: "2026-10-31",
    },
    onSubmit: ({ value }) => {
      if (value.days.length === 0) return;
      if (value.validFrom > value.validUntil) {
        setPreviewVisible(false);
        setError("La fecha de término debe ser posterior a la fecha de inicio.");
        return;
      }
      const generated = generateSchedules(value);
      if (generated.length === 0) {
        setPreviewVisible(false);
        setError("La hora de término debe permitir al menos un bloque completo.");
        return;
      }
      setError(null);
      setPreviewVisible(true);
    },
  });

  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
      aria-labelledby="fixed-schedules-title"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sage text-foreground">
          <Clock3 size={20} />
        </span>
        <div>
          <h2 id="fixed-schedules-title" className="font-heading text-2xl">
            Horarios por día
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Elige los días y genera todos los bloques dentro de un rango.
          </p>
        </div>
      </div>
      <form
        className="mt-7 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="days">
          {(field) => (
            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                Días disponibles
              </legend>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {weekDays.map((day) => {
                  const selected = field.state.value.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        field.handleChange(
                          selected
                            ? field.state.value.filter((item) => item !== day)
                            : [...field.state.value, day],
                        )
                      }
                      className={cn(
                        "min-h-11 rounded-xl border text-xs font-semibold transition",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50",
                      )}
                    >
                      <span className="flex items-center justify-center gap-1">
                        {selected && <Check size={13} />}
                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="validFrom">
            {(field) => (
              <DatePicker
                label="Fecha de inicio"
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.Field name="validUntil">
            {(field) => (
              <DatePicker
                label="Fecha de término"
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="startTime">
            {(field) => (
              <label className="space-y-2 text-sm font-medium">
                Hora de inicio
                <Input
                  type="time"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="endTime">
            {(field) => (
              <label className="space-y-2 text-sm font-medium">
                Hora de término
                <Input
                  type="time"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="duration">
            {(field) => (
              <label className="space-y-2 text-sm font-medium">
                Duración
                <select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value as "1" | "2")
                  }
                  className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                </select>
              </label>
            )}
          </form.Field>
        </div>
        <form.Subscribe selector={(state) => state.values.days}>
          {(days) => (
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={days.length === 0}
            >
              <Eye /> Generar vista previa
            </Button>
          )}
        </form.Subscribe>
      </form>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {previewVisible ? (
        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            const preview = generateSchedules(values);
            return preview.length > 0 ? (
              <div className="mt-7 rounded-2xl border border-border bg-background p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">Vista previa</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Se crearán {preview.length} bloques semanales.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      onSave(preview);
                      setPreviewVisible(false);
                    }}
                  >
                    <Save /> Guardar todos
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {weekDays
                    .filter((day) => preview.some((slot) => slot.days[0] === day))
                    .map((day) => (
                      <div
                        key={day}
                        className="rounded-xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-terracotta">
                          {day}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {preview
                            .filter((slot) => slot.days[0] === day)
                            .map((slot) => (
                              <span
                                key={`${day}-${slot.startTime}`}
                                className="rounded-lg bg-sage px-2.5 py-1.5 text-xs font-medium"
                              >
                                {scheduleRange(slot)}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null;
          }}
        </form.Subscribe>
      ) : null}
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
                      <div
                        key={schedule.id}
                        className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-nowrap text-xs font-semibold">
                            {scheduleRange(schedule)}
                          </p>
                          <p className="text-[.65rem] text-muted-foreground">
                            {schedule.duration}{" "}
                            {schedule.duration === 1 ? "hora" : "horas"}
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
                    ))
                  )}
                </div>
                {daySchedules.length > 0 ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setDeleteDay(day)}
                  >
                    <Trash2 /> Eliminar todos
                  </Button>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
      <Dialog
        open={deleteDay !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteDay(null);
        }}
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogViewport>
            <DialogPopup className="max-w-md">
              <DialogHeader>
                <div>
                  <DialogTitle>¿Eliminar horarios del {deleteDay}?</DialogTitle>
                  <DialogDescription>
                    Se quitarán todos los bloques configurados para este día.
                  </DialogDescription>
                </div>
                <DialogClose />
              </DialogHeader>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDay(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (deleteDay) onDeleteDay(deleteDay);
                    setDeleteDay(null);
                  }}
                >
                  <Trash2 /> Sí, eliminar todos
                </Button>
              </div>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
