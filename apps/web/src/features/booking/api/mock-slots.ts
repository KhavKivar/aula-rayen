import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";

const ONLINE_PRICE_PLACEHOLDER_CLP = 45_000;

export const ONLINE_SESSION_PRICE_PLACEHOLDER_CLP =
  ONLINE_PRICE_PLACEHOLDER_CLP;

const FIRST_HOUR = 10;
const HOUR_COUNT = 6;
const MOCK_DURATION_MINUTES = 60;
const MOCK_DAYS_AHEAD = 7;

function isUnavailableDayOffset(offset: number) {
  return offset === 4;
}

function isUnavailableHourOffset(offset: number, hourIndex: number) {
  return (offset + hourIndex) % 5 === 2;
}

function atDayHour(reference: Date, offset: number, hourIndex: number) {
  const start = new Date(reference);
  start.setDate(start.getDate() + offset);
  start.setHours(FIRST_HOUR + hourIndex, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + MOCK_DURATION_MINUTES);
  return { start, end };
}

export function buildMockAvailabilitySlots(
  reference: Date = new Date(),
): AvailabilitySlotResponse[] {
  const slots: AvailabilitySlotResponse[] = [];
  const createdString = reference.toISOString();

  for (let dayOffset = 0; dayOffset < MOCK_DAYS_AHEAD; dayOffset += 1) {
    for (let hourIndex = 0; hourIndex < HOUR_COUNT; hourIndex += 1) {
      const { start, end } = atDayHour(reference, dayOffset, hourIndex);
      const unavailable =
        isUnavailableDayOffset(dayOffset) ||
        isUnavailableHourOffset(dayOffset, hourIndex);
      slots.push({
        id: slots.length + 1,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        assignedTo: "pamela-rayen",
        createdBy: "pamela-rayen",
        createdAt: createdString,
        status: unavailable ? "disabled" : "available",
      });
    }
  }

  return slots;
}

export function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function slotsForLocalDay(
  slots: AvailabilitySlotResponse[],
  isoDate: string,
) {
  return slots.filter(
    (slot) => toLocalIsoDate(new Date(slot.startTime)) === isoDate,
  );
}

export function formatSlotTime(slot: AvailabilitySlotResponse) {
  const timeFormatter = new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${timeFormatter.format(new Date(slot.startTime))} – ${timeFormatter.format(new Date(slot.endTime))}`;
}

export function formatSlotDayLabel(iso: string) {
  const formatter = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(new Date(iso));
}

export function formatPriceCLP(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}
