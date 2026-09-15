import type {
  AvailabilitySlotResponse,
  AvailabilitySlotCreateRequest,
} from "@aula-rayen/contracts/availability";

export const weekDays = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
] as const;
export type WeekDay = (typeof weekDays)[number];

export interface FixedSchedule {
  id: number;
  days: WeekDay[];
  startTime: string;
  duration: 1 | 2;
  validFrom: string;
  validUntil: string;
}

export interface ScheduleFormValues {
  days: WeekDay[];
  startTime: string;
  endTime: string;
  duration: "1" | "2";
  validFrom: string;
  validUntil: string;
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function scheduleRange(
  schedule: Pick<FixedSchedule, "startTime" | "duration">,
) {
  const endTime = minutesToTime(
    timeToMinutes(schedule.startTime) + schedule.duration * 60,
  );
  return `${schedule.startTime} a ${endTime}`;
}

export const previewDateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export function previewWeekDates(offset: number) {
  return weekDays.map((day, index) => ({
    day,
    date: new Date(Date.UTC(2026, 8, 7 + offset * 7 + index)),
  }));
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Fecha de referencia "hoy" de la aplicación (alineada con la vista semanal). */
export const toLocalIsoDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export const todayReference = toLocalIsoDate(new Date());

export function plusDays(isoDate: string, days: number) {
  return toIsoDate(
    new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_IN_MS),
  );
}

export function generateSchedules(value: ScheduleFormValues) {
  const duration = Number(value.duration) as 1 | 2;
  const start = timeToMinutes(value.startTime);
  const end = timeToMinutes(value.endTime);
  if (start >= end || start + duration * 60 > end) return [];

  const generated: Omit<FixedSchedule, "id">[] = [];
  for (const day of value.days) {
    for (let time = start; time + duration * 60 <= end; time += duration * 60) {
      generated.push({
        days: [day],
        startTime: minutesToTime(time),
        duration,
        validFrom: value.validFrom,
        validUntil: value.validUntil,
      });
    }
  }
  return generated;
}

const DAY_IN_MS = 86_400_000;

function expandedDates(schedule: Omit<FixedSchedule, "id">): string[] {
  const dates: string[] = [];
  const start = Date.parse(`${schedule.validFrom}T00:00:00Z`);
  const end = Date.parse(`${schedule.validUntil}T00:00:00Z`);
  for (let day = start; day <= end; day += DAY_IN_MS) {
    const date = new Date(day).toISOString().slice(0, 10);
    const weekday = weekDays[mondayBasedWeekday(date)] ?? "Lun";
    if (
      schedule.validFrom !== schedule.validUntil &&
      !schedule.days.includes(weekday)
    ) {
      continue;
    }
    dates.push(date);
  }
  return dates;
}

export function countGeneratedSlots(
  schedules: Omit<FixedSchedule, "id">[],
): Record<WeekDay, number> {
  const counts: Record<WeekDay, number> = {
    Lun: 0,
    Mar: 0,
    Mié: 0,
    Jue: 0,
    Vie: 0,
    Sáb: 0,
    Dom: 0,
  };
  for (const schedule of schedules) {
    for (const date of expandedDates(schedule)) {
      const weekday = weekDays[mondayBasedWeekday(date)] ?? "Lun";
      counts[weekday] += 1;
    }
  }
  return counts;
}

export function totalGeneratedSlots(
  schedules: Omit<FixedSchedule, "id">[],
): number {
  return schedules.reduce(
    (total, schedule) => total + expandedDates(schedule).length,
    0,
  );
}

const shortDateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatGeneratedDates(schedule: Omit<FixedSchedule, "id">) {
  return expandedDates(schedule)
    .map((date) => shortDateFormatter.format(new Date(`${date}T00:00:00Z`)))
    .join(", ");
}

function slotDatePart(isoDateTime: string) {
  return isoDateTime.slice(0, 10);
}

function slotTimePart(isoDateTime: string) {
  return isoDateTime.slice(11, 16);
}

export function mondayBasedWeekday(datePart: string) {
  return (new Date(`${datePart}T00:00:00Z`).getUTCDay() + 6) % 7;
}

export function toFixedSchedule(slot: AvailabilitySlotResponse): FixedSchedule {
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
): AvailabilitySlotCreateRequest {
  const endTime = minutesToTime(timeToMinutes(startTime) + duration * 60);
  return {
    startTime: `${date}T${startTime}:00.000Z`,
    endTime: `${date}T${endTime}:00.000Z`,
    assignedTo,
  };
}

export function findConflictingSlots(
  payloads: AvailabilitySlotCreateRequest[],
  existing: AvailabilitySlotResponse[],
): AvailabilitySlotCreateRequest[] {
  return payloads.filter((payload) => {
    const date = slotDatePart(payload.startTime);
    const startMinutes = timeToMinutes(slotTimePart(payload.startTime));
    const endMinutes = timeToMinutes(slotTimePart(payload.endTime));
    return existing.some((slot) => {
      if (slotDatePart(slot.startTime) !== date) return false;
      const otherStart = timeToMinutes(slotTimePart(slot.startTime));
      const otherEnd = timeToMinutes(slotTimePart(slot.endTime));
      return startMinutes < otherEnd && otherStart < endMinutes;
    });
  });
}

export function describeSlotConflict(
  payload: AvailabilitySlotCreateRequest,
): string {
  const date = slotDatePart(payload.startTime);
  const start = slotTimePart(payload.startTime);
  const end = slotTimePart(payload.endTime);
  return `${previewDateFormatter.format(new Date(`${date}T00:00:00Z`))}, de ${start} a ${end}`;
}

export function scheduleHasConflict(
  schedule: Omit<FixedSchedule, "id">,
  schedules: FixedSchedule[],
): boolean {
  return schedules.some((other) => {
    if (
      other.validFrom > schedule.validUntil ||
      other.validUntil < schedule.validFrom
    ) {
      return false;
    }
    if (!other.days.some((day) => schedule.days.includes(day))) return false;
    const start = timeToMinutes(schedule.startTime);
    const end = start + schedule.duration * 60;
    const otherStart = timeToMinutes(other.startTime);
    const otherEnd = otherStart + other.duration * 60;
    return start < otherEnd && otherStart < end;
  });
}

export function expandSchedulesToSlots(
  schedules: Omit<FixedSchedule, "id">[],
  assignedTo: string,
): AvailabilitySlotCreateRequest[] {
  const payloads: AvailabilitySlotCreateRequest[] = [];
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
