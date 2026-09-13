import type {
  AvailabilitySlotResponse,
  CreateAvailabilitySlotRequest,
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

function slotDatePart(isoDateTime: string) {
  return isoDateTime.slice(0, 10);
}

function slotTimePart(isoDateTime: string) {
  return isoDateTime.slice(11, 16);
}

function mondayBasedWeekday(datePart: string) {
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
): CreateAvailabilitySlotRequest {
  const endTime = minutesToTime(timeToMinutes(startTime) + duration * 60);
  return {
    startTime: `${date}T${startTime}:00.000Z`,
    endTime: `${date}T${endTime}:00.000Z`,
    assignedTo,
  };
}

export function expandSchedulesToSlots(
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
