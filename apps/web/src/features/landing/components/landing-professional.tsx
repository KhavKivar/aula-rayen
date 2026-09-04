import { Check } from "lucide-react";

import { siteContent } from "@/config/static-content";

export function LandingProfessional() {
  return (
    <section
      id="profesional"
      className="scroll-mt-8 bg-[#e6eee9] py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-12">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem_7rem_2rem_2rem] bg-[#d9c9aa]">
          <img
            src={siteContent.assets.profileImageUrl}
            alt={siteContent.assets.profileImageAlt}
            width={430}
            height={538}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
        <div>
          <p className="section-kicker">Quien está detrás</p>
          <h2 className="section-title mt-4">
            {siteContent.professional.name}
          </h2>
          {siteContent.professional.biography.map((paragraph, index) => (
            <p
              className={
                index === 0
                  ? "mt-6 text-lg leading-8 text-[#425852]"
                  : "mt-4 leading-7 text-[#62716d]"
              }
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
          <p className="mt-4 leading-7 text-[#62716d]">
            En {siteContent.brandName}, la experiencia profesional se
            convierte en rutas prácticas para crear espacios grupales
            cuidados, claros y significativos.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {siteContent.professional.credentials.map((credential) => (
              <li
                key={credential}
                className="flex items-start gap-3 text-sm font-medium text-[#394d48]"
              >
                <Check
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#c66f51]"
                  size={17}
                />
                {credential}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
