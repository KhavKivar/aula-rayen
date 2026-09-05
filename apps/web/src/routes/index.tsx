import { createFileRoute } from "@tanstack/react-router";

import {
  OG_IMAGE_URL,
  SEO_PAGES,
  canonicalUrl,
  faqJsonLd,
  professionalServiceJsonLd,
} from "@/config/seo";
import { LandingPage } from "@/features/landing/components/landing-page";
import { visibleFaqs } from "@/features/landing/components/landing-faq";

const page = SEO_PAGES.home;
const canonical = canonicalUrl(page.path);

export const Route = createFileRoute("/")({
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
        children: JSON.stringify(professionalServiceJsonLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(visibleFaqs)),
      },
    ],
  }),
  component: LandingPage,
});
