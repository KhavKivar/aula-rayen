import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/features/admin-reservations/components/date-picker";
import {
  todayReference,
  weekDays,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";

export function SingleScheduleDialog({
  open,
  onOpenChange,
  onSave,
  initialDate,
  initialDay,
  checkConflict,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (schedule: Omit<FixedSchedule, "id">) => void;
  initialDate?: string;
  initialDay?: WeekDay;
  checkConflict?: (schedule: Omit<FixedSchedule, "id">) => boolean;
}) {
  const [conflictError, setConflictError] = useState(false);
  const form = useForm({
    defaultValues: {
      day: initialDay ?? ("Lun" as WeekDay),
      date: initialDate ?? todayReference,
      startTime: "09:00",
      duration: "1" as "1" | "2",
    },
    onSubmit: ({ value }) => {
      const schedule: Omit<FixedSchedule, "id"> = {
        days: [value.day],
        startTime: value.startTime,
        duration: Number(value.duration) as 1 | 2,
        validFrom: value.date,
        validUntil: value.date,
      };
      if (checkConflict?.(schedule)) {
        setConflictError(true);
        return;
      }
      setConflictError(false);
      onSave(schedule);
      onOpenChange(false);
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => {
        if (next) setConflictError(false);
        onOpenChange(next);
      }}
      title="Agregar un horario"
      description="Crea un bloque individual en la disponibilidad semanal."
    >
      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="date">
          {(field) => (
            <DatePicker
              label="Fecha"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <form.Field name="day">
          {(field) => (
            <label className="block space-y-2 text-sm font-medium">
              Día
              <select
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.target.value as WeekDay)
                }
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {weekDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          )}
        </form.Field>
        <form.Field name="startTime">
          {(field) => (
            <label className="block space-y-2 text-sm font-medium">
              Hora de inicio
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
            <label className="block space-y-2 text-sm font-medium">
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
        {conflictError ? (
          <p role="alert" className="text-sm text-destructive">
            Este horario se superpone con un bloque existente en la misma
            fecha. Ajusta la hora o elige otra fecha.
          </p>
        ) : null}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            <Plus /> Agregar horario
          </Button>
        </div>
      </form>
    </FormDialog>
  );
}
