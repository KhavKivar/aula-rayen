import {
  ArrowUpRight,
  Brush,
  Camera,
  Layers3,
  PencilRuler,
  Sparkles,
} from "lucide-react";

import { siteContent } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";

export function LandingExperience() {
  return (
    <section className="bg-[#fffdf8] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 rounded-[2rem] border border-[#dfe6df] bg-[#f7f4ec] p-8 sm:p-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="section-kicker">Experiencia en acción</p>
            <h2 className="section-title mt-4">
              Conoce el enfoque de {siteContent.professional.shortName} como
              tallerista.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#62716d]">
              {siteContent.social.instagramUrl
                ? "Mientras seleccionamos una galería editorial de talleres autorizados, puedes revisar en Instagram sus procesos creativos, actividades y recursos profesionales."
                : "Esta versión pública utiliza un perfil y recursos ficticios para demostrar la experiencia sin exponer información personal."}
            </p>
            <ExternalInstagramLink className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#294944] px-5 text-sm font-semibold text-white transition hover:bg-[#355b54] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294944]">
              <Camera aria-hidden="true" size={17} /> Ir a{" "}
              {siteContent.social.instagramHandle ?? "Instagram"}{" "}
              <ArrowUpRight aria-hidden="true" size={16} />
            </ExternalInstagramLink>
          </div>
          <div aria-hidden="true" className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-[2rem_1rem_2rem_1rem] bg-[#d98968] p-6 text-white">
              <Brush size={34} />
            </div>
            <div className="aspect-square translate-y-7 rounded-[1rem_2rem_1rem_2rem] bg-[#f0c972] p-6 text-[#294944]">
              <Layers3 size={34} />
            </div>
            <div className="aspect-square -translate-y-2 rounded-[1rem_2rem_1rem_2rem] bg-[#dce9e3] p-6 text-[#294944]">
              <PencilRuler size={34} />
            </div>
            <div className="aspect-square translate-y-5 rounded-[2rem_1rem_2rem_1rem] bg-[#294944] p-6 text-[#f0c972]">
              <Sparkles size={34} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
