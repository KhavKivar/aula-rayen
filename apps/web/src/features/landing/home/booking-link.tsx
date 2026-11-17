import type { ReactNode } from "react";

import { WHATSAPP_URL } from "@/config/seo";
import { siteContent } from "@/config/static-content";

const WHATSAPP_BOOKING_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hola Rayen, quiero agendar una hora.",
)}`;

/** Destino de «Agendar hora»: Calendly si está configurado; si no, WhatsApp. */
export function bookingUrl(calendlyUrl: string | null) {
  return calendlyUrl ?? WHATSAPP_BOOKING_URL;
}

/** Botón secundario para escribir por WhatsApp con un mensaje listo. */
export function WhatsAppLink({
  className = "home-button home-button--outline",
  children = "Escribir por WhatsApp",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a className={className} href={WHATSAPP_BOOKING_URL} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (se abre en un sitio externo)</span>
    </a>
  );
}

export function BookingLink({
  className = "home-button",
  calendlyUrl = siteContent.booking.calendlyUrl,
  children = "Agendar hora",
}: {
  className?: string;
  calendlyUrl?: string | null;
  children?: ReactNode;
}) {
  return (
    <a
      className={className}
      href={bookingUrl(calendlyUrl)}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className="sr-only"> (se abre en un sitio externo)</span>
    </a>
  );
}
