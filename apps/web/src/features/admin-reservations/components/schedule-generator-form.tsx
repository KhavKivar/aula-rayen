import { useForm } from "@tanstack/react-form";
import { Check, Clock3, Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/features/admin-reservations/components/date-picker";
import {
  generateSchedules,
  plusDays,
  todayReference,
  weekDays,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";
import { SchedulePreviewGrid } from "@/features/admin-reservations/components/schedule-preview-grid";
import { cn } from "@/lib/utils";

/**
 * Formulario para generar horarios fijos por día y rango de fechas.
 * Valida las reglas de negocio y muestra la vista previa resultante.
 */
export function ScheduleGeneratorForm({
  onSave,
}: {
  onSave: (schedules: Omit<FixedSchedule, "id">[]) => void;
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      days: ["Lun"] as WeekDay[],
      startTime: "09:00",
      endTime: "20:00",
      duration: "1" as "1" | "2",
      validFrom: todayReference,
      validUntil: plusDays(todayReference, 7),
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
    <>
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
                            : "border-border bg-card text-muted-foreground hover:border-primary/50",
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
              className="w-full bg-card hover:bg-muted"
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
              <SchedulePreviewGrid
                preview={preview}
                onSave={(schedules) => {
                  onSave(schedules);
                  setPreviewVisible(false);
                }}
              />
            ) : null;
          }}
        </form.Subscribe>
      ) : null}
    </>
  );
}
