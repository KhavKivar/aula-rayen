import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/features/admin-reservations/components/date-picker";
import {
  weekDays,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";

export function SingleScheduleDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (schedule: Omit<FixedSchedule, "id">) => void;
}) {
  const form = useForm({
    defaultValues: {
      day: "Lun" as WeekDay,
      date: "2026-09-07",
      startTime: "09:00",
      duration: "1" as "1" | "2",
    },
    onSubmit: ({ value }) => {
      onSave({
        days: [value.day],
        startTime: value.startTime,
        duration: Number(value.duration) as 1 | 2,
        validFrom: value.date,
        validUntil: value.date,
      });
      onOpenChange(false);
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
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
