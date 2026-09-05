import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, MapPin, Video } from "lucide-react";

import { Navbar } from "@/components/ui/navbar";
import { sessionQueries } from "@/lib/session-queries";
import {
  OG_IMAGE_URL,
  SEO_PAGES,
  WHATSAPP_DISPLAY,
  canonicalUrl,
  psychologistJsonLd,
} from "@/config/seo";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingProfessional } from "@/features/landing/components/landing-professional";
import { LandingServices } from "@/features/landing/components/landing-services";
import { LandingTrustBar } from "@/features/landing/components/landing-trust-bar";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";
import { ExternalWhatsAppLink } from "@/features/landing/components/external-whatsapp-link";

const page = SEO_PAGES.iquique;
const canonical = canonicalUrl(page.path);

export const Route = createFileRoute("/psicologa-iquique")({
  head: () => ({
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CL" },
      { property: "og:site_name", content: "Psicóloga Rayen" },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(psychologistJsonLd()),
      },
    ],
  }),
  component: IquiquePage,
});

function LocalModality() {
  return (
    <section
      id="modalidad"
      className="page-container scroll-mt-8 pb-16 lg:pb-24"
    >
      <div className="grid gap-10 rounded-[2rem] bg-secondary p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14">
        <div>
          <p className="section-kicker">Iquique · Tarapacá</p>
          <h2 className="section-title mt-4">
            Presencial en Iquique y online en todo Chile.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Atiendo de forma presencial en Iquique, Tarapacá, y online para
            todo Chile. Psicoterapia infantojuvenil y acompañamiento familiar,
            con la misma calidez en ambos formatos.
          </p>
          <ul className="mt-7 grid gap-3 text-sm">
            <li className="flex items-start gap-2 leading-6">
              <MapPin
                size={17}
                className="mt-0.5 shrink-0 text-terracotta"
                aria-hidden="true"
              />
              Presencial en Iquique, Tarapacá — coordinamos el lugar al
              agendar.
            </li>
            <li className="flex items-start gap-2 leading-6">
              <Video
                size={17}
                className="mt-0.5 shrink-0 text-terracotta"
                aria-hidden="true"
              />
              Online por videollamada, estés donde estés en Chile.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7 sm:p-8">
          <h3 className="font-heading text-2xl">Agenda tu primera hora</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Escríbeme y acordamos fecha y modalidad directamente.
          </p>
          <ExternalWhatsAppLink className="text-link mt-6">
            WhatsApp {WHATSAPP_DISPLAY} <ArrowUpRight size={18} />
          </ExternalWhatsAppLink>
          <ExternalInstagramLink className="text-link mt-3">
            Consultar por Instagram <ArrowUpRight size={18} />
          </ExternalInstagramLink>
          <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
            Conoce mi formación en{" "}
            <Link
              to="/sobre-pamela-rayen"
              className="underline underline-offset-4 hover:text-terracotta"
            >
              Sobre Pamela Rayen Calderón
            </Link>{" "}
            o vuelve a la{" "}
            <Link
              to="/"
              className="underline underline-offset-4 hover:text-terracotta"
            >
              atención online en Chile
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function IquiquePage() {
  const { data: session, isPending } = useQuery(sessionQueries.session);

  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} isPending={isPending} />
      <LandingHero
        kicker="Psicóloga en Iquique · Tarapacá"
        title={
          <>
            Psicóloga en Iquique: terapia{" "}
            <em className="font-normal text-terracotta">presencial</em> y
            online a tu ritmo.
          </>
        }
        description="Acompañamiento psicológico presencial en Iquique, Tarapacá, y online en todo Chile: terapia infantojuvenil y familiar con Pamela Rayen Calderón."
        heroAlt="Psicóloga en Iquique: retrato de Pamela Rayen Calderón"
      />
      <LandingTrustBar />
      <LocalModality />
      <LandingServices />
      <LandingProfessional />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
