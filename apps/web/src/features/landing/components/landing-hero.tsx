import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { FlowerVisual } from "@/components/flower-visual";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_DISPLAY } from "@/config/seo";
import { siteContent } from "@/config/static-content";
import { ExternalWhatsAppLink } from "@/features/landing/components/external-whatsapp-link";

export function LandingHero({
  kicker = "Psicología con calidez",
  title = (
    <>
      Un espacio para <em className="font-normal text-terracotta">florecer</em> a
      tu ritmo.
    </>
  ),
  description = "Te acompaño a comprender lo que sientes y a cuidar de ti y de tus vínculos, con sesiones online y presenciales.",
  heroAlt = "Retrato de Pamela Rayen Calderón, psicóloga",
}: {
  kicker?: string;
  title?: ReactNode;
  description?: string;
  heroAlt?: string;
} = {}) {
  return (
    <section className="page-container grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:pb-20 lg:pt-14">
      <div className="py-4 lg:py-8">
        <p className="section-kicker">{kicker}</p>
        <p className="mt-3 inline-flex rounded-full border border-dashed border-terracotta px-3 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
          Prueba de CD web · 13-09-2026
        </p>
        <h1 className="mt-6 max-w-2xl font-heading text-[clamp(2.8rem,5.4vw,5rem)] leading-[1.08] tracking-[-0.045em]">
          {title}
        </h1>
        <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#agenda" className={buttonVariants({ size: "lg" })}>
            Agendar mi primera hora <ArrowUpRight size={18} />
          </a>
          <a
            href="#atencion"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Conocer los servicios
          </a>
        </div>
        <ExternalWhatsAppLink className="text-link mt-5">
          Escríbeme por WhatsApp {WHATSAPP_DISPLAY} <ArrowUpRight size={18} />
        </ExternalWhatsAppLink>
        <div className="mt-10 flex items-center gap-3 border-t border-border pt-6 lg:mt-12">
          <img
            src={siteContent.assets.profileImageUrl}
            alt={heroAlt}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">
              {siteContent.professional.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Psicóloga · Magíster en Salud y Arteterapia
            </p>
          </div>
        </div>
      </div>
      <FlowerVisual className="mx-auto w-full max-w-lg lg:max-w-none" />
    </section>
  );
}
