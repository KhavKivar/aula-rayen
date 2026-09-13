import { createFileRoute } from "@tanstack/react-router";

import { ReservationsCalendar } from "@/features/admin-reservations/components/reservations-panel";

export const Route = createFileRoute(
  "/_authenticated/dashboard/admin/calendar",
)({ component: AdminCalendarPage });

function AdminCalendarPage() {
  return (
    <section aria-labelledby="admin-calendar-title">
      <div className="border-b border-border pb-8">
        <p className="section-kicker">Agenda general</p>
        <h1
          id="admin-calendar-title"
          className="mt-3 font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
        >
          Calendario
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Revisa las reservas confirmadas y pendientes en la agenda mensual.
        </p>
      </div>
      <div className="mt-8">
        <ReservationsCalendar />
      </div>
    </section>
  );
}
