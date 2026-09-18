import type { AvailabilitySlotResponse } from "@aula-rayen/contracts";
import { CalendarDays, Lock, MonitorPlay } from "lucide-react";

import { siteContent } from "@/config/static-content";
import { formatSlotDayLabel } from "@/features/booking/api/mock-slots";

export function BookingCitationCard({
  selectedSlot,
  onOpenCalendar,
}: {
  selectedSlot: AvailabilitySlotResponse | null;
  onOpenCalendar: () => void;
}) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <img
          src={siteContent.assets.profileImageUrl}
          alt={siteContent.professional.name}
          width={44}
          height={44}
          className="size-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{siteContent.professional.name}</p>
          <p className="text-xs text-muted-foreground">Psicóloga</p>
        </div>
      </div>

      {selectedSlot ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="flex items-start gap-2 text-sm">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0 text-sage"
              aria-hidden="true"
            />
            <span>
              {formatSlotDayLabel(selectedSlot.startTime)}
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Zona horaria: America/Santiago
              </span>
            </span>
          </p>
          <button
            type="button"
            onClick={onOpenCalendar}
            className="mt-1 ml-6 text-sm font-medium text-primary underline underline-offset-4 hover:text-terracotta"
          >
            Cambiar la fecha
          </button>
        </div>
      ) : (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm text-muted-foreground">
            Fecha y hora por confirmar.
          </p>
          <button
            type="button"
            onClick={onOpenCalendar}
            className="text-link mt-3 flex items-center gap-2 text-sm"
          >
            <CalendarDays size={16} aria-hidden="true" /> Elegir en el
            calendario
          </button>
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
        <MonitorPlay size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        Modalidad: sesión online por videollamada.
      </p>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
        <Lock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        Pago con Webpay próximamente.
      </p>
    </aside>
  );
}
