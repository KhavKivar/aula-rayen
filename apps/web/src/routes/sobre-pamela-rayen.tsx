import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/ui/navbar";
import { sessionQueries } from "@/lib/session-queries";
import {
  OG_IMAGE_URL,
  SEO_PAGES,
  canonicalUrl,
  personJsonLd,
} from "@/config/seo";
import { siteContent } from "@/config/static-content";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingProfessional } from "@/features/landing/components/landing-professional";

const page = SEO_PAGES.about;
const canonical = canonicalUrl(page.path);

export const Route = createFileRoute("/sobre-pamela-rayen")({
  head: () => ({
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:type", content: "profile" },
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
        children: JSON.stringify(personJsonLd()),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: session, isPending } = useQuery(sessionQueries.session);

  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} isPending={isPending} />
      <section className="page-container pb-10 pt-10 lg:pb-14 lg:pt-14">
        <p className="section-kicker">Sobre mí</p>
        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.1] tracking-[-0.04em]">
          {siteContent.professional.name}, psicóloga.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          Psicóloga · Magíster en Salud y Arteterapia. Atiendo online en todo
          Chile y de forma presencial en Iquique, Tarapacá: psicoterapia
          infantojuvenil y acompañamiento familiar.
        </p>
        <p className="mt-6 flex max-w-2xl flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            to="/"
            className="underline underline-offset-4 hover:text-terracotta"
          >
            Atención online en Chile
          </Link>
          <Link
            to="/psicologa-iquique"
            className="underline underline-offset-4 hover:text-terracotta"
          >
            Psicóloga en Iquique
          </Link>
        </p>
      </section>
      <LandingProfessional />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
