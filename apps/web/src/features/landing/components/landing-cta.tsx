import { ArrowUpRight, Camera } from "lucide-react";

import { siteContent } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";

export function LandingCta() {
  return (
    <section className="bg-[#d98968] px-5 py-20 text-center text-white sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Estamos preparando el primer curso
        </p>
        <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Que tu próximo taller empiece con una ruta clara.
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-white/78">
          {siteContent.social.instagramUrl
            ? `Sigue a ${siteContent.professional.shortName} en Instagram para conocer el proceso y enterarte cuando se abran las inscripciones.`
            : "Explora el catálogo para conocer las próximas formaciones y materiales disponibles."}
        </p>
        <ExternalInstagramLink className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#294944] px-6 text-sm font-semibold text-white transition hover:bg-[#203d38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <Camera aria-hidden="true" size={18} /> Seguir en Instagram{" "}
          <ArrowUpRight aria-hidden="true" size={16} />
        </ExternalInstagramLink>
      </div>
    </section>
  );
}
