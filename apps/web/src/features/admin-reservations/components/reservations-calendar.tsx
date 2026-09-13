import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { weekDays } from "@/features/admin-reservations/components/schedule-model";
import { cn } from "@/lib/utils";

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

export function ReservationsCalendar() {
  const days = Array.from({ length: 35 }, (_, index) => index - 1);
  return (
    <section
      className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-7"
      aria-labelledby="calendar-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker">Vista mensual</p>
          <h2 id="calendar-title" className="mt-2 font-heading text-3xl">
            Septiembre 2026
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Mes anterior">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm">
            Hoy
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Mes siguiente">
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="mt-7 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day) => (
              <div
                key={day}
                className="px-2 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayBookings = bookings.filter(
                (booking) => booking.day === day,
              );
              const inMonth = day > 0 && day <= 30;
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-28 border-b border-r border-border p-2",
                    index % 7 === 0 && "border-l",
                    !inMonth && "bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-full text-xs",
                      day === 11 &&
                        "bg-primary font-semibold text-primary-foreground",
                      !inMonth && "invisible",
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg bg-sage px-2 py-1.5 text-[.68rem] leading-tight"
                      >
                        <p className="font-semibold">
                          {booking.time} · {booking.attendee.split(" ")[0]}
                        </p>
                        <p className="mt-0.5 truncate text-muted-foreground">
                          {booking.service}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-sage ring-1 ring-primary/20" />{" "}
          Reserva confirmada
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-clay ring-1 ring-terracotta/20" />{" "}
          Horario disponible
        </span>
      </div>
    </section>
  );
}
