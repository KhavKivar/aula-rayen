import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { QueryState } from "@/components/ui/query-state";
import { availabilityQueries } from "@/features/admin-reservations/api/queries";
import {
  useCreateAvailabilitySlots,
  useDeleteAvailabilitySlot,
} from "@/features/admin-reservations/api/use-availability-mutations";
import { ReservationsCalendar } from "@/features/admin-reservations/components/reservations-calendar";
import {
  describeSlotConflict,
  expandSchedulesToSlots,
  findConflictingSlots,
  previewDateFormatter,
  scheduleHasConflict,
  scheduleRange,
  toFixedSchedule,
  type FixedSchedule,
  type WeekDay,
} from "@/features/admin-reservations/components/schedule-model";
import { SingleScheduleDialog } from "@/features/admin-reservations/components/single-schedule-dialog";
import { ScheduleGeneratorForm } from "@/features/admin-reservations/components/schedule-generator-form";
import { toApiErrorMessage } from "@/lib/api-error";
import { sessionQueries } from "@/lib/session-queries";

function PageHeader({ onAddOne }: { onAddOne: () => void }) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="section-kicker">Agenda y disponibilidad</p>
        <h1
          id="reservations-title"
          className="mt-3 font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
        >
          Disponibilidad
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Publica tus horarios fijos y gestiona los bloques en los que puedes
          recibir sesiones.
        </p>
      </div>
      <Button type="button" onClick={onAddOne}>
        <Plus /> Agregar un horario
      </Button>
    </div>
  );
}

export function ReservationsPanel() {
  const [singleScheduleOpen, setSingleScheduleOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState<{
    date?: string;
    day?: WeekDay;
  }>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FixedSchedule | null>(
    null,
  );
  const slotsQuery = useQuery(availabilityQueries.slots);
  const sessionQuery = useQuery(sessionQueries.session);
  const createSlots = useCreateAvailabilitySlots();
  const deleteSlot = useDeleteAvailabilitySlot();

  const schedules = useMemo(
    () =>
      (slotsQuery.data ?? [])
        .map(toFixedSchedule)
        .sort((a, b) => {
          const dateOrder = a.validFrom.localeCompare(b.validFrom);
          return dateOrder !== 0
            ? dateOrder
            : a.startTime.localeCompare(b.startTime);
        }),
    [slotsQuery.data],
  );
  const assigneeId = sessionQuery.data?.user.id;

  const requireAssignee = () => {
    if (!assigneeId) {
      throw new Error(
        "No se pudo identificar tu sesión. Recarga la página e inténtalo nuevamente.",
      );
    }
    return assigneeId;
  };

  const saveSchedules = (generated: Omit<FixedSchedule, "id">[]) => {
    try {
      const payloads = expandSchedulesToSlots(generated, requireAssignee());
      if (payloads.length === 0) return;
      const conflict = findConflictingSlots(
        payloads,
        slotsQuery.data ?? [],
      )[0];
      if (conflict) {
        setConflictError(
          `El bloque (${describeSlotConflict(conflict)}) se superpone con un horario existente. Ajusta las horas o elige otra fecha.`,
        );
        return;
      }
      setActionError(null);
      void createSlots.mutateAsync(payloads).catch((error: unknown) => {
        setActionError(
          toApiErrorMessage(error, "No se pudieron guardar los horarios"),
        );
      });
    } catch (error: unknown) {
      setActionError(
        toApiErrorMessage(error, "No se pudieron guardar los horarios"),
      );
    }
  };

  const deleteSchedule = (id: number) => {
    setActionError(null);
    void deleteSlot.mutateAsync({ id }).catch((error: unknown) => {
      setActionError(
        toApiErrorMessage(error, "No se pudo eliminar el horario"),
      );
    });
  };

  const deleteSchedulesByDate = (date: string) => {
    setActionError(null);
    const ids = schedules
      .filter((schedule) => schedule.validFrom === date)
      .map((schedule) => schedule.id);
    void Promise.all(ids.map((id) => deleteSlot.mutateAsync({ id }))).catch(
      (error: unknown) => {
        setActionError(
          toApiErrorMessage(error, "No se pudieron eliminar los horarios"),
        );
      },
    );
  };

  return (
    <section aria-labelledby="reservations-title">
      <PageHeader onAddOne={() => setSingleScheduleOpen(true)} />
      {slotsQuery.isPending ? (
        <p role="status" className="mt-8 text-sm text-muted-foreground">
          Cargando horarios guardados…
        </p>
      ) : slotsQuery.isLoadingError ? (
        <QueryState
          query={slotsQuery}
          loading="Cargando horarios guardados…"
          error="No fue posible cargar los horarios guardados."
          onRetry={() => slotsQuery.refetch()}
          errorClassName="mt-8 rounded-[2rem] px-6 py-10"
        >
          {null}
        </QueryState>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="mt-8 rounded-xl bg-error-surface px-4 py-3 text-sm text-error"
        >
          {actionError}
        </p>
      ) : null}
      <div className="mt-8">
        <ScheduleGeneratorForm onSave={saveSchedules} />
      </div>
      <div className="mt-8">
        <ReservationsCalendar
          schedules={schedules}
          onAddForDate={(date, day) => {
            setScheduleDraft({ date, day });
            setSingleScheduleOpen(true);
          }}
          onDelete={(id) => setPendingDelete(
            schedules.find((schedule) => schedule.id === id) ?? null,
          )}
          onDeleteDate={deleteSchedulesByDate}
        />
      </div>
      <SingleScheduleDialog
        key={scheduleDraft.date ?? "default"}
        initialDate={scheduleDraft.date}
        initialDay={scheduleDraft.day}
        open={singleScheduleOpen}
        onOpenChange={setSingleScheduleOpen}
        onSave={(schedule) => saveSchedules([schedule])}
        checkConflict={(schedule) =>
          scheduleHasConflict(schedule, schedules)
        }
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title={"¿Eliminar este horario de disponibilidad?"}
        description={
          pendingDelete
            ? `Se quitará el bloque ${pendingDelete.days[0]} de ${scheduleRange(pendingDelete)} del ${previewDateFormatter.format(new Date(`${pendingDelete.validFrom}T00:00:00Z`))}.`
            : undefined
        }
        confirmLabel="Sí, eliminar"
        destructive
        onConfirm={() => {
          if (pendingDelete) deleteSchedule(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
      <ConfirmDialog
        open={conflictError !== null}
        onOpenChange={(open) => {
          if (!open) setConflictError(null);
        }}
        title="Conflicto de horarios"
        description={conflictError ?? ""}
        confirmLabel="Entendido"
        onConfirm={() => setConflictError(null)}
      />
    </section>
  );
}
