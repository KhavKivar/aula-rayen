import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { toLocalIsoDate } from "@/features/booking/api/mock-slots";

const weekdayFormatter = new Intl.DateTimeFormat("es-CL", {
  weekday: "short",
});
const timeFormatter = new Intl.DateTimeFormat("es-CL", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const monthDayFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
});

const DAYS_PER_PAGE = 4;
const MAX_VISIBLE_TIME_ROWS = 4;

function dayHeader(date: Date, isoDate: string) {
  const today = toLocalIsoDate(new Date());
  const tomorrowIso = toLocalIsoDate(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  );
  const title =
    isoDate === today
      ? "Hoy"
      : isoDate === tomorrowIso
        ? "Mañana"
        : weekdayFormatter.format(date).replace(".", "");
  return { title, subtitle: monthDayFormatter.format(date).replace(".", "") };
}

/**
 * Grilla de disponibilidad estilo Doctoralia: un día por columna, filas
 * de horarios alineadas y "–" cuando un día no ofrece ese horario.
 */
export function AvailabilityCalendar({
  compact = false,
  slots,
  selectedDate,
  selectedSlotId,
  onDateChange,
  onSlotSelect,
}: {
  /** En tarjetas compactas (CTA de landing): limita filas y permite expandir. */
  compact?: boolean;
  slots: AvailabilitySlotResponse[];
  selectedDate: string;
  selectedSlotId: number | null;
  onDateChange: (isoDate: string) => void;
  onSlotSelect: (slot: AvailabilitySlotResponse) => void;
}) {
  const isAvailable = (slot?: AvailabilitySlotResponse) =>
    slot?.status === "available";
  const availableByDay = new Map<string, Map<string, AvailabilitySlotResponse>>();
  const allDays = new Set<string>();
  for (const slot of slots) {
    const dayKey = toLocalIsoDate(new Date(slot.startTime));
    allDays.add(dayKey);
    if (slot.status !== "available") continue;
    if (!availableByDay.has(dayKey)) availableByDay.set(dayKey, new Map());
    const timeKey = timeFormatter.format(new Date(slot.startTime));
    availableByDay.get(dayKey)?.set(timeKey, slot);
  }

  const today = toLocalIsoDate(new Date());
  const days = [...allDays]
    .filter((isoDate) => isoDate >= today)
    .sort();
  const timeKeys = [
    ...new Set(
      [...availableByDay.values()].flatMap((byTime) => [...byTime.keys()]),
    ),
  ].sort();

  const [page, setPage] = useState(0);
  const [showAllRows, setShowAllRows] = useState(false);
  const visibleTimeKeys =
    !compact || showAllRows ? timeKeys : timeKeys.slice(0, MAX_VISIBLE_TIME_ROWS);
  const hiddenRowCount = compact ? timeKeys.length - visibleTimeKeys.length : 0;
  const pageCount = Math.max(1, Math.ceil(days.length / DAYS_PER_PAGE));
  const visibleDays = days.slice(
    page * DAYS_PER_PAGE,
    page * DAYS_PER_PAGE + DAYS_PER_PAGE,
  );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-separate border-spacing-x-1.5 text-center text-sm">
          <thead>
            <tr>
              <td className="w-10 align-middle">
                {pageCount > 1 && (
                  <button
                    type="button"
                    aria-label="Días anteriores"
                    disabled={page === 0}
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    className="rounded-full border border-border bg-card p-2 text-muted-foreground disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
              </td>
              {visibleDays.map((isoDate) => {
                const date = new Date(`${isoDate}T00:00:00`);
                const { title, subtitle } = dayHeader(date, isoDate);
                return (
                  <th
                    key={isoDate}
                    scope="col"
                    className={
                      "px-2 pb-3 font-semibold " +
                      (isoDate === selectedDate ? "text-primary" : "text-foreground")
                    }
                  >
                    <button
                      type="button"
                      aria-pressed={isoDate === selectedDate}
                      onClick={() => onDateChange(isoDate)}
                      className="w-full rounded-xl px-2 py-1 hover:bg-secondary"
                    >
                      <div className="text-base capitalize">{title}</div>
                      <div className="text-xs font-normal text-muted-foreground">
                        {subtitle}
                      </div>
                    </button>
                  </th>
                );
              })}
              <td className="w-10 align-middle">
                {pageCount > 1 && (
                  <button
                    type="button"
                    aria-label="Días siguientes"
                    disabled={page >= pageCount - 1}
                    onClick={() =>
                      setPage((current) => Math.min(pageCount - 1, current + 1))
                    }
                    className="rounded-full border border-border bg-card p-2 text-primary disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {visibleTimeKeys.map((timeKey) => (
              <tr key={timeKey}>
                <td aria-hidden="true" className="w-10" />
                {visibleDays.map((isoDate) => {
                  const slot = availableByDay.get(isoDate)?.get(timeKey);
                  const selected = slot ? slot.id === selectedSlotId : false;
                  return (
                    <td key={isoDate + timeKey} className="px-1 py-1.5">
                      {isAvailable(slot) ? (
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Elegir horario ${timeKey}`}
                          onClick={() => slot && onSlotSelect(slot)}
                          className={
                            "min-h-12 w-full rounded-full border text-sm font-medium transition" +
                            (selected
                              ? " border-primary bg-primary text-primary-foreground shadow-sm"
                              : " border-border bg-card text-foreground hover:border-sage hover:bg-secondary")
                          }
                        >
                          {timeKey}
                        </button>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="block min-h-12 content-center text-muted-foreground"
                        >
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {hiddenRowCount > 0 && (
          <div className="mt-3 text-center">
            <button
              type="button"
              aria-expanded={showAllRows}
              onClick={() => setShowAllRows((current) => !current)}
              className="text-link inline-flex items-center gap-1.5 text-sm"
            >
              {showAllRows
                ? "Mostrar menos horarios"
                : `Mostrar más (${hiddenRowCount})`}
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={showAllRows ? "rotate-180" : ""}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
