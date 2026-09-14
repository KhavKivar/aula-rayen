import type { FixedSchedule, WeekDay } from "@/features/admin-reservations/components/schedule-model";
import { ScheduleGeneratorForm } from "@/features/admin-reservations/components/schedule-generator-form";
import { WeekAvailabilityGrid } from "@/features/admin-reservations/components/week-availability-grid";

/**
 * Composición del panel de horarios fijos: formulario generador y
 * calendario semanal de disponibilidad.
 */
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
  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
      aria-labelledby="fixed-schedules-title"
    >
      <ScheduleGeneratorForm onSave={onSave} />
      <WeekAvailabilityGrid
        schedules={schedules}
        onDelete={onDelete}
        onDeleteDay={onDeleteDay}
      />
    </section>
  );
}
