import { env } from "@/config/env";
import { siteContent } from "@/config/static-content";

/** WhatsApp público de contacto (decisión de diseño 2026-09-05). */
export const WHATSAPP_NUMBER = "+56979363667";
export const WHATSAPP_DISPLAY = "+56 9 7936 3667";
export const WHATSAPP_URL = "https://wa.me/56979363667";

export const INSTAGRAM_URL = siteContent.social.instagramUrl;
export const PROFESSIONAL_NAME = siteContent.professional.name;

/** URL canónica absoluta construida desde el dominio de producción. */
export function canonicalUrl(path: string): string {
  return new URL(path, env.VITE_PUBLIC_SITE_URL).toString();
}

export const OG_IMAGE_URL = canonicalUrl("/opengraph-image.png");

export type SeoPageKey = "home" | "iquique" | "about";

export const SEO_PAGES: Record<
  SeoPageKey,
  { path: string; title: string; description: string }
> = {
  home: {
    path: "/",
    title: "Psicóloga online Chile | Infantojuvenil y familiar",
    description:
      "Psicoterapia online en Chile: acompañamiento psicológico infantojuvenil y familiar con Pamela Rayen Calderón. Agenda tu primera hora por WhatsApp o Instagram.",
  },
  iquique: {
    path: "/psicologa-iquique",
    title: "Psicóloga en Iquique | Presencial y online",
    description:
      "Psicóloga en Iquique, Tarapacá: terapia presencial y online para infancias, adolescencias y familias. Agenda tu primera hora por WhatsApp o Instagram.",
  },
  about: {
    path: "/sobre-pamela-rayen",
    title: "Pamela Rayen Calderón | Psicóloga Magíster Arteterapia",
    description:
      "Pamela Rayen Calderón, psicóloga de la U. de Tarapacá y Magíster en Salud y Arteterapia. Atención online en Chile y presencial en Iquique, Tarapacá.",
  },
};

export type FaqEntry = { question: string; answer: string };

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `Psicóloga Rayen — ${PROFESSIONAL_NAME}`,
    url: canonicalUrl(SEO_PAGES.home.path),
    image: OG_IMAGE_URL,
    telephone: WHATSAPP_NUMBER,
    areaServed: { "@type": "Country", name: "Chile" },
    sameAs: INSTAGRAM_URL ? [INSTAGRAM_URL] : [],
  };
}

export function faqJsonLd(faqs: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function psychologistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: PROFESSIONAL_NAME,
    url: canonicalUrl(SEO_PAGES.iquique.path),
    image: siteContent.assets.profileImageUrl,
    telephone: WHATSAPP_NUMBER,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Iquique",
      addressRegion: "Tarapacá",
      addressCountry: "CL",
    },
    areaServed: [
      { "@type": "City", name: "Iquique" },
      { "@type": "Country", name: "Chile" },
    ],
    sameAs: INSTAGRAM_URL ? [INSTAGRAM_URL] : [],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFESSIONAL_NAME,
    jobTitle: "Psicóloga",
    url: canonicalUrl(SEO_PAGES.about.path),
    image: siteContent.assets.profileImageUrl,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universidad de Tarapacá" },
      {
        "@type": "EducationalOccupationalProgram",
        name: "Magíster en Salud y Arteterapia",
      },
    ],
    knowsAbout: [
      "Psicología infantojuvenil",
      "Acompañamiento familiar",
      "Arteterapia",
      "Psicoterapia grupal psicodramática",
    ],
    sameAs: INSTAGRAM_URL ? [INSTAGRAM_URL] : [],
  };
}
