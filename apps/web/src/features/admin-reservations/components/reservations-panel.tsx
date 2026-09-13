import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { availabilityQueries } from "@/features/admin-reservations/api/queries";
import {
  useCreateAvailabilitySlots,
  useDeleteAvailabilitySlot,
} from "@/features/admin-reservations/api/use-availability-mutations";
import { toApiErrorMessage } from "@/lib/api-error";
import { sessionQueries } from "@/lib/session-queries";
import { cn } from "@/lib/utils";
import type {
  AvailabilitySlotResponse,
  CreateAvailabilitySlotRequest,
} from "@aula-rayen/contracts/availability";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;
type WeekDay = (typeof weekDays)[number];

interface FixedSchedule {
  id: number;
  days: WeekDay[];
  startTime: string;
  duration: 1 | 2;
  validFrom: string;
  validUntil: string;
}

interface Booking {
  id: number;
  attendee: string;
  initials: string;
  service: string;
  day: number;
  dateLabel: string;
  time: string;
  duration: string;
  status: "Confirmada" | "Pendiente";
}

const bookings: Booking[] = [
  { id: 1, attendee: "Camila Rojas", initials: "CR", service: "Sesión individual", day: 8, dateLabel: "Martes, 8 de septiembre", time: "09:00", duration: "1 hora", status: "Confirmada" },
  { id: 2, attendee: "Martín Silva", initials: "MS", service: "Orientación familiar", day: 8, dateLabel: "Martes, 8 de septiembre", time: "15:00", duration: "2 horas", status: "Pendiente" },
  { id: 3, attendee: "Josefa Díaz", initials: "JD", service: "Sesión individual", day: 10, dateLabel: "Jueves, 10 de septiembre", time: "11:00", duration: "1 hora", status: "Confirmada" },
  { id: 4, attendee: "Sebastián Soto", initials: "SS", service: "Seguimiento", day: 14, dateLabel: "Lunes, 14 de septiembre", time: "16:00", duration: "1 hora", status: "Confirmada" },
];

function PageHeader({ onAddOne }: { onAddOne: () => void }) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="section-kicker">Agenda y disponibilidad</p>
        <h1 id="reservations-title" className="mt-3 font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl">Reservas</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Organiza tus horarios fijos y revisa las próximas sesiones desde un solo lugar.</p>
      </div>
      <Button type="button" onClick={onAddOne}><Plus /> Agregar un horario</Button>
    </div>
  );
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function scheduleRange(schedule: Pick<FixedSchedule, "startTime" | "duration">) {
  const endTime = minutesToTime(
    timeToMinutes(schedule.startTime) + schedule.duration * 60,
  );
  return `${schedule.startTime} a ${endTime}`;
}

const previewDateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function previewWeekDates(offset: number) {
  return weekDays.map((day, index) => ({
    day,
    date: new Date(Date.UTC(2026, 8, 7 + offset * 7 + index)),
  }));
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const selected = new Date(`${value}T00:00:00Z`);
  return <div className="space-y-2"><p className="text-sm font-medium">{label}</p><Popover><PopoverTrigger render={<Button type="button" variant="outline" className="w-full justify-start rounded-xl bg-card font-normal" aria-label={`${label}: ${previewDateFormatter.format(selected)}`} />}><CalendarIcon className="text-muted-foreground" />{previewDateFormatter.format(selected)}</PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" locale={es} selected={selected} onSelect={(date) => { if (date) onChange(toIsoDate(date)); }} /></PopoverContent></Popover></div>;
}

interface ScheduleFormValues {
  days: WeekDay[];
  startTime: string;
  endTime: string;
  duration: "1" | "2";
  validFrom: string;
  validUntil: string;
}

function generateSchedules(value: ScheduleFormValues) {
  const duration = Number(value.duration) as 1 | 2;
  const start = timeToMinutes(value.startTime);
  const end = timeToMinutes(value.endTime);
  if (start >= end || start + duration * 60 > end) return [];

  const generated: Omit<FixedSchedule, "id">[] = [];
  for (const day of value.days) {
    for (let time = start; time + duration * 60 <= end; time += duration * 60) {
      generated.push({ days: [day], startTime: minutesToTime(time), duration, validFrom: value.validFrom, validUntil: value.validUntil });
    }
  }
  return generated;
}

function SingleScheduleDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (schedule: Omit<FixedSchedule, "id">) => void }) {
  const form = useForm({
    defaultValues: { day: "Lun" as WeekDay, date: "2026-09-07", startTime: "09:00", duration: "1" as "1" | "2" },
    onSubmit: ({ value }) => {
      onSave({ days: [value.day], startTime: value.startTime, duration: Number(value.duration) as 1 | 2, validFrom: value.date, validUntil: value.date });
      onOpenChange(false);
    },
  });

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogPortal><DialogBackdrop /><DialogViewport><DialogPopup className="max-w-md"><DialogHeader><div><DialogTitle>Agregar un horario</DialogTitle><DialogDescription>Crea un bloque individual en la disponibilidad semanal.</DialogDescription></div><DialogClose /></DialogHeader><form className="mt-6 space-y-5" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}><form.Field name="date">{(field) => <DatePicker label="Fecha" value={field.state.value} onChange={field.handleChange} />}</form.Field><form.Field name="day">{(field) => <label className="block space-y-2 text-sm font-medium">Día<select value={field.state.value} onChange={(event) => field.handleChange(event.target.value as WeekDay)} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">{weekDays.map((day) => <option key={day} value={day}>{day}</option>)}</select></label>}</form.Field><form.Field name="startTime">{(field) => <label className="block space-y-2 text-sm font-medium">Hora de inicio<Input type="time" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} /></label>}</form.Field><form.Field name="duration">{(field) => <label className="block space-y-2 text-sm font-medium">Duración<select value={field.state.value} onChange={(event) => field.handleChange(event.target.value as "1" | "2")} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"><option value="1">1 hora</option><option value="2">2 horas</option></select></label>}</form.Field><div className="flex justify-end gap-3 pt-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit"><Plus /> Agregar horario</Button></div></form></DialogPopup></DialogViewport></DialogPortal></Dialog>;
}

