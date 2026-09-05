import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://api.example.com/auth",
    VITE_PUBLIC_SITE_URL: "https://psicologarayen.cl",
  },
}));

import {
  OG_IMAGE_URL,
  SEO_PAGES,
  WHATSAPP_URL,
  canonicalUrl,
  faqJsonLd,
  personJsonLd,
  professionalServiceJsonLd,
  psychologistJsonLd,
} from "@/config/seo";

describe("canonical SEO", () => {
  it("construye canónicas absolutas sobre el dominio de producción", () => {
    expect(canonicalUrl("/")).toBe("https://psicologarayen.cl/");
    expect(canonicalUrl("/psicologa-iquique")).toBe(
      "https://psicologarayen.cl/psicologa-iquique",
    );
    expect(OG_IMAGE_URL).toBe(
      "https://psicologarayen.cl/opengraph-image.png",
    );
  });

  it("expone tres títulos únicos con keywords por intención", () => {
    const titles = [SEO_PAGES.home.title, SEO_PAGES.iquique.title, SEO_PAGES.about.title];
    expect(new Set(titles).size).toBe(3);
    expect(SEO_PAGES.home.title).toContain("Psicóloga online");
    expect(SEO_PAGES.home.title).toContain("Chile");
    expect(SEO_PAGES.home.title.length).toBeGreaterThanOrEqual(50);
    expect(SEO_PAGES.home.title.length).toBeLessThanOrEqual(60);
    expect(SEO_PAGES.iquique.title).toContain("Iquique");
  });

  it("expone descripciones con geo, modalidad y agenda", () => {
    expect(SEO_PAGES.home.description).toContain("online");
    expect(SEO_PAGES.home.description).toContain("Chile");
    expect(SEO_PAGES.home.description).toContain("primera hora");
    expect(SEO_PAGES.home.description.length).toBeGreaterThanOrEqual(150);
    expect(SEO_PAGES.home.description.length).toBeLessThanOrEqual(160);
    expect(SEO_PAGES.iquique.description).toContain("Iquique");
    expect(SEO_PAGES.iquique.description).toContain("presencial");
    expect(SEO_PAGES.iquique.description).toContain("online");
  });

  it("apunta WhatsApp al número público acordado", () => {
    expect(WHATSAPP_URL).toBe("https://wa.me/56979363667");
  });

  it("genera ProfessionalService con área Chile e Instagram", () => {
    const schema = professionalServiceJsonLd();
    expect(schema["@type"]).toBe("ProfessionalService");
    expect(schema.areaServed).toMatchObject({ name: "Chile" });
    expect(schema.url).toBe("https://psicologarayen.cl/");
    expect(schema.sameAs).toContain(
      "https://www.instagram.com/psicologa_rayen/",
    );
  });

  it("genera FAQPage que refleja las preguntas visibles", () => {
    const faqs = [{ question: "¿P?", answer: "R." }];
    const schema = faqJsonLd(faqs);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]).toMatchObject({ name: "¿P?" });
  });

  it("genera Psychologist con NAP solo-ciudad Iquique", () => {
    const schema = psychologistJsonLd();
    expect(schema.address).toMatchObject({
      addressLocality: "Iquique",
      addressRegion: "Tarapacá",
      addressCountry: "CL",
    });
    expect(schema.telephone).toBe("+56979363667");
    expect(schema.name).toBe("Pamela Rayen Calderón");
  });

  it("genera Person con credenciales E-E-A-T", () => {
    const schema = personJsonLd();
    expect(schema.name).toBe("Pamela Rayen Calderón");
    expect(schema.jobTitle).toContain("Psicóloga");
    expect(JSON.stringify(schema.alumniOf)).toContain(
      "Universidad de Tarapacá",
    );
    expect(JSON.stringify(schema.alumniOf)).toContain(
      "Magíster en Salud y Arteterapia",
    );
  });
});
