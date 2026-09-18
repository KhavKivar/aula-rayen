import { CheckCircle2, Lock } from "lucide-react";

import {
  ONLINE_SESSION_PRICE_PLACEHOLDER_CLP,
  formatPriceCLP,
} from "@/features/booking/api/mock-slots";

const MOCK_SERVICES = [
  { name: "Consulta psicológica online", price: ONLINE_SESSION_PRICE_PLACEHOLDER_CLP },
] as const;

export function BookingAppointmentForm({
  onClearSlot,
}: {
  onClearSlot: () => void;
}) {
  const service = MOCK_SERVICES[0];

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-3xl tracking-tight">
        Datos relativos a la cita
      </h2>

      <div className="mt-6 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold">
            Motivo de la visita <span aria-hidden="true">*</span>
          </legend>
          <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-3">
            <p className="text-sm font-medium">
              {service.name} · {formatPriceCLP(service.price)}
            </p>
            <button
              type="button"
              onClick={onClearSlot}
              className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-border"
            >
              Cambiar
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Los precios son para pacientes sin previsión.
          </p>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">
            Previsión <span aria-hidden="true">*</span>
          </legend>
          <label className="sr-only" htmlFor="booking-prevision">
            Previsión
          </label>
          <select
            id="booking-prevision"
            defaultValue="privada"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-sage focus:outline-none"
          >
            <option value="privada">Visita privada</option>
          </select>
          <p className="mt-2 text-sm text-muted-foreground">
            Este especialista no acepta ninguna previsión en la ubicación
            escogida.
          </p>
        </fieldset>

        <button
          type="button"
          disabled
          className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground opacity-70"
          title="El pago en línea estará disponible próximamente"
        >
          <Lock size={15} aria-hidden="true" />
          Pagar con Webpay
        </button>
        <p className="-mt-2 text-center text-xs text-muted-foreground">
          <CheckCircle2 size={12} className="mr-1 inline text-sage" aria-hidden="true" />
          formulario listo; el siguiente paso es pagar con Webpay.
        </p>
      </div>
    </section>
  );
}