function ScheduleBuilder({ schedules, onSave, onDelete, onDeleteDay }: { schedules: FixedSchedule[]; onSave: (schedules: Omit<FixedSchedule, "id">[]) => void; onDelete: (id: number) => void; onDeleteDay: (day: WeekDay) => void }) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [deleteDay, setDeleteDay] = useState<WeekDay | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const datedWeek = previewWeekDates(weekOffset);
  const weekLabel = `${previewDateFormatter.format(datedWeek[0].date)} – ${previewDateFormatter.format(datedWeek[6].date)}`;
  const form = useForm({
    defaultValues: { days: ["Lun"] as WeekDay[], startTime: "09:00", endTime: "20:00", duration: "1" as "1" | "2", validFrom: "2026-09-07", validUntil: "2026-10-31" },
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
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7" aria-labelledby="fixed-schedules-title">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sage text-foreground"><Clock3 size={20} /></span>
        <div><h2 id="fixed-schedules-title" className="font-heading text-2xl">Horarios por día</h2><p className="mt-1 text-sm text-muted-foreground">Elige los días y genera todos los bloques dentro de un rango.</p></div>
      </div>
      <form className="mt-7 space-y-6" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}>
        <form.Field name="days">
          {(field) => <fieldset><legend className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Días disponibles</legend><div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{weekDays.map((day) => { const selected = field.state.value.includes(day); return <button key={day} type="button" aria-pressed={selected} onClick={() => field.handleChange(selected ? field.state.value.filter((item) => item !== day) : [...field.state.value, day])} className={cn("min-h-11 rounded-xl border text-xs font-semibold transition", selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50")}><span className="flex items-center justify-center gap-1">{selected && <Check size={13} />}{day}</span></button>; })}</div></fieldset>}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="validFrom">{(field) => <DatePicker label="Fecha de inicio" value={field.state.value} onChange={field.handleChange} />}</form.Field>
          <form.Field name="validUntil">{(field) => <DatePicker label="Fecha de término" value={field.state.value} onChange={field.handleChange} />}</form.Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="startTime">{(field) => <label className="space-y-2 text-sm font-medium">Hora de inicio<Input type="time" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} /></label>}</form.Field>
          <form.Field name="endTime">{(field) => <label className="space-y-2 text-sm font-medium">Hora de término<Input type="time" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} /></label>}</form.Field>
          <form.Field name="duration">{(field) => <label className="space-y-2 text-sm font-medium">Duración<select value={field.state.value} onChange={(event) => field.handleChange(event.target.value as "1" | "2")} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"><option value="1">1 hora</option><option value="2">2 horas</option></select></label>}</form.Field>
        </div>
        <form.Subscribe selector={(state) => state.values.days}>{(days) => <Button type="submit" variant="outline" className="w-full" disabled={days.length === 0}><Eye /> Generar vista previa</Button>}</form.Subscribe>
      </form>
      {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
      {previewVisible ? <form.Subscribe selector={(state) => state.values}>{(values) => { const preview = generateSchedules(values); return preview.length > 0 ? <div className="mt-7 rounded-2xl border border-border bg-background p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold">Vista previa</h3><p className="mt-1 text-xs text-muted-foreground">Se crearán {preview.length} bloques semanales.</p></div><Button type="button" onClick={() => { onSave(preview); setPreviewVisible(false); }}><Save /> Guardar todos</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{weekDays.filter((day) => preview.some((slot) => slot.days[0] === day)).map((day) => <div key={day} className="rounded-xl border border-border bg-card p-3"><p className="text-xs font-bold uppercase tracking-wider text-terracotta">{day}</p><div className="mt-2 flex flex-wrap gap-1.5">{preview.filter((slot) => slot.days[0] === day).map((slot) => <span key={`${day}-${slot.startTime}`} className="rounded-lg bg-sage px-2.5 py-1.5 text-xs font-medium">{scheduleRange(slot)}</span>)}</div></div>)}</div></div> : null; }}</form.Subscribe> : null}
      <div className="mt-7 border-t border-border pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CalendarDays className="text-terracotta" size={20} /><div><h3 className="font-heading text-xl">Previsualizar reservas</h3><p className="mt-1 text-xs text-muted-foreground">Así se verá tu disponibilidad semanal para reservar.</p></div></div><div className="flex items-center gap-2"><Button type="button" variant="outline" size="icon-sm" aria-label="Semana anterior" onClick={() => setWeekOffset((current) => current - 1)}><ChevronLeft /></Button><p className="min-w-48 text-center text-xs font-semibold capitalize" aria-live="polite">{weekLabel}</p><Button type="button" variant="outline" size="icon-sm" aria-label="Semana siguiente" onClick={() => setWeekOffset((current) => current + 1)}><ChevronRight /></Button></div></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">{datedWeek.map(({ day, date }) => { const isoDate = toIsoDate(date); const daySchedules = schedules.filter((schedule) => schedule.days.includes(day) && isoDate >= schedule.validFrom && isoDate <= schedule.validUntil); return <section key={isoDate} className="flex min-h-32 flex-col rounded-2xl border border-border bg-background p-4" aria-label={`Disponibilidad del ${day} ${date.getUTCDate()}`}><div className="flex items-center justify-between"><h4 className="text-xs font-bold uppercase tracking-[.12em] text-terracotta">{day} {date.getUTCDate()}</h4><span className="text-[.65rem] text-muted-foreground">{daySchedules.length} bloques</span></div><div className="mt-3 flex-1 space-y-2">{daySchedules.length === 0 ? <p className="py-4 text-center text-xs text-muted-foreground">Sin horarios</p> : daySchedules.map((schedule) => <div key={schedule.id} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"><div className="min-w-0 flex-1"><p className="whitespace-nowrap text-xs font-semibold">{scheduleRange(schedule)}</p><p className="text-[.65rem] text-muted-foreground">{schedule.duration} {schedule.duration === 1 ? "hora" : "horas"}</p></div><Button type="button" variant="ghost" size="icon-xs" aria-label={`Eliminar ${day} de ${scheduleRange(schedule)}`} onClick={() => onDelete(schedule.id)}><Trash2 /></Button></div>)}</div>{daySchedules.length > 0 ? <Button type="button" variant="destructive" size="sm" className="mt-4 w-full" onClick={() => setDeleteDay(day)}><Trash2 /> Eliminar todos</Button> : null}</section>; })}</div>
      </div>
      <Dialog open={deleteDay !== null} onOpenChange={(open) => { if (!open) setDeleteDay(null); }}><DialogPortal><DialogBackdrop /><DialogViewport><DialogPopup className="max-w-md"><DialogHeader><div><DialogTitle>¿Eliminar horarios del {deleteDay}?</DialogTitle><DialogDescription>Se quitarán todos los bloques configurados para este día.</DialogDescription></div><DialogClose /></DialogHeader><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDeleteDay(null)}>Cancelar</Button><Button type="button" variant="destructive" onClick={() => { if (deleteDay) onDeleteDay(deleteDay); setDeleteDay(null); }}><Trash2 /> Sí, eliminar todos</Button></div></DialogPopup></DialogViewport></DialogPortal></Dialog>
    </section>
  );
}

export function ReservationsCalendar() {
  const days = Array.from({ length: 35 }, (_, index) => index - 1);
  return <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-7" aria-labelledby="calendar-title"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="section-kicker">Vista mensual</p><h2 id="calendar-title" className="mt-2 font-heading text-3xl">Septiembre 2026</h2></div><div className="flex items-center gap-2"><Button variant="outline" size="icon-sm" aria-label="Mes anterior"><ChevronLeft /></Button><Button variant="outline" size="sm">Hoy</Button><Button variant="outline" size="icon-sm" aria-label="Mes siguiente"><ChevronRight /></Button></div></div><div className="mt-7 overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-7 border-b border-border">{weekDays.map((day) => <div key={day} className="px-2 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day}</div>)}</div><div className="grid grid-cols-7">{days.map((day, index) => { const dayBookings = bookings.filter((booking) => booking.day === day); const inMonth = day > 0 && day <= 30; return <div key={index} className={cn("min-h-28 border-b border-r border-border p-2", index % 7 === 0 && "border-l", !inMonth && "bg-muted/40")}><span className={cn("grid size-7 place-items-center rounded-full text-xs", day === 11 && "bg-primary font-semibold text-primary-foreground", !inMonth && "invisible")}>{day}</span><div className="mt-1 space-y-1">{dayBookings.map((booking) => <div key={booking.id} className="rounded-lg bg-sage px-2 py-1.5 text-[.68rem] leading-tight"><p className="font-semibold">{booking.time} · {booking.attendee.split(" ")[0]}</p><p className="mt-0.5 truncate text-muted-foreground">{booking.service}</p></div>)}</div></div>; })}</div></div></div><div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-sage ring-1 ring-primary/20" /> Reserva confirmada</span><span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-clay ring-1 ring-terracotta/20" /> Horario disponible</span></div></section>;
}

const DAY_IN_MS = 86_400_000;

function slotDatePart(isoDateTime: string) {
  return isoDateTime.slice(0, 10);
}

function slotTimePart(isoDateTime: string) {
  return isoDateTime.slice(11, 16);
}

function mondayBasedWeekday(datePart: string) {
  return (new Date(`${datePart}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function toFixedSchedule(slot: AvailabilitySlotResponse): FixedSchedule {
  const date = slotDatePart(slot.startTime);
  const durationHours = Math.round(
    (Date.parse(slot.endTime) - Date.parse(slot.startTime)) / 3_600_000,
  ) as 1 | 2;
  return {
    id: slot.id,
    days: [weekDays[mondayBasedWeekday(date)] ?? "Lun"],
    startTime: slotTimePart(slot.startTime),
    duration: durationHours,
    validFrom: date,
    validUntil: date,
  };
}

function toSlotPayload(
  date: string,
  startTime: string,
  duration: 1 | 2,
  assignedTo: string,
): CreateAvailabilitySlotRequest {
  const endTime = minutesToTime(timeToMinutes(startTime) + duration * 60);
  return {
    startTime: `${date}T${startTime}:00.000Z`,
    endTime: `${date}T${endTime}:00.000Z`,
    assignedTo,
  };
}

function expandSchedulesToSlots(
  schedules: Omit<FixedSchedule, "id">[],
  assignedTo: string,
): CreateAvailabilitySlotRequest[] {
  const payloads: CreateAvailabilitySlotRequest[] = [];
  for (const schedule of schedules) {
    const start = Date.parse(`${schedule.validFrom}T00:00:00Z`);
    const end = Date.parse(`${schedule.validUntil}T00:00:00Z`);
    for (let day = start; day <= end; day += DAY_IN_MS) {
      const date = new Date(day).toISOString().slice(0, 10);
      const weekday = weekDays[mondayBasedWeekday(date)] ?? "Lun";
      if (!schedule.days.includes(weekday)) continue;
      payloads.push(
        toSlotPayload(date, schedule.startTime, schedule.duration, assignedTo),
      );
    }
  }
  return payloads;
}

export function ReservationsPanel() {
  const [singleScheduleOpen, setSingleScheduleOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const slotsQuery = useQuery(availabilityQueries.slots);
  const sessionQuery = useQuery(sessionQueries.session);
  const createSlots = useCreateAvailabilitySlots();
  const deleteSlot = useDeleteAvailabilitySlot();

  const schedules = useMemo(
    () => (slotsQuery.data ?? []).map(toFixedSchedule),
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

  const deleteSchedulesByDay = (day: WeekDay) => {
    setActionError(null);
    const ids = schedules
      .filter((schedule) => schedule.days.includes(day))
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
      ) : null}
      {slotsQuery.isError ? (
        <div
          role="alert"
          className="mt-8 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-[#e4c5b9] bg-[#fff8f4] px-6 py-10 text-[#934d3b]"
        >
          <p>No fue posible cargar los horarios guardados.</p>
          <Button
            variant="outline"
            onClick={() => slotsQuery.refetch()}
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="mt-8 rounded-xl bg-[#fff8f4] px-4 py-3 text-sm text-[#934d3b]"
        >
          {actionError}
        </p>
      ) : null}
      <div className="mt-8">
        <ScheduleBuilder
          schedules={schedules}
          onSave={saveSchedules}
          onDelete={deleteSchedule}
          onDeleteDay={deleteSchedulesByDay}
        />
      </div>
      <SingleScheduleDialog
        open={singleScheduleOpen}
        onOpenChange={setSingleScheduleOpen}
        onSave={(schedule) => saveSchedules([schedule])}
      />
    </section>
  );
}
