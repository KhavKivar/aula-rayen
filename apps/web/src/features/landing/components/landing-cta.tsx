import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { WHATSAPP_DISPLAY } from "@/config/seo";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";
import { ExternalWhatsAppLink } from "@/features/landing/components/external-whatsapp-link";

export function LandingCta({
  bookingPreview,
}: {
  bookingPreview?: ReactNode;
} = {}) {
  return (
    <section id="agenda" className="page-container scroll-mt-8 pb-16 lg:pb-24">
      <div className="grid gap-10 rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:p-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-sage">
            A tu tiempo, a tu ritmo
          </p>
          <h2 className="mt-5 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
            Hagamos espacio para conversar.
          </h2>
          <p className="mt-6 max-w-md leading-8 text-primary-foreground/75">
            Si tienes dudas o quieres agendar una sesión, escríbeme por WhatsApp
            o Instagram. La atención puede ser online o{" "}
            <Link
              to="/psicologa-iquique"
              className="underline underline-offset-4 hover:text-sage"
            >
              presencial en Iquique
            </Link>.
          </p>
        </div>
        <div className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/5 p-7 sm:p-8">
          {bookingPreview ? (
            <>
              {bookingPreview}
              <p className="mt-4 text-xs leading-5 text-primary-foreground/65">
                ¿Con dudas?{" "}
                <ExternalWhatsAppLink className="underline underline-offset-4 hover:text-sage">
                  Escríbeme por WhatsApp {WHATSAPP_DISPLAY}
                </ExternalWhatsAppLink>
                .
              </p>
            </>
          ) : (
            <>
              <h3 className="font-heading text-3xl">Tu próximo espacio</h3>
              <p className="mt-4 text-sm leading-7 text-primary-foreground/75">
                Coordinamos tu primera hora directamente con Pamela, por el
                canal que prefieras.
              </p>
              <Link
                to="/reservar"
                className="mt-7 flex min-h-12 items-center justify-between gap-4 rounded-full bg-sage px-6 py-3 text-sm font-medium text-primary hover:bg-background"
              >
                Reservar hora online <ArrowUpRight size={18} />
              </Link>
              <ExternalWhatsAppLink className="mt-3 flex min-h-12 items-center justify-between gap-4 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium hover:bg-primary-foreground/10">
                WhatsApp {WHATSAPP_DISPLAY} <ArrowUpRight size={18} />
              </ExternalWhatsAppLink>
              <ExternalInstagramLink className="mt-3 flex min-h-12 items-center justify-between gap-4 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium hover:bg-primary-foreground/10">
                Consultar por Instagram <ArrowUpRight size={18} />
              </ExternalInstagramLink>
              <p className="mt-4 text-xs leading-5 text-primary-foreground/65">
                Si prefieres anticipar detalles, también puedes escribirme por
                WhatsApp o Instagram antes de reservar.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
